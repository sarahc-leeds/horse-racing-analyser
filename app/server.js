const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const routes = require("./getRunners");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
