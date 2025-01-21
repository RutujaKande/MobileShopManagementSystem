const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
//all images css static files should be in public folder basically rule for server based sites
app.use(express.static("assets"));


mongoose.connect("mongodb://localhost:27017/projectDB", {
  useNewUrlParser: true
});
//
var x = new Date().toJSON().slice(0, 10);
var today = JSON.stringify(x);
console.log(x);
console.log(today);
// const shopowner="Mahak";
const userSchema = {
  name:String,
  email: String,
  password: String
};
const profitSchema = {
  date: String,
  profit: Number
};

const contactSchema = {
  name : String,
  email : String,
  subject : String,
  message : String

};
const productSchema = {
  compname: String,
  model: String,
  storage:Number,
  color:String,
  quant: Number,
  price: Number


  //waranty: Number
};


const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);

const Message = mongoose.model("Message",contactSchema);
// const manualProfit=new Profit({
//   date:"2023-12-22",
//   profit:200
// });
// manualProfit.save();

// const Customer = mongoose.model("Customer", customerSchema);
const orderSchema = {
  customerMob: Number,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  date:String,
  sp: Number,
profit:Number
};


const Profit = mongoose.model("Profit", profitSchema);
const Order = mongoose.model("Order", orderSchema);


//for cheking yearly/monthly profit
app.get("/stocknot.html",function(req,res){
  res.render("stocknot",{message:"error occured"});
});


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/index.html", function(req, res) {

  res.sendFile(__dirname + "/index.html");
});

app.post("/index.html",function(req,res){

  const message = new Message({
    name : req.body.name,
    email : req.body.email,
    subject : req.body.subject,
    message : req.body.message
  });
  message.save();
  res.redirect("/index.html");
});

app.get("/login.html", function(req, res) {

  res.sendFile(__dirname + "/login.html");
});
app.get("/product-add.html",function(req,res){
  res.sendFile(__dirname+"/product-add.html");
});

