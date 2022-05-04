const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

/**
 * middleware
 */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqf95.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  await client.connect();
  console.log('db running');

  const productsCollection = client.db('warehouse').collection('products');

  try {
    /**
     * getting all products
     * link-local: http://localhost:5000/products
     * link-online:
     */
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = await productsCollection.find(query).toArray();
      // console.log(cursor);
      res.send(cursor);
    });

    /**
     * post data
     * link-local:
     * link-online:
     */

    app.post('/product', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send({ Post: 'post successfully' });
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
