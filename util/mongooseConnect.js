async function mongooseconnect(mongoose) {
    await mongoose.connect(process.env.MONGOOSE, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(() => {
        console.log('[MONGOOSE] CONNECTED');
        console.log('\n--------------------------------\n')
    })
}

module.exports = mongooseconnect