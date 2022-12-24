module.exports = () => {
    const express = require('express'),
        app = express(),
        port = 3000,
        api = require('./handler')()
    app.listen(port);
    console.log('[EXPRESS] listen on https://localhost:' + port);
    Object.keys(api.get).forEach((key) => {
        app.get('/' + api.get[key].name, (req, res) => api.get[key].run(req, res))
    })
}