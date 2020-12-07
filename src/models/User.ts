import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message";
import { MessageAction } from "./MessageAction";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;
}

export type UserLoginRequest = Pick<User, "email" | "password">;
export type UserSignupRequest = Pick<User, "password" | "name" | "email">;
export type UserJwtPayload = Omit<User, "password">;
export type MessageParticipant = Pick<User, "id" | "email" | "name"> &
  Pick<MessageAction, "deleted">;
export interface AuthResponse {
  token: string;
}
