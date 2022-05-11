import express from "express";
import Cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

//App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url =
  "mongodb+srv://Ska:11112222@akmtiti.nbl9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//const connection_url = process.env.DB_CONNECTION

//Middleware
app.use(express.json());
app.use(Cors());
app.use(express.urlencoded());

app.listen(port, () => console.log(`Listening on localhost: ${port}`));

app.get("/", (req, res) => res.status(200).send("Hello"));

//DB Config
mongoose.connect(connection_url);

export default app;
