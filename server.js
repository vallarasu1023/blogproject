const blog=require('./blog')
const sign=require('./signup')
const cors=require('cors')
const bodyparser=require('body-parser')
const express=require('express')
const contact=require('./contact')
const app=express()
const path = require('path');
// const dotenv=require('dotenv').config()
const PORT=8080
app.get('/',(req,res)=>{
  res.send("welcome")
})
app.use(cors());
app.use(bodyparser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // to serve images

app.use('/log',sign)
app.use('/blogss',blog)
app.use('/contacts',contact)




app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });