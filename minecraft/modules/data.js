const db = require('../../models/players')

/**
 * 
 * @param {String} username 
 * @param {{total: Number, record: String[]}} death 
 * @param {{total: Number, record: String[]}} kill 
 * @param {{join: Number, seen: Number}} date 
 * @returns 
 */
function create(username, death, kill, date) {
    return new db({
        name: username,
        death: {
            total: 0,
            record: death.record ? death.record : []
        },
        kill: {
            total: 0,
            record: kill.record ? death.record : []
        },
        date: {
            join: date.join ? date.join : 0,
            seen: date.seen ? date.seen : 0
        }
    })
}

/**
 * @param {String} username
 * @param {Number} date 
 */
async function join(username, date) {
    let data = await db.findOne({
        name: username
    })
    if (!data) data = create(username, {}, {}, { join: date })
    else data.date.join = date
    await data.save()
}

/**
 * @param {String} username
 * @param {Number} date 
 */
async function seen(username, date) {
    let data = await db.findOne({
        name: username
    })
    if (!data) data = create(username, {}, {}, { seen: date })
    else if (data.date.join == 0) data.date.join = date
    await data.save()
}

/**
 * @param {String} message
 * @param {String} victim
 * @param {String} killer 
 */
async function kill_death(message, victim, killer) {
    //let exec = reg.exec(message)
    //let victim_name = exec[1] ? exec[1] : undefined
    //let killer_name = exec[2] ? exec[2] : undefined
    //console.log({ message, victim, killer })
    if (victim) {
        let data = await db.findOne({
            name: victim
        })
        if (!data) data = create(victim, { total: 0, record: [message] }, {}, {})
        else { data.death.record.push(message) }
        await data.save()
    }
    if (killer) {
        let data = await db.findOne({
            name: killer
        })
        if (!data) data = create(killer, {}, { total: 0, record: [message] }, {})
        else { data.kill.record.push(message) }
        await data.save()
    }
}

module.exports = {
    join, seen, create, kill_death
}