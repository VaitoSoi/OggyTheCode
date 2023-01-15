module.exports = () => {
    const express = require('express'),
        app = express(),
        port = 3000,
        api = require('./handler')(),
        rateLimit = require('express-rate-limit'),
        apiLimiter = rateLimit({
            windowMs: 60 * 1000,
            max: 10,
            message: 'Too many connection, please try again after 1 minute',
        });
    //app.use(apiLimiter)
    app.listen(port, () => {
        console.log('[EXPRESS] listen on https://localhost:' + port);
        Object.keys(api.get).forEach((key) => {
            app.get('/' + api.get[key].name, (req, res) => api.get[key].run(req, res))
        })
    });
}