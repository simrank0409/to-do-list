//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistdb');

const itemsSchema= {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({name: "welcome"});
const item2 = new Item({name: "add more"});
const item3 = new Item({name: "delete"});

const defaultItems= [item1, item2, item3];

// item1.save().then(() => console.log('meow'));

// async function run(){
//   await Item.insertMany(defaultItems);
//   mongoose.connection.close();
//   console.log("added succesfully");
// };
// run();




// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function(req, res) {

// const day = date.getDate();
var foundItems = Item.find();

if (foundItems.length === 0) {
  async function run(){
    await Item.insertMany(defaultItems);
    mongoose.connection.close();
    console.log("added succesfully");
  };
  run();
    res.render("list", {listTitle: "Today", newListItems: foundItems });
// res.redirect("/");
} else {
    res.render("list", {listTitle: "Today", newListItems: foundItems });
};

// Item.find({}, function(err, result) {
//     if (err) throw err;
//     console.log(result.name);
//     db.close();
//   });



});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    defaultItems.push(item);
    res.redirect("/work");
  } else {
    defaultItems.push(item);
    res.redirect("/");
  }
  res.render("list", {listTitle: "Today", newListItems: defaultItems});
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
