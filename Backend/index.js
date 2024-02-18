const express = require('express');
require('./db/config');
const User = require('./db/user');
const Product = require('./db/product');
const app = express();
const port = process.env.PORT || 5000;


//cors used to fix backend issues or erros thats its important 
const cors = require('cors');
app.use(cors())

app.use(express.json())//its convert json data to readable data

app.post('/signup', async (req, res) => {
    // res.send(req.body)
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();// toObject convert data into the object
    delete result.pass;//'delete function' delete the pass while responseing the data;
    res.send(result)

})

app.post('/login', async (req, res) => {

    if (req.body.email && req.body.pass) {
        let user = await User.findOne(req.body).select("-pass");
        if (user) {
            res.send(user)
        } else {
            res.send({ result: "NO USER FOUND..." })
        }
    } else {
        res.send({ result: "NO USER FOUND..." })
    }

})

app.post('/addproduct', async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result)
})

app.get('/users', async(req,res)=>{
    let users=await User.find().select("-pass");//its remove the pass while responsing data on webpage
    //delete result.pass;//delete fuction delete the pass while responseing the data;
    if(users.length>0){
        res.send(users)
    }else{
        res.send("No users found...")
    }
})

app.get('/products', async (req, res) => {
    let products = await Product.find();

    if (products.length > 0) {
        res.send(products)
    } else {
        res.send("NO PRODUCTS FOUND..;) ")
    }
})

app.delete("/product/:id", async (req, res) => {

    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(req.params.id);
})

app.get('/product/:id', async (req, res) => {

    let result = await Product.findOne({ _id: req.params.id });

    if (result) {
        res.send(result)
    } else {
        res.send({ result: "No Record Found" })
    }

})




app.put('/product/:id', async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )

    res.send(result)
})



app.listen(port, () => {
    console.log(`server is running port ${port}...`)
})