const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

app.use(morgan("dev"));

mongoose.connect("mongodb://localhost:27017/authdb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authroute"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
