const db = require('../../models/players')

/**
 * @param {String} name 
 */
module.exports.join = async (username, date) => {
    let data = await db.findOne({
        name: username
    })
    let first = {
        num: 0,
        first: '',
        last: ''
    }
    if (!data) data = new db({
        name: username,
        death: first,
        kill: first,
        date: {
            join: date,
            seen: 0,
        }
    })
    else data.date.join = date
    await data.save()
}


/**
 * @param {String} name 
 */
module.exports.seen = async (username, date) => {
    let data = await db.findOne({
        name: username
    })
    let first = {
        num: 0,
        first: '',
        last: ''
    }
    if (!data) data = new db({
        name: username,
        death: first,
        kill: first,
        date: {
            join: 0,
            seen: date,
        }
    })
    else data.date.join = date
    await data.save()
}