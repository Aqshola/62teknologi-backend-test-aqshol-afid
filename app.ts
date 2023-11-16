import "dotenv/config.js";

import express, { Request, Response } from "express";
import { PORT } from "@/constants";
import bodyParser from "body-parser";
import morgan from "morgan";
import { DbConnection, db } from "./libs/db";
import wrapperRoute from "./routes";
import handlerNotFound from "./libs/notfound";
import cors from "cors"; // HANDLE CORS ALL ORIGIN FOR DEVELOPMENT

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("short"));

DbConnection();
db.sync({
  logging: () => {
    console.log("Sync Success");
  },
});

/** ROUTE*/
app.use(wrapperRoute);
app.use(handlerNotFound);

app.listen(PORT, () => {
  console.log(`Running Server at http://localhost:${PORT}`);
});
