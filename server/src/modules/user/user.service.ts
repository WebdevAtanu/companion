import userRepository from "./user.repository";
import { CreateUserDTO, UpdateUserDTO } from "./user.dto";

// Get single user
export const getUser = async (id: number) => {
  const user = await userRepository.getUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Create user
export const createUser = async (data: CreateUserDTO) => {
  const ids = await userRepository.createUser(data);

  // MySQL returns inserted IDs array
  return {
    id: ids[0],
    ...data,
  };
};

// Get all users
export const getUsers = async () => {
  return await userRepository.getAllUsers();
};

// Update user
export const updateUser = async (id: number, data: UpdateUserDTO) => {
  const affectedRows = await userRepository.updateUser(id, data);

  if (affectedRows === 0) {
    throw new Error("User not found");
  }

  return {
    id,
    ...data,
  };
};

// Delete user
export const deleteUser = async (id: number) => {
  const affectedRows = await userRepository.deleteUser(id);

  if (affectedRows === 0) {
    throw new Error("User not found");
  }

  return { message: "User deleted successfully" };
};