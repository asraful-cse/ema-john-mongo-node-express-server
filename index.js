const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
// env er jonno noito password user name hobena
require("dotenv").config();

const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// mongodb atlas pass and username
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v25nn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
// console.log(uri);

async function run() {
	try {
		await client.connect();
		console.log("database connected");
		const database = client.db("online_shop");
		const productCollection = database.collection("products");
		// Get products API------------------------------------
		app.get("/products", async (req, res) => {
			// console.log(req.query);
			const cursor = productCollection.find({});
			const page = req.query.page;
			const size = parseInt(req.query.size);
			let products;
			const count = await cursor.count();
			if (page) {
				products = await cursor
					.skip(page * size)
					.limit(size)
					.toArray();
			} else {
				products = await cursor.toArray();
			}

			res.send({ count, products });
		});
		// use post to get data by keys------------------------
		app.post("/products/byKeys", async (req, res) => {
			const keys = req.body;
			const query = { key: { $in: keys } };
			const products = await productCollection.find(query).toArray();
			res.json(products);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("ema john server is running");
});

app.listen(port, () => {
	console.log("Server running at port", port);
});
