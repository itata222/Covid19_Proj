const mongoose = require('mongoose')

mongoose.connect(process.env.COVID19SITE_MongoDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});