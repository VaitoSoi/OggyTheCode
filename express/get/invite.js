const { Request, Response } = require('express')

module.exports = {
    name: 'invite',
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    run: (req, res) => {
        let req_id
        const { client1, client2 } = require('../../index')
        if (req.query.instance) 
            switch (req.query.instance) {
                case 'client1': req_id = client1.user.id; break
                case 'client2': req_id = client2.user.id; break
            }
        else if (req.query.id)
            switch (req.query.id) {
                case client1.user.id: req_id = client1.user.id; break
                case client2.user.id: req_id = client2.user.id; break
            }
        const id = req_id || client1.user.id
        const permissions = '93264'
        const scope = 'bot+applications.commands'
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${id}&permissions=${permissions}&scope=${scope}`)
    }
}