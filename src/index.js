const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express();

const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, '../public')
const userRouter = require('./routers/siteRouter')
const adminRouter = require('./routers/adminRouter')
require('./db/covid19DB')

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(adminRouter)
app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
    console.log('Server runs on port', port)
})