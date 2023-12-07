const cron = require("node-cron")
const TaskController = require("../controllers/task.controller")

const job = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log(
      "The cron job is scheduled to send a notification 24 hours in advance as a reminder to complete the task"
    );
    let job_list =
      await TaskController.getScheduledTask({task_status: "PENDING", cron:true});
    console.log("job_list", job_list);
  });
}
module.exports = {job}