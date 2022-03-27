async function mongooseconnect(mongoose) {
    await mongoose.connect(process.env.MONGOOSE, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(console.log('Đã kết nối đến Mongodb!'))
}

module.exports = mongooseconnect