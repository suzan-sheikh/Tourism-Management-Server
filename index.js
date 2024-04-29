const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWS}@cluster0.ykkxidd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotCollection = client.db("spotDB").collection("spot");

    const countryCollection = client.db("countryDB").collection("country");

    const allCountryCollection = client.db("allCountryDB").collection("allCountry");

    // get data to MongoDB
    app.get("/spot", async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/country", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data filter to email
    app.get("/mySpot/:email", async (req, res) => {
      const result = await spotCollection.find({ userEmail: req.params.email }).toArray();
      res.send(result)
    })

        // get data filter to country 
        app.get("/allCountry/:country", async (req, res) => {
          const result = await allCountryCollection.find({ country: req.params.country }).toArray();
          res.send(result)
        })

    app.get('/singleSpot/:id', async (req, res) => {
      const result = await spotCollection.findOne({_id: new ObjectId(req.params.id)})
      res.send(result)
    })

    app.get('/countryName/:id', async (req, res) => {
      const result = await allCountryCollection.findOne({_id: new ObjectId(req.params.id)})
      res.send(result)
    })

    app.get('/singleProduct/:id', async (req, res) => {
      const result = await spotCollection.findOne({_id: new ObjectId(req.params.id)})
      res.send(result)
    })



    app.put('/updateSpot/:id', async(req, res) => {
      const query = {_id: new ObjectId(req.params.id)};
      const data = {
        $set:{
          name:req.body.name,
          country:req.body.country,
          location:req.body.location,
          description:req.body.description,
          cost:req.body.cost,
          seasonality:req.body.seasonality,
          time:req.body.time,
          totalVisitor:req.body.totalVisitor,
          imgURL:req.body.imgURL,
        }
      }
      const result = await spotCollection.updateOne(query, data)
      res.send(result)
    })

    // send data to MongoDB
    app.post("/spot", async (req, res) => {
      const newSpot = req.body;
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    });

    // send data to MongoDB
    app.post("/country", async (req, res) => {
      const newSpot = req.body;
      const result = await countryCollection.insertOne(newSpot);
      res.send(result);
    });

    // send data to MongoDB
    app.post("/allCountry", async (req, res) => {
      const newSpot = req.body;
      const result = await allCountryCollection.insertOne(newSpot);
      res.send(result);
    });



    // delete data
    app.delete("/delet/:id", async(req, res) => {
      const result = await spotCollection.deleteOne({_id: new ObjectId(req.params.id)});
      console.log(result);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("data display from server");
});

app.listen(port, () => {
  console.log(`server is running on : ${port}`);
});
