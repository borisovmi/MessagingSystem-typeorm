import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User1 {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;
}
