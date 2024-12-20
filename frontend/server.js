import express, { Router } from 'express';
import 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';
import { join, resolve } from 'path';
import { static as expressStatic } from 'express';

const app = express();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use("/static", expressStatic(join(__dirname, 'static')));
app.get("/*", (req, res) => {
    res.sendFile(resolve(__dirname, "index.html"))
})

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000...");
});
