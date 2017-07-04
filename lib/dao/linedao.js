const config = require('../../config/env/');
const Kafka = require('no-kafka');
const _ = require('lodash');



module.exports = function () {
    var producer = new Kafka.Producer(config.kafka);
    return {
        insert: _.partial(insert, producer)
    };
};

//Insert into kafka the event (in this case the line readed from log file)
function insert(producer, event) {
    return producer.init().then(() => {
        return producer.send({
            topic: config.kafka.topic,
            message: {
                value: JSON.stringify(event)
            }
        });
    });
}