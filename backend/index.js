const express = require("express"); // Used to create the server and handle routing
const app = express();
const bodyParser = require("body-parser"); // Used to parse incoming request bodies in a middleware before your handlers, available under the req.body property
const cors = require("cors"); // Used to enable Cross-Origin Resource Sharing, allowing your server to accept requests from different origins
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");

require("dotenv").config(); // Used to load environment variables from a .env file into process.env
require("./Models/db");
const PORT = process.env.PORT || 8080;

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use(bodyParser.json()); // Parses incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(cors()); // Enables CORS for all routes
app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
