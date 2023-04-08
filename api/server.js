const cors = require('cors')
const fileUpload = require('express-fileupload')
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT ||3001
const path = require('path')



// cross origins fix
app.use(cors({ credentials: true, origin: '*' }))
app.use(fileUpload())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// make json and froms info parsed
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes setup
app.use('/api/seller', require("./routes/sellerRoute"));
app.use('/api', require('./routes/index'));
app.set("view engine", "ejs")

// not found routes hundling
app.all('*', (req, res) => res.status(404).json({ message: 'Not Found' }))

app.listen(PORT, () => console.log(`sever run on http://localhost:${PORT}`))
