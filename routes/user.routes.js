var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user.controller");

router.post("/", async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    function throwErrorIfEmpty(value, errorMessage) {
      if (!value || value.trim() === "") {
        const error = new Error(errorMessage);
        error.statusCode = 422;
        throw error;
      }
    }
    throwErrorIfEmpty(name, "Name is required");
    throwErrorIfEmpty(email, "Email is required");
    throwErrorIfEmpty(password, "Password is required");
    await UserController.addUser(req.body);
    res.status(201).json({
      status: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const UserList = await UserController.getUsers(req);
    res.status(200).json({ status: true, message: "success", data: UserList });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    await UserController.updateUser(req.body, req.params.id);
    res
      .status(201)
      .json({ status: true, message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
