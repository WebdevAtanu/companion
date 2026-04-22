import db from "../../config/db";
import { IUser, UserTable } from "./user.model";

const userRepository = {
  async createUser(data: Partial<IUser>) {
    return db(UserTable).insert(data);
  },

  async getAllUsers(): Promise<IUser[]> {
    return db(UserTable).select("*");
  },

  async getUserById(id: number): Promise<IUser | undefined> {
    return db(UserTable).where({ id }).first();
  },

  async updateUser(id: number, data: Partial<IUser>) {
    return db(UserTable).where({ id }).update(data);
  },

  async deleteUser(id: number) {
    return db(UserTable).where({ id }).del();
  },
};

export default userRepository;
