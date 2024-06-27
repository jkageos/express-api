import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

mongoose
  .connect(`${process.env.MONGO_DB_URI}/${process.env.MONGO_DB_NAME}?authSource=admin`)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

const app = createApp();

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`
    -Local:  http://localhost:${port}
    `);
});
