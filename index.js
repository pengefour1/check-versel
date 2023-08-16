const express = require('express');
const app = express();

app.get('/check',(req,res)=>{
    res.json({message:"message is received"})
});


app.listen(process.env.PORT,()=>console.log('listening at 8000'));