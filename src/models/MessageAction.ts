import { type } from "os";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@Entity()
export class MessageAction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Message)
  @JoinColumn({ name: "messageId" })
  messageId!: number;

  @Column()
  userId: number;

  @Column({ default: false })
  deleted!: boolean;

  constructor(userId: number) {
    this.userId = userId;
  }
}
