const { request, response } = require('express')
const package = require('../../package.json')

module.exports = {
    name: '',
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    run: (req, res) => {
        res.sendFile('main.html', { root: './express/' })
    }
}