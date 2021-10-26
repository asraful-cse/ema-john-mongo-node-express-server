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
		// Get products API
		app.get("/products", async (req, res) => {
			const curser = productCollection.find({});
			const products = await curser.toArray(curser);
			const count = await curser.count();
			res.send({ count, products });
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
