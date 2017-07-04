'use strict';

module.exports = {
    environment: process.env.NODE_ENV || "local",
    winston: {
        level: "debug",
        fileName: "logParser.log"
    },
    fsreader: {
        path: "./tmp"
    },
    fsparser: {
        regexp: ""
    },
    kafka: {
        connectionString: process.env.KAFKA_URL || 'localhost:9092',
        retries: {
            attempts: process.env.KAFKA_ATTEMPTS || 3
        },
        topic: process.env.KAFKA_TOPIC || 'templogfiles'
    }
    
};
