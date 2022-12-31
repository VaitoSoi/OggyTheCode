const { Request, Response } = require('express')

module.exports = {
    name: 'api',
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    run: (req, res) => {
        res.redirect('https://api.mo0nbot.ga/')
    }
}