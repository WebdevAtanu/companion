export interface CreateUserDTO {
  name: string;
  email: string;
  age?: number;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  age?: number;
  password: string;
}
