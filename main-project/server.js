const app = require('./app');
const { db } = require('./config/db');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🏥 ClinicQ Health Centre API Server`);
    console.log(`📡 Status: ONLINE | Port: ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📚 Health Check: http://localhost:${PORT}/`);
    console.log('====================================================');
});

// Graceful Shutdown
const gracefulShutdown = () => {
    console.log('\nShutting down server gracefully...');
    server.close(() => {
        console.log('HTTP server closed.');
        db.close((err) => {
            if (err) {
                console.error('Error closing SQLite database:', err.message);
            } else {
                console.log('SQLite database connection closed.');
            }
            process.exit(0);
        });
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
