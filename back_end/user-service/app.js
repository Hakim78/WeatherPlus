const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = 3004;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/weatherplus", {});

const userRoutes = require("./routes/userRoutes");

app.use("/user", userRoutes);

app.listen(PORT, () => {
console.log(`Server is running on port http://localhost:${PORT}`);
});
