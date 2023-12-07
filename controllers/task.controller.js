const db = require("../models");
const { Op, QueryTypes } = require("sequelize");
const moment = require("moment")
const sendMail = require("@sendgrid/mail")
const redisService = require("../service/redis.service")
const TaskModel = db.task;
const UserTaskMapping = db.user_task_mapping
const currentDate = moment();
const nextTwentyFourHours = moment().add(24, 'hours');

const CACHE_KEY = 'tasks';

const addTask = async (data) => {
    try {
      const newTask = await TaskModel.create(data);
      await redisService.invalidateCache(CACHE_KEY);
      return newTask;
    } catch (error) {
      throw error;
    }
  };
  
  const getTasks = async (req) => {
    try {
      const cachedTasks = await redisService.getCachedDataTask();
      if (cachedTasks) {
        return cachedTasks;
      }
        const tasksFromDB = await TaskModel.findAndCountAll({
        where: { delete_status: false },
      });
        await redisService.cacheData(tasksFromDB, 300);
      return tasksFromDB;
    } catch (error) {
      throw error;
    }
  };
  
  const updateTask = async (update_Task, TaskId) => {
    try {
      await TaskModel.update(update_Task, {
        where: { id: TaskId },
      });
      await redisService.invalidateCache(CACHE_KEY);
      return;
    } catch (error) {
      throw error;
    }
  };

  const scheduleTask = async (data) => {
    try {
        await UserTaskMapping.create(data);
        await redisService.invalidateCache(CACHE_KEY);
        return
    } catch (error) {
        throw error;
    }
};

const getScheduledTask = async (searchParams) => {
    try {
        const taskScheduledList = await UserTaskMapping.findAndCountAll({
            where: {
                [Op.and]: [
                    searchParams.task_status && searchParams.task_status !== "" ? { task_status: searchParams.task_status } : "",
                ]
            },
            include: [
                {
                    model: db.user,
                    as: "user",
                    attributes: ["name", "email"],
                    where: { [Op.and]: { delete_status: false } },
                },
                {
                    model: db.task,
                    as: "task",
                    attributes: ["title", "description", "due_date"],
                    required: false,
                    where: {
                        [Op.and]: [
                            { delete_status: false },
                            searchParams.cron && searchParams.cron !== "" ?
                                { due_date: { [Op.between]: [currentDate , nextTwentyFourHours, ] } } : ""
                        ]
                    },
                },
            ],
        });

        if (searchParams.cron && taskScheduledList) {
            taskScheduledList.rows.forEach(element => {
                if (element.dataValues.task) {
                    console.log(`I hope you are doing well. The ${element.dataValues.task.dataValues.title} deadline is coming up, and I wanted to remind you about the task. Please make sure to take care of it soon.`);

                    sendMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const message = {
                        to: `${element.dataValues.user.dataValues.email}`,
                        from: `${process.env.SENDER_EMAIL}`,
                        subject: 'Reminder: Pending Task to Complete',
                        html: `<p>I hope you are doing well. The ${element.dataValues.task.dataValues.title} deadline is coming up, and I wanted to remind you about the task. Please make sure to take care of it soon.</p>`,
                    };

                    sendMail.send(message)
                        .then((data) => {
                            console.log('Email sent successfully', data);
                        })
                        .catch((error) => {
                            console.error(error.toString());
                        });
                }
            });
            if (taskScheduledList.rows.some(element => element.dataValues.task)) {
                return taskScheduledList;
            } else {
                return null;
            }
        }
        return taskScheduledList;
    } catch (error) {
        throw error;
    }
};

const updateScheduledTask = async (updatedData, id) => {
    try {
        await redisService.invalidateCache(CACHE_KEY);
        const scheduleDetails = await getScheduledTaskById(id);
        if (scheduleDetails && updatedData.task_status == "COMPLETED") {
            if (scheduleDetails.dataValues.task_status == "COMPLETED") {
                const error = new Error("Task already completed");
                error.statusCode = 403;
                throw error;
            }
        }
        if (scheduleDetails) {
            if (updatedData.task_status == "COMPLETED") {
                await updateCompletCount(scheduleDetails.dataValues.user_id);
            }
            await UserTaskMapping.update(updatedData, {
                where: { id: id },
            });
            return;
        } else {
            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }
    } catch (error) {
        throw error;
    }
};

const getScheduledTaskById = async (id) => {
    try {
        const cachedTask = await redisService.getCachedDataTask(CACHE_KEY);
        if (cachedTask) {
            return cachedTask;
        }
        const taskFromDB = await UserTaskMapping.findOne({
            where: { id: id },
        });
        await redisService.cacheData(CACHE_KEY, taskFromDB);
        return taskFromDB;
    } catch (error) {
        throw error;
    }
};

const updateCompletCount = async (userId) => {
    await redisService.invalidateCache(CACHE_KEY);
    await db.sequelize.query(
        `UPDATE user SET completed_task = completed_task + 1 WHERE id = :userId`,
        {
            replacements: { userId },
            type: QueryTypes.UPDATE,
        }
    );
    return;
};

module.exports = {
  addTask,
  getTasks,
  updateTask,
  scheduleTask,
  getScheduledTask,
  updateScheduledTask
};
