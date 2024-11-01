import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name : string;

  @Column({nullable: true})
  sku ?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public price!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories: Inventory[];
}