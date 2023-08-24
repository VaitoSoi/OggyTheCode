import { CompilerCommandBuilder } from "../compiler";

export default new CompilerCommandBuilder()
    .setName('events')
    .setAliases(['when'])
    .setOptions(
        { name: 'event', optional: false, type: 'string' },
        { name: 'once', optional: false, type: 'string' },
        { name: '...excute', optional: false, type: 'string' },
    )
    .setExecute((command, compiler) => {

    })