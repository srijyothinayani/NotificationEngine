var request = require('request'),
    nodemailer = require('nodemailer'),
    config = require('../../config/config.json'),
    mailconfig = require('../../config/mailconfig'),
    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: mailconfig.forgotMailUsername, // Your email id
            pass: mailconfig.forgotMailPassword // Your password
        }
    });

module.exports = {
    execute: () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        today = dd + '/' + mm + '/' + yyyy;
        today = today.split('T')[0];
        request('http://192.169.243.70:5004/contents/slot/users/appointments/5be40fed50b922569edd3946', function (error, response, body) {
            var response = JSON.parse(body).appointments;
            response.forEach(function (appointment) {
                var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                var day = currentDate.getDate()
                var month = currentDate.getMonth() + 1
                var year = currentDate.getFullYear();
                var tomorrow = day + "/" + month + "/" + year;
                if (appointment.booking_slot_date) {
                    if (appointment.booking_slot_date == tomorrow) {
                        request('http://192.169.243.70:5004/users/view/' + appointment.user_id, function (error, response, body) {
                            var userData = JSON.parse(body).result,
                                html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><title>Vortex</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"></head><style>.welcome h3{color: #ffae24;font-size: 24px;}.welcome a{text-decoration:underline;color:#1c0b7d;}.welcome{border: 2px solid #1c0b7d;padding: 17px;margin: 12px;}</style><body><div class="container-fluid"><div class="container"><div class="row "><div class="col-lg-4 welcome" style="border: 2px solid #1c0b7d;padding: 17px;margin: 12px;"><div class="row"><div class="col-lg-3"><img src="../logo.png"></div><div class="col-lg-9 mt-5" ><h2>Vortex</h2></div></div><div class="row  mt-3"><div class="col-lg-12 text-center"><h3 style="color: #ffae24;font-size: 24px;">Welcome To Vortex</h3><a style="text-decoration: underline;color: #1c0b7d;" href="http://fansadda.mobi" target="blank">http://fansadda.mobi</a></div></div></div></div></div></div></body></html>';
                            var mailOptions = {
                                from: '"VORTEX"<versatilemobitech@gmail.com>', // sender address
                                to: "srijyothin.versatilemobitech@gmail.com", //userData.email, // list of receivers
                                subject: "Don't forget to attend your appointment scheduled for next hour", // Subject line
                                html: html // You can choose to send an HTML
                            };
                            transporter.sendMail(mailOptions, function (err, data) {
                                if (err) {
                                    console.log("error  ", err);
                                }
                                else {
                                    console.log("Mail sent successfully  ", data);
                                }
                            });
                        });
                    }
                }
            });
        });
    }
};