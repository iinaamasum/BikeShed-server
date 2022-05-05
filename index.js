const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
  const UsersCollection = client.db('warehouse').collection('items');

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
     * finding single data
     * link-local: http://localhost:5000/product/${id}
     * link-online:
     */
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;

      // console.log(id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    /**
     * deleting single data
     * link-local: http://localhost:5000/product/${id}
     * link-online:
     */
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    /**
     * update a existing product
     * link-local: http://localhost:5000/product/${id}
     * link-online:
     */
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      // console.log(id);
      // console.log(updatedData);

      const newData = {
        $set: updatedData,
      };

      const result = await productsCollection.updateOne(
        filter,
        newData,
        options
      );

      res.send(result);
    });

    /**
     * post data
     * link-local: http://localhost:5000/productUp
     * link-online:
     */

    app.post('/productUp', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send({ Post: 'post successfully' });
    });

    /**
     * post separate user data
     * link-local: http://localhost:5000/item
     */
    app.post('/item', async (req, res) => {
      const item = req.body;
      const result = await UsersCollection.insertOne(item);
      res.send(result);
    });

    /**
     * getting all data from usersCollection
     * link-local: http://localhost:5000/items?email='email'
     *
     */
    app.get('/items', async (req, res) => {
      const query = { email: req.query.email };
      const data = await UsersCollection.find(query).toArray();
      // console.log(query);
      res.send(data);
    });

    /**
     * getting user separated item by id
     * link-local: http://localhost:5000/item/id
     */
    app.get('item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await UsersCollection.findOne(query);
      res.send(item);
    });

    app.delete('/item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await UsersCollection.deleteOne(query);
      res.send(result);
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
