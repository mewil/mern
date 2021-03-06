var router = require('express').Router(),
    ConfigurationSchema = require('../../db/model/Configuration.js'),
    authMiddleware = require('../../middleware/auth.js'),
    Responses = require('../../responses/api/index.js'),
    User = require('../../db/model/User.js');

// Handles get requests for /v1/configuration
router.get('/', function(req, res) {
    ConfigurationSchema.findOne({})
        .exec()
        .then(configuration => {
            console.log(configuration)
            if (configuration) {
                authMiddleware('any', 'api', false, function() {
                    res.send({
                        status: true,
                        configuration: Object.assign(
                            {},
                            configuration.toJSON(),
                            {
                                should_logout: true
                            }
                        )
                    });
                })(req, res, function() {
                    User.find()
                        .byToken(req.authToken)
                        .then(user => {
                            user.getProfile().then(profile => {
                                res.send({
                                    status: true,
                                    user: profile,
                                    configuration: configuration
                                });
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send({
                                status: false,
                                message: Responses.UNKNOWN_ERROR
                            });
                        });
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: Responses.UNKNOWN_ERROR
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

// Handles post requests for /v1/configuration/control
//This is on route /configuration/control so it is not easily accessible (it should be limited to one configuration at a time)
router.post('/control', authMiddleware('admin', 'api'), function(req, res) {
    ConfigurationSchema.findOne()
        .exec()
        .then(configuration => {
            if (configuration) {
                configuration.app_name =
                    req.body.app_name || configuration.app_name;
                configuration.save();
                res.send({
                    status: true
                });
            } else {
                if (
                    req.body.app_name &&
                    req.body.start_date &&
                    req.body.end_date
                ) {
                    ConfigurationSchema.create({
                        app_name: req.body.app_name
                    })
                        .then(() => {
                            res.send({
                                status: true
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send({
                                status: false,
                                message: Responses.UNKNOWN_ERROR
                            });
                        });
                } else {
                    res.status(401).send({
                        status: false,
                        message: Responses.PARAMS_NOT_FOUND
                    });
                }
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                status: false,
                message: Responses.UNKNOWN_ERROR
            });
        });
});

module.exports = router;
