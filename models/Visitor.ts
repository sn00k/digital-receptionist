import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, nullable: false })
  name: string;

  @Column({ length: 128, nullable: false })
  email: string;

  @Column({ length: 70, nullable: true })
  company: string;

  @CreateDateColumn({ type: "timestamptz" })
  date: Date;
}
