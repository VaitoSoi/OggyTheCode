const highway = require('../../models/highway')

module.exports = {
    name: 'update',
    description: 'Update tiến trình đào highway',
    run: async (client, message, args) => {
        let data = highway.findOne({ which: 'straight' })
            , updatedata = args[0]
            , how = Number(args[1])
            , old = 0
            , name = {}
        if (message.author.id !== '692271452053045279' && message.author.id !== '749964743854522439' && message.author.id !== '485419430885457930' && message.author.id !== '321553911716642822') return message.channel.send('M là ai, m là thg nào, t ko quen m, tránh xa t ra!')
        if (!updatedata) return message.channel.send("Vui lòng ghi tên 1 đường cao tốc!")
        if (updatedata !== 'x+' && updatedata !== 'x-' && updatedata !== 'z+' && updatedata !== 'z-') return message.channel.send('Không tìm thấy đường cao tốc `' + updatedata + '`')
        if (!how) return message.channel.send('Vui lòng thêm 1 con số từ 1 -> 3750')
        if (isNaN(how)) return message.channel.send('Vui lòng thêm 1 con số hợp lệ từ 1 -> 3750')
        if (how > 3750) return message.channel.send('Không thể nhập giá trị lớn hơn `3750`')
        if (updatedata === 'x+') {
            old = Number(data.xplus)
            name = { 'data.xplus': how }
        } else if (updatedata === 'z+') {
            old = Number(data.zplus)
            name = { 'data.zplus': how }
        } else if (updatedata === 'x-') {
            old = Number(data.xminus)
            name = { 'data.xminus': how }
        } else if (updatedata === 'z-') {
            old = Number(data.zminus)
            name = { 'data.xminus': how }
        }
        if (how < old) return message.channel.send(`Data mới không thể nhỏ hơn \`${old}\``)
        if (old >= 3750) return message.channel.send('Không thể thay đổi giá trị của đoạn đường đã đạt đến 3750k')
        highway.findOne({
            which: 'straight'
        }, {
            $set: name
        })
    }
}