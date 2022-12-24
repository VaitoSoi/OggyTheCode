const { request, response } = require('express')

module.exports = {
    name: 'api',
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    run: (req, res) => {
        res.send('We currently do not support api :c (đc tài trợ bởi gg dịch nên có sai thì đừng chửi nhe :))')
    }
}