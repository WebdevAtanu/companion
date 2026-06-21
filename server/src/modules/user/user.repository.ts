import db from "../../config/db";
import { IUser, UserTable } from "./user.model";

// User repository implementation
const userRepository = {
  async createUser(data: Partial<IUser>) {
    return db(UserTable).insert(data); // Returns inserted IDs array
  },

  async getAllUsers(): Promise<IUser[]> {
    return db(UserTable).select("*"); // Returns array of users
  },

  async getUserById(id: number): Promise<IUser | undefined> {
    return db(UserTable).where({ id }).first(); // Returns single user or undefined
  },

  async updateUser(id: number, data: Partial<IUser>) {
    return db(UserTable).where({ id }).update(data); // Returns number of affected rows
  },

  async deleteUser(id: number) {
    return db(UserTable).where({ id }).del(); // Returns number of deleted rows
  },
};

export default userRepository;
