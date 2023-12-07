const db = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const UserModel = db.user;
const redisService = require("../service/redis.service");

const CACHE_KEY_USER = "user"

const addUser = async (data) => {
    try {
        await checkUserRegistered(data.email);
        const hashedPassword = await bcrypt.hash(data.password, 12);
        await UserModel.create({
            ...data,
            password: hashedPassword,
        });
        await redisService.invalidateCache(CACHE_KEY_USER);
        return;
    } catch (error) {
        throw error;
    }
};

const checkUserRegistered = async (email, login = false) => {
  const userDetails = await UserModel.findOne({
    where: { [Op.and]: [{email : email}, { delete_status: false }] },
  });
  if (userDetails) {
      if (login) {
          return userDetails;
      } else {
          const error = new Error("User already exist with this email");
          error.statusCode = 403;
          throw error;
      }
      } else {
      if (login) {
          const error = new Error("You are not registered. Please sign up first");
          error.statusCode = 401;
          throw error;
      } else {
          return true;
      }
      }
};

const getUsers = async () => {
    try {
        const cachedUsers = await redisService.getCachedDataUser(CACHE_KEY_USER);
        if (cachedUsers) {
            return cachedUsers;
        }
        const userDetails = await UserModel.findAndCountAll({
            where: { delete_status: false },
        });
        await redisService.cacheData(CACHE_KEY_USER, userDetails);
        return userDetails;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateUser = async (update_user, userId) => {
    try {
        await UserModel.update(update_user, {
            where: { id: userId },
        });
        await redisService.invalidateCache(CACHE_KEY_USER);
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = {
    addUser,
    getUsers,
    updateUser,
};
