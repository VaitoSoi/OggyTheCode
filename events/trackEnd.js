const { Track, Queue } = require('discord-player')
const temp = require('../models/tempmusic')

module.exports = {
    name: 'trackEnd',
    player: true,
    /**
     * 
     * @param {Queue} queue 
     * @param {Track} track 
     */
    async run(queue, track) {
        const data = await temp.findOne({ guildid: queue.metadata.guild.id })
        if (!data) return
        await queue.metadata.messages.cache.get(data.msgid).delete()
        await temp.findOneAndDelete({ guildid: queue.metadata.guild.id })
    }
}