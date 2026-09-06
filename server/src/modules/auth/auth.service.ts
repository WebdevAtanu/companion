import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import db from "../../config/db";
import { signToken } from "../../middleware/auth.middleware";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

interface PublicUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  created_at: user.created_at,
});

export const register = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const email = input.email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await db("users").where({ email }).first();
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const userId = randomUUID();
  const passwordHash = await bcrypt.hash(input.password, 10);

  await db("users").insert({
    id: userId,
    name: input.name.trim(),
    email,
    password: passwordHash,
  });

  const user = await db("users").where({ id: userId }).first() as User;

  return {
    user: toPublicUser(user),
    token: signToken(user.id),
  };
};

export const login = async (input: { email: string; password: string }) => {
  const email = input.email.trim().toLowerCase();
  const user = await db("users").where({ email }).first() as User | undefined;

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new Error("Invalid email or password");
  }

  return {
    user: toPublicUser(user),
    token: signToken(user.id),
  };
};

export const getMe = async (userId: string) => {
  const user = await db("users").where({ id: userId }).first() as User | undefined;

  if (!user) {
    throw new Error("User not found");
  }

  return toPublicUser(user);
};
