import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { PublicUser, User } from "./companion.model";
import { now, store } from "./companion.store";
import { signToken } from "./auth.middleware";

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const register = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const email = input.email.trim().toLowerCase();

  if (store.usersByEmail.has(email)) {
    throw new Error("Email is already registered");
  }

  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: await bcrypt.hash(input.password, 10),
    createdAt: now(),
  };

  store.users.set(user.id, user);
  store.usersByEmail.set(user.email, user.id);

  return {
    user: toPublicUser(user),
    token: signToken(user.id),
  };
};

export const login = async (input: { email: string; password: string }) => {
  const email = input.email.trim().toLowerCase();
  const userId = store.usersByEmail.get(email);
  const user = userId ? store.users.get(userId) : undefined;

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new Error("Invalid email or password");
  }

  return {
    user: toPublicUser(user),
    token: signToken(user.id),
  };
};

export const getMe = (userId: string) => {
  const user = store.users.get(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return toPublicUser(user);
};
