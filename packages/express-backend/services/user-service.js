import User from "../models/user.js";

// Get all users
export const getUsers = () => {
  return User.find();
};

// Create user
export const createUser = (user) => {
  return User.create(user);
};

// Get user by ID
export const getUserById = (id) => {
  return User.findById(id);
};

// Delete user
export const deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

