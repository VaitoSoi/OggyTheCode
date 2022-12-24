const fs = require('fs')

module.exports = () => {
    const folders = fs.readdirSync('./express/').filter(
        folder => fs.lstatSync('./express/' + folder).isDirectory()
    );
    let output = {};
    for (let i in folders) {
        const files = fs.readdirSync(`./express/${folders[i]}/`)
        output[folders[i]] = {}
        for (let y in files) {
            const api = require(`./${folders[i]}/${files[y]}`)
            if ((!api.name || !api.run) && files[y] != 'main.js') throw new Error('api file missing name or run function: ' + files[y])
            output[folders[i]][files[y]] = api
        }
    }
    return output
}