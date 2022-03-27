const setchannel = require('../models/setchannel')

module.exports = {
    name: 'guildDelete',
    run(guild) {
        setchannel.findOneAndDelete({ guildid: guild.id }, (err, data) => {
            if (err) throw err;
            if (data) {
                data.save()
            } else {
                return
            }
        })
    }
}
