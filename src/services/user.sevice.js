import { User } from "../models/user.model.js";

export const createUser = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  return user;
};
