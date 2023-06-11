import _package from './package.json';
console.log(
    `\n\n` +
    ` -----     OggyTheCode     ----\n` +
    `> Create by: ${_package.author}\n` +
    `> Version: ${_package.version}\n` +
    `> License: ${_package.license}\n\n`
)

import { Oggy, ENV, YAML } from './src/index'
import { parse } from 'yaml'
import { readFileSync, existsSync } from 'node:fs'
import dotenv from 'dotenv'
let config: ENV | YAML | any;
const envReg = /^env=(.+)$/
const yamlReg = /^yaml=(.+)$/
if (!process.argv[2] || process.argv[2] == 'env' || envReg.test(process.argv[2])) {
    const path =
        !process.argv[2] || process.argv[2] == 'env'
            ? 'config.env'
            : (
                envReg.test(process.argv[2])
                    ? (envReg.exec(process.argv[0]) ?? ['', 'config.env'])[1]
                    : 'config.env'
            )
    if (!existsSync(path)) console.log('[SYSTEM] Loading config from local environment')
    else {
        console.log(`[SYSTEM] Loading config from env file '${path}'`)
        dotenv.config({ path })
    }
    config = new ENV(process.env)
} else if (process.argv[2] == 'yaml' || yamlReg.test(process.argv[2])) {
    const path =
        yamlReg.test(process.argv[2])
            ? (yamlReg.exec(process.argv[2]) ?? ['', 'config.yaml'])[1]
            : 'config.yaml'
    if (!existsSync(path)) throw new Error(`file '${path}' doesn't exist`)
    console.log(`[SYSTEM] Loading config from yaml file '${path}'`)
    config = new YAML(parse(readFileSync(path, { encoding: 'utf-8' })))
}
else throw new Error(`unknown cofig ${process.argv[2]}`)
const client = new Oggy(config)
client.start()