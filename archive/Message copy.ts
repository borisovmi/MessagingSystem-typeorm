// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,

//   OneToMany,

//   PrimaryGeneratedColumn
// } from "typeorm";
// import { MessageAction } from "./InboxMessage";
// import { User1 } from "./User copy";

// @Entity()
// export class Message1 {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column({ nullable: true, default: null })
//   subject!: string;

//   @Column()
//   messageBody!: string;

//   @ManyToOne((type) => User1)
//   @JoinColumn({ name: "senderId" })
//   senderId!: User1["id"];

//   // @ManyToOne((type) => User1)
//   // @JoinColumn({ name: "receiverId" })
//   // receiverId!: User1["id"];

//   @OneToMany(type => MessageAction, messageAction => messageAction.messageId)
//   messageActions!: MessageAction[]

//   @CreateDateColumn({ type: "datetime" })
//   createdAt!: Date;
// }

