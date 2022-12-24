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
        res.send('The official code of OggyTheBot#8210 and OggyTheBot 2#8728')
    }
}