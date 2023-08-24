import express, { Express } from 'express'
import rateLimit from 'express-rate-limit'
import { Oggy } from '../lib/index';

export default class {
    express: Express;
    oggy: Oggy;
    constructor(oggy: Oggy) {
        this.oggy = oggy
        this.express = express()
    }
    public listen(port: number = 8000): void {
        this.express.get('/', (req, res) => res.redirect('https://discord.gg/NBsnNGDeQd'))
        this.express.get('/invite', (req, res) => {
            let id: string | undefined = this.oggy.client_1.user?.id;
            switch (req.query.instance) {
                case 'client1': id = this.oggy.client_1.user?.id; break
                case 'client2': id = this.oggy.client_2.user?.id; break
            }
            const permissions = req.query.permission || '93264'
            const scope = req.query.permission || 'bot+applications.commands'
            res.redirect(`https://discord.com/oauth2/authorize?client_id=${id}&permissions=${permissions}&scope=${scope}`)
        })
        this.express.get('/docs', (req, res) => res.redirect('https://github.com/VaitoSoi/OggyTheCode/tree/main/docs'))
        this.express.listen(port)
        this.express.use(rateLimit({
            windowMs: 60 * 1000,
            max: 10,
            message: 'Bạn đã gửi quá nhiều request (> 10) trong 1 phút, vui lòng thử lại sau',
        }))
        console.log(`[EXPRESSS] Listen on port ${port}`)
    }
}