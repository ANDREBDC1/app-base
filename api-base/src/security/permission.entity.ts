import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity("permissions")
export class Permission {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false})
  tipo: string;

  @Column()
  descricao: string;

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({nullable: false})
  userId: string;

}