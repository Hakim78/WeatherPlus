const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = 3005;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/weatherplus", {});

const favorisRoutes = require("./routes/favorisRoutes");

app.use("/favoris", favorisRoutes);

app.listen(PORT, () => {
console.log(`Server is running on port http://localhost:${PORT}`);
});
