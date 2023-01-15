const { Request, Response } = require('express')

module.exports = {
    name: 'support',
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    run: (req, res) => {
        res.redirect('https://discord.gg/NBsnNGDeQd')
    }
}