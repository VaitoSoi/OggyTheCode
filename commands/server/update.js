const highway = require('../../models/highway')

module.exports = {
    name: 'update',
    description: 'Update tiến trình đào highway',
    run: async (client, message, args) => {
        if (message.author.id !== '692271452053045279' && message.author.id !== '749964743854522439' && message.author.id !== '485419430885457930' && message.author.id !== '321553911716642822') return message.channel.send('M là ai, m là thg nào, t ko quen m, tránh xa t ra!')
        const updatedata = args[0]
        if (!updatedata) return message.channel.send("Ê nha, không cho thông tin biết thg nào mà cập nhật hả má.")
        if (updatedata !== 'x+' && updatedata !== 'x-' && updatedata !== 'z+' && updatedata !== 'z-') return message.channel.send('Ê nha có 4 đg cao tốc thôi nha. Ghi cho cẩn thận vào.')
        const how = args[1]
        if (!how) return message.channel.send("Rồi m muốn up nó lên báo nhiêu không đưa sao t biết nó dài ra thêm bao nhiêu")
        if (isNaN(how)) return message.channel.send('"M đg nhập j đó. Ê nha, bot t mong manh dễ crash lắm nha. Bot mà crash m tự đi mà mở lại nha. T ko chịu trách nhiệm đâu": Dev said')
        if (updatedata === 'x+') {
            highway.findOne({ which: 'straight' }, async (err, data) => {
                if (how < data.xplus) return message.channel.send(`Data mới không thể nhỏ hơn "${data.xplus}"`)
                if (how > 3750) return message.channel.send('Không thể nhập giá trị lớn hơn "125')
                if (data.xplus >= 3750) return message.channel.send('Không thể thay đổi giá trị của đoạn đường đã đạt đến 125k')
                const old = data.xplus
                highway.findOneAndDelete({})
                highway.findOneAndUpdate({ xplus: old }, { $set: { xplus: how } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send('Đã cập nhật data')
                })
                data.save()
            })
        }
        if (updatedata === 'x-') {
            highway.findOne({ which: 'straight' }, async (err, data) => {
                if (how > 3750) return message.channel.send('Không thể nhập giá trị lớn hơn "125')
                else if (data.xminus >= 3750) return message.channel.send('Không thể thay đổi giá trị của đoạn đường đã đạt đến 125k')
                else if (how) {
                    if (how > data.xminus) {
                        update()
                    } else return message.channel.send(`Data mới "${how}" không thể nhỏ hơn "${data.xminus}"`)
                }
                function update() {
                    highway.findOneAndUpdate({ xminus: data.xminus }, { $set: { xminus: how } }, async (err, data) => {
                        if (err) throw err;
                        message.channel.send('Đã cập nhật data')
                    })
                    data.save()
                }
            })
        }
        if (updatedata === 'z+') {
            if (100 < how) {
                highway.findOne({ which: 'straight' }, async (err, data) => {
                    if (how > 3750) return message.channel.send('Không thể nhập giá trị lớn hơn "125')
                    if (data.zplus >= 3750) return message.channel.send('Không thể thay đổi giá trị của đoạn đường đã đạt đến 125k')
                    if (data.zplus > how) return message.channel.send(`Data mới "${how}" không thể nhỏ hơn "${data.zplus}"`)
                    const old = data.zplus;
                    highway.findOneAndUpdate({ zplus: old }, { $set: { zplus: how } }, async (err, data) => {
                        if (err) throw err;
                        message.channel.send('Đã cập nhật data')
                    })
                    data.save()
                })
            }
            if (how > 100) {
                highway.findOne({ which: 'straight' }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (how > 3750) return message.channel.send('Không thể nhập giá trị lớn hơn "125')
                        else if (data.zplus >= 3750) return message.channel.send('Không thể thay đổi giá trị của đoạn đường đã đạt đến 125k')
                        else if (how) {
                            if (data.zplus > how) {
                                highway.findOneAndUpdate({ zplus: data.zplus }, { $set: { zplus: how } }, async (err, data) => {
                                    if (err) throw err;
                                    message.channel.send('Đã cập nhật data')
                                })
                                data.save()
                            } else return message.channel.send(`Data mới "${how}" không thể nhỏ hơn "${data.zplus}"`)
                        }
                    } else {
                        return message.channel.send('Không tìm thấy data, vui lòng chạy lệnh highway để khởi tạo data!')
                    }
                })
            }
        }
        if (updatedata === 'z-') {
            highway.findOne({ which: 'straight' }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    if (how > 3750) return message.channel.send('Không thể nhập giá trị lớn hơn "125')
                    else if (data.zminus >= 3750) return message.channel.send('Không thể thay đổi giá trị của đoạn đường đã đạt đến 125k')
                    else if (how) {
                        if (data.zminus > how) {
                            highway.findOneAndUpdate({ zminus: data.zminus }, { $set: { zminus: how } }, async (err, data) => {
                                if (err) throw err;
                                message.channel.send('Đã cập nhật data')
                            })
                            data.save()
                        } else return message.channel.send(`Data mới "${how}" không thể nhỏ hơn "${data.zminus}"`)
                    }
                } else {
                    return message.channel.send('Không tìm thấy data, vui lòng chạy lệnh highway để khởi tạo data!')
                }
            })
        }
    }
}