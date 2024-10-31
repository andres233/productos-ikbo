import { Exclude } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'varchar', nullable: true })
  public lastname: string;

  @Column({ type: 'varchar', nullable: true })
  public firstname: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
