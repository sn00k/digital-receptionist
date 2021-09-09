import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, nullable: false })
  name: string;

  @Column({ length: 128, nullable: false })
  email: string;

  @Column({ default: false })
  office_admin: boolean;
}
