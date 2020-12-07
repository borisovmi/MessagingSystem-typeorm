import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MessageAction } from "./MessageAction";
import { MessageParticipant, User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, default: null })
  subject!: string;

  @Column()
  messageBody!: string;

  @ManyToOne((type) => User)
  sender!: number;

  @ManyToOne((type) => User)
  receiver!: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @Column({ type: "datetime", default: null })
  readByReceiverAt!: Date;

  @OneToMany(
    (type) => MessageAction,
    (messageAction) => messageAction.messageId,
    { cascade: true, eager: true }
  )
  messageActions!: MessageAction[];
}

export type NewMessageRequest = Pick<
  Message,
  "receiver" | "subject" | "messageBody"
>;

export type FetchedMessageDetails = Pick<
  Message,
  | "id"
  | "subject"
  | "messageBody"
  | "createdAt"
  | "readByReceiverAt"
  | "messageActions"
> &
  Record<"receiver" | "sender", MessageParticipant>;
export type MessageDetailsResponse = Pick<
  Message,
  "id" | "subject" | "messageBody" | "createdAt" | "readByReceiverAt"
> &
  Record<"receiver" | "sender", MessageParticipant>;

export type MessagePreview = Pick<
  Message,
  "id" | "subject" | "createdAt" | "readByReceiverAt"
> &
  Record<"receiver" | "sender", MessageParticipant>;

export interface MessagesPagination {
  messages: MessagePreview[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}