app.get("/home.html",function(req,res){
res.sendFile(__dirname + "/home.html");
});
app.get("/signup.html",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.get("/product-add.html",function(req,res){
  res.sendFile(__dirname + "/product-add.html");
});
app.get("/product-update.html",async function(req,res){
  let products=await Product.find();
  //console.log(products);
  res.render("product-update",{products:products});
});
app.get("/product-delete.html",async function(req,res){
  let products=await Product.find();
  //console.log(products);
  res.render("product-delete",{products:products});
});
app.get("/bill.html",async function(req,res){
  let products=await Product.find();
  //console.log(products);
  res.render("bill",{products:products});
});

app.get("/order.html",async function(req,res){
  let products=await Product.find();
res.render("order",{products:products});
});
app.get("/daywise.html",async function(req,res){

  const o=new Order({
    customerMob: 8080887590,
    //product: p1,
    date:new Date().toJSON().slice(0, 10),
    sp: 80000
  });
  //o.save();
res.sendFile(__dirname+"/daywise.html")
});
app.post("/daywise.html",async function(req,res){
  var profit=0;
  var x = req.body.date;
  //var today = JSON.stringify(x);
  // {$regex:"2024"}
  // var profits = await Order.find({
  //   date: x
  // });
  // console.log(profits);


  var sum=0;
  const profits=await Order.find({date:x});
  console.log(profits);
  profits.forEach((item, i) => {
    if(item.profit!=null){
    sum=sum+item.profit;}
  });



var message="Total Profit made is "+sum;
res.render("profits",{message:message});
});
app.get("/monthwise.html",function(req,res){
res.sendFile(__dirname + "/monthwise.html");
});
app.post("/monthwise.html",async function(req,res){
  var profit=0;
  var x = "2023-05";
  var y=req.body.date;
  console.log(y);

  var sum=0;
  const profits=await Order.find({date:{$regex:y}});
  console.log(profits);
  profits.forEach((item, i) => {
    if(item.profit!=null){
    sum=sum+item.profit;}
  });



var message="Total Profit made is "+sum;
res.render("profits",{message:message});
});
app.get("/yearwise.html",function(req,res){
res.sendFile(__dirname + "/yearwise.html");
});
app.post("/yearwise.html",async function(req,res){
  var profit=0;
  var x = "2023-05";
  var y=req.body.date;
  console.log(y);

  var sum=0;
  const profits=await Order.find({date:{$regex:y}});
  console.log(profits);
  profits.forEach((item, i) => {
    if(item.profit!=null){
    sum=sum+item.profit;}
  });

var message="Total Profit made is "+sum;
res.render("profits",{message:message});
});
app.get("/stock-display.html",function(req,res){
res.sendFile(__dirname + "/stock-display.html");
});
app.get("/porfolio-details.html",function(req,res){
res.sendFile(__dirname + "/porfolio-details.html");
});
app.post("/order.html",async function(req,res){
  var model=req.body.model;
  var company=req.body.companyname;
  var color=req.body.color;
  var storage=req.body.storage;
  var quantity=req.body.quantity;
  var phoneno=req.body.phoneneo;
  var sp=req.body.sp;

  const fil = {
    model:model,
    compname:company,
    color:color,
    storage:storage
  };
  const doc = await Product.findOne(fil);

  if (doc == null) {
    res.render("stocknot",{message:"stock not available!"});
  }else{

    if(doc.quant<quantity){
      res.render("stocknot",{message:"Quantity is less than demanded,available products are "+doc.quant});
    }else{
      const doc = await Product.findOne(fil);
      var prevprice=doc.price
      var profitmade=quantity*(sp-prevprice);
      var x=doc.quant;
      const o=new Order({
        customerMob: phoneno,
        product: doc,
        date:new Date().toJSON().slice(0, 10),
        sp: sp,
        profit:profitmade
      });
      o.save();
      var filter={
      date:new Date().toJSON().slice(0, 10)};
      let findProfit=await Profit.findOne(filter);
      if(findProfit==null){
        const pr1=new Profit({
          date:new Date().toJSON().slice(0, 10),
          profit:profitmade
        });
        pr1.save();
      }else{
        var finalday=findProfit.profit+profitmade;
        const update={
          profit:finalday
        };
        let xy=await Profit.findOneAndUpdate(filter,update,{
          new:true
        });
      }

      var reduced =x-quantity;

      upd={
        quant:reduced
      };
      let xyz = await Product.findOneAndUpdate(fil, upd, {
        new: true
      });
    }
  }
  res.render("profits",{message:"Thank You For Your Order!!"});
});
app.post("/stock-display.html",async function(req,res){

  var model=req.body.model;
  var company=req.body.companyname;
  var color=req.body.color;
  var storage=req.body.storage;
var ans=0;

// console.log(products);
  const fil = {
    model:model,
    compname:company,
    color:color,
    storage:storage
  };

  let doc = await Product.findOne(fil);
  if (doc == null) {
    res.render("stocknot",{message:"stock not available!"});
  }else{
    ans=doc.quant;
  }
const message="Available Stock is "+ans;
   res.render("stocknot",{message:message});

});
app.get("/stocks.ejs",async function(req,res){
  let products=await Product.find();
  console.log(products);
  res.render("stocks",{products:products});
});
app.post("/stocks.ejs",function(req,res){
  console.log(req.body.productoption);
  res.redirect("/stocks.ejs");
});

app.post("/product-add.html",async function(req,res){
  const compname = req.body.compname;
  const model = req.body.model;
  const storage=req.body.storage;
  const quant = req.body.Quantity;
  const price = req.body.Price;
  const color = req.body.color;

  //const war = req.body.Waranty;

  const prod1 = new Product({
    model: model,
  color:color,
    quant: quant,
    price: price,
    storage:storage,
    compname: compname,
    //waranty: war
  });



  prod1.save();
  //console.log(pID + " " + pname + " " + quant);
  res.redirect("/home.html");
});

app.post("/product-update.html",async function(req,res){
  var storage = req.body.storage;
  var model=req.body.model;
  var company=req.body.companyname;
  var color=req.body.color;

  var newPrice = req.body.price;
  var quantity=req.body.quant;

  const fil = {
    model: model,
    compname:company,
    storage:storage,
    color:color
  };

  const upd = {
    quant:quantity,
    price: newPrice
  };

  // let prod=await Product.findOne(fil);
  // if(prod==null){
  //   res.send("<h1>Product Not available</h1>");
  // }
  let doc = await Product.findOneAndUpdate(fil, upd, {
    new: true
  });

  if (doc == null) {
    const prod1 = new Product({
      model: model,
      compname:company,
      storage:storage,
      color:color,
      quant:quantity,
      price: newPrice
      //waranty: war
    });
prod1.save();

}else{
  //console.log(doc.price);
  //updatePrice();
  res.redirect("/home.html");}
})
app.post("/product-delete.html",async function(req,res){
  var storage = req.body.storage;
  var model=req.body.model;
  var company=req.body.companyname;
  var color=req.body.color;

  const fil = {
    model: model,
    compname:company,
    storage:storage,
    color:color
  };
  let doc = await Product.findOneAndDelete(fil);
  if (doc == null) {
    res.render("stocknot",{message:"Product not available!"});
  }else{
  res.redirect("/home.html");
  }
});
app.post("/signup.html",function(req,res){
  const name=req.body.name;
  const email = req.body.email;
  const psw = req.body.psw;
const userob = new User({
  name:name,
  email: email,
  password: psw
});
if(userob==null){
  res.redirect("/signup.html");
}else{
userob.save();
res.redirect("/home.html");
}
});

app.post("/login.html", async function(req, res) {
  const name=req.body.name;
  const email = req.body.email;
  const psw = req.body.psw;

  const filt=({
    name:name,
    email: email,
    password: psw
  });
  console.log(name+" "+email+" "+psw);
  let user = await User.findOne(filt);
console.log(user);
  if (user == null) {
    console.log("Incorrect");
    res.redirect("/signup.html");
  }
  else{
  res.redirect("/home.html");}

});



app.listen(3001, function() {
  console.log("Server started on port 3000");
});
