# logParser

Log parser written in node:

-Set in env/local.js:
    in winston:
        -The level of log trace, if set to debug everything will be traced.
        -The name of the log file to write the logs to.
    in fsreader:
        -The name of the FOLDER to watch for:
            -log existing files
            -new log files generated
            -updates of existing log files
    in kafka:
        -The connection string to Kafka instance.
        -The attemps to insert values.
        -The name of the TOPIC to store logs lines.



Setting Kafka in docker:
Install docker and run:
docker run -p 2181:2181 -p 9092:9092 --env ADVERTISED_HOST=localhost --env ADVERTISED_PORT=9092 spotify/kafka
This will start a kafka instance on localhost listening to 9092 port of host machine.

Install dependencies with:
    - npm i
Start app with:
    - node start
-Parser will send lines from log files to kafka instance.



Advanced:
To enter into the kafka machine:
    -'docker ps -a' to list docjer instances, check the CONTAINER ID of the kafka image and execute:
    -'docker exec -i -t CONTAINER_ID /bin/bash'
    -inside the image execute: 'cd /opt/kafka_2.11-0.10.1.0/' and
    -'./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic templogfiles --from-beginning'

this will connect to kafka topic and allow you to see the events that come into the topic

NOTE: To log into the console or in file, change the desired transport class in modules/logger.js    