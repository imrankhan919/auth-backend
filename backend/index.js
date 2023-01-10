const express = require('express')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorHandler')
const dotenv = require('dotenv').config()
const colors = require('colors')

const app = express()
const PORT = process.env.PORT || 8000

// body parser

app.use(express.json())
app.use(express.urlencoded({extended : false}))

// DB connect
connectDB()


app.get('/' , (req , res)=>{
    res.json({msg : "Welcome to Support API"})
})

// Routes
app.use('/api/user' , require("./routes/userRoutes"))
app.use('/api/tickets' , require("./routes/ticketRoutes"))




app.listen(PORT , () => console.log(`Server is running at PORT : ${PORT}`))

// Error Middleware
app.use(errorHandler)