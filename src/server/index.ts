import express, { Application } from "express";
import { config } from "./config";

const app: Application = express();
const { port } = config;

app.get("/", (req, res) => {
  res.send("home route");
});

app.listen(port);
