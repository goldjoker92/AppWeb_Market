const PORT = 5000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const app = express();
const routes = express.Router();
app.use("/api", routes);

 
// body-parser
routes.use(express.urlencoded({ extended: true }));
routes.use(express.json());
const jsonParser = express.json()
 
//cors
routes.use(cors());


//mongo db client
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://guillaume:Myagiovanna2020@cluster-marketplace-san.59csp.mongodb.net/marketplace?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true
});

const DATABASE = 'marketplace';
 

//connect to server
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});
//connect to database
client.connect(err => {
  if (err) {
    throw Error(err);
  }
  
  !err && console.log(`Successfull connected to Database`);
  const db = client.db(DATABASE)
  const product = db.collection("product");
  const users = db.collection("users");

  // perform actions on the collection object

  // GET

  routes.get("/product", function (req, res) {
    product
    .find()
    .toArray()
    .then((error, results) => {
      if (error) {return res.send(error);
      }
      res.status(200).send({results})
    })
    .catch((err) => res.send(err));
  });
  routes.get('/user', function(req, res) {
    users.findOne(req.body).then((error, results) =>{
      if(error) {return res.send(error);
        }
      return res.status(200).send(results.data)
    }).catch((err) => res.send(err));
  })

  const exampleObjet = {
    id : 189447,
    category: "Clothes",
    name: "Men\\'s T-shirt for purple light summer",
    price: 999  
  }
 // Post

  routes.post("/product/add", jsonParser, function (req, res) {
    product
      .insertOne(req.body)
      .then(() => res.status(200).send("success insert new document"))
      .catch((err) => {
        console.log(err);
        res.send(err);
    });    
  });

  routes.post("/users/add", jsonParser, function (req, res) {
    users
      .insertOne(req.body)
      .then(() => res.status(200).send("successfully inserted new document"))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
  routes.post("/orders/add", jsonParser, function (req, res) {
    orders
      .insertOne(req.body)
      .then(() => res.status(200).send("successfully inserted new document"))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
});



//stripe
const stripe = require("stripe")(process.env.SECRET_KEY);

const YOUR_DOMAIN = "http://localhost:3000";
routes.post("/create-checkout-session", jsonParser, async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}`,
  });

   res.json({id: session.id});
    } catch (err) {
      return res.status(500).send(`Error process payment ${err}`);
    }
  });
  
 // Routes
routes.get("/", (req, res) => {
  res.send("Hello World!");
});

