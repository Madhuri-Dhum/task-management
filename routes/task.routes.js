var express = require("express");
var router = express.Router();
const TaskController = require("../controllers/task.controller");

router.post("/",async function (req, res, next) {
  try {
    const { title, description, due_date} = req.body;
    function throwErrorIfEmpty(value, errorMessage) {
      if (!value || value.trim() === "") {
        const error = new Error(errorMessage);
        error.statusCode = 422;
        throw error;
      }
    }
    throwErrorIfEmpty(title, "Title is required");
    throwErrorIfEmpty(description, "Description is required");
    throwErrorIfEmpty(due_date, "Due_date is required");
    
    await TaskController.addTask(req.body);
    res.status(201).json({
      status: true,
      message: "Task registered successfully.",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const TaskList = await TaskController.getTasks(req);
    res.status(200).json({ status: true, message: "success", data: TaskList });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    await TaskController.updateTask(req.body, req.params.id);
    res
      .status(201)
      .json({ status: true, message: "Task updated successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/schedule", async function (req, res, next) {
  try {
    await TaskController.scheduleTask(req.body);
    res.status(201).json({
      status: true,
      message: "Task scheduled successfully.",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/schedule", async function (req, res, next) {
  try {
    const ScheduledList = await TaskController.getScheduledTask(req.query);
    res.status(200).json({
      status: true,
      message: "Success",
      data : ScheduledList
    });
  } catch (error) {
    next(error);
  }
});

router.put("/schedule/:id", async function (req, res, next) {
  try {
   await TaskController.updateScheduledTask(req.body, req.params.id);
    res.status(201).json({
      status: true,
      message: "Schedule update successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
