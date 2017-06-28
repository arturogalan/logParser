'use strict';

module.exports = {
    environment: process.env.NODE_ENV || "local",
    winston: {
        level: "debug",
        fileName: "fsreader.log"
    },
    fsreader: {
        path: "./tmp"
    },
    logger: [
        {
            level: 'debug',
            timestamp: false,
            handleExceptions: true,
            prettyPrint: true,
            silent: false,
            json: false,
            colorize: true
        }
    ],
    
};
