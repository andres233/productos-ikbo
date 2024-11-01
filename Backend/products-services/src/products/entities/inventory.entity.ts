import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { Movement } from './movement.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  public quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  public expiredAt?: Date;

  /*
   * Many-To-One Relationships
   */

  @ManyToOne(() => Product, (product) => product.inventories, { onDelete: 'CASCADE' })
  public product: Product;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Movement, (movement) => movement.inventory)
  movements: Movement[];

  // Getter para el campo status
  get status(): string {
    if (!this.expiredAt) {
      return "Undefined";
    } else {
      const today = new Date();
      const daysDifference = (this.expiredAt.getTime() - today.getTime()) / (1000 * 3600 * 24);     
      if (daysDifference > 3) {
        return "Vigente";
      } else if (daysDifference > 0 && daysDifference <= 3) {
        return "Por vencer";
      } else {
        return "Vencido";
      }
    }
  }

}