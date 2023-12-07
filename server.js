const express = require("express");
const app = express();
require("dotenv").config();
const user_routes = require("./routes/user.routes");
const task_routes = require("./routes/task.routes");

app.use(express.json())

app.use("/user",user_routes);
app.use("/task",task_routes);

app.use(function (error, req, res, next) {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data, status: false });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
