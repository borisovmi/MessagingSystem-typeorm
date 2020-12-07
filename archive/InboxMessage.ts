// import {
//   Column,
//   Entity,
//   JoinColumn,
//   JoinTable,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from "typeorm";
// import { Message } from "./Message";
// import { Message1 } from "./Message copy";
// import { User } from "./User";

// @Entity()
// export class MessageAction {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @ManyToOne((type) => Message, (message) => message.id)
//   @JoinColumn({ name: "messageId" })
//   messageId!: number;

//   @ManyToOne((type) => User, (user) => user.id, { eager: true })
//   @JoinColumn({ name: "userId",  })
//   userId!: number;

//   @Column({ type: "datetime", default: null })
//   readAt!: Date;

//   @Column({ default: null })
//   deleted!: boolean;
// }
