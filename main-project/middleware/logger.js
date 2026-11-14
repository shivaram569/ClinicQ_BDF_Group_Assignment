// HTTP Request Logger Middleware
const logger = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        const color = statusCode >= 500 ? '\x1b[31m' // Red
                    : statusCode >= 400 ? '\x1b[33m' // Yellow
                    : statusCode >= 300 ? '\x1b[36m' // Cyan
                    : '\x1b[32m';                    // Green
        const reset = '\x1b[0m';

        console.log(`[${timestamp}] ${req.method.padEnd(6)} ${req.originalUrl} ${color}${statusCode}${reset} - ${duration}ms`);
    });

    next();
};

module.exports = logger;
