import { model, Schema } from 'mongoose'

export default model('option', new Schema({
    guildid: String,
    guildname: String,
    config: {
        channels: {
            livechat: String,
            status: String,
            restart: String,
        },
        /*
        messages: {
            status: String,
            restart: String,
        },
        roles: {
            restart: String,
        },
        feature: {
            chatType: String,
            timestamp: String,
            join_leave: String,
        }
        */
    }
}))