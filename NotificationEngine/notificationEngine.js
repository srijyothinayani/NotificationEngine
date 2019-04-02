var Agenda = require('agenda'),
    request = require('request'),
    config = require('../config/config.json'),
    remindersData = require('./data.json'),
    mongoHost = config.dev.mongodb.host,
    agendaNotificationJob = new Agenda({ db: { address: mongoHost, collection: 'agendaJobs' } });

agendaNotificationJob.define('execute', function (job, done) {
    request('http://localhost:5004/contents/jobs', function (error, response, body) {
        var responses = JSON.parse(body);
        responses.data.forEach(function (singleJob) {
            console.log(singleJob);
            agendaNotificationJob.every(singleJob.schedule.time + ' ' +
                singleJob.schedule.type, singleJob.name, singleJob.type ? singleJob.type : null);
            agendaNotificationJob.define(singleJob.name, function (res, done) {
                var job = require(remindersData.modules[singleJob.module]);
                job.execute(singleJob);
                done();
            });
        });
    });
    done();
});

agendaNotificationJob.on('ready', function () {
    console.log("on ready");
    agendaNotificationJob.every('in 1 minute', 'execute');
    agendaNotificationJob.start();
});