const express = require("express")
const collection = require("./mongo")
const bcrypt = require('bcrypt')
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())



app.get("/check",(req,res)=>{
    res.json({name:"connected"})

})

app.post('/cart',async (req,res)=>{
    
    const check=await collection.findOne({username:req.body.username});
    console.log(check?.cart);

    res.json({"cart":check?.cart})
})



app.post("/signin",async (req,res)=>{
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    

    try{
        console.log("username received",username)
        console.log("password received:", password);
        

        const check=await collection.findOne({username:username});
        const dePass = await bcrypt.compare(password, check.password);
        console.log(dePass)

            
        

        if(dePass){
            res.json({
                result:"verified",
                info:{
                    username:check.username,
                    name:check.name,
                    cart:check.cart
                }   
        })
        }
        else{
            res.json({result:"notverified"})
        }

    }
    catch(e){
        res.json("fail")
    }

})



app.post("/signup",async (req,res)=>{
    const data = {username: req.body.username , password: req.body.password, name: req.body.name, address:req.body.address, number:req.body.number};
    const newCollection = new collection(data);

    
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log('hashed')

        const data = {username: req.body.username , password: hashedPassword, name: req.body.name, address:req.body.address, number:req.body.number};
        
        const newCollection = new collection(data);
        console.log(newCollection);
        
        await newCollection.save().then(()=>console.log('posted'));
        res.send("register success");
    }
    catch(e){
        res.json("fail")
    }

})

app.post('/update', async (req,res)=>{
    console.log(req.body.cart);
    const check = await collection.updateOne(
        {username:req.body.username},
        {$set:{cart:req.body.cart}}
        
    )
    res.send('updated cart')

})

app.listen(process.env.PORT,()=>{
    console.log("port connected at 8000");
})
