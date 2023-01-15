const { Request, Response } = require('express')

module.exports = {
    name: 'docs',
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    run: (req, res) => {
        res.redirect('https://github.com/VaitoSoi/oggy-docs')
    }
}