// Global Error Handling Middleware

// 404 Not Found Middleware for undefined routes
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: `Endpoint not found: ${req.method} ${req.originalUrl}`
    });
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Application Error:', err);

    // Handle SQLite unique constraint error
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
            success: false,
            error: 'A record with that unique value already exists (e.g. duplicate room number).'
        });
    }

    // Handle SQLite foreign key constraint failure
    if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
        return res.status(400).json({
            success: false,
            error: 'Foreign key constraint violated: referenced doctor or room does not exist.'
        });
    }

    // Handle JSON parsing error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            error: 'Malformed JSON payload in request body.'
        });
    }

    // Default internal server error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
