const axios = require('axios');

module.exports = {
    name: 'chat',
    category: 'user',
    aliases: ['c'],
    description: 'Để chat với với bot tiếng Anh(thường dành cho mấy thg tự kỷ)',
    usage: 'chat <điều m muốn tâm sự với bot> và bot chỉ hỗ trợ tiếng Anh(vì nó free, thg dev là thg đỗ nghèo khỉ nên ae thông cảm cho nó)',
    run: async (client, message, args) => {
        try {
            const res = await axios.get(`http://api.brainshop.ai/get?bid=159817&key=Q8GHVOwYFPQLaW3K&uid=1&message=${encodeURIComponent(args.join('  '))}`);
            message.channel.send(res.data.cnt);
        }
        catch (e) {
            message.channel.send('Ơ dev ơi, m lm sao mà t bị lỗi r nè. Fix đi không lại bị gạch chọi vào đầu t ko chịu trách nhiệm cho m đâu nghen.')
        }
    }
}