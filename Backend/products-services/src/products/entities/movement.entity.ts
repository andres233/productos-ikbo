import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class Movement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    public quantity: number;

    /*
     * Many-To-One Relationships
     */

    @ManyToOne(() => Inventory, (inventory) => inventory.movements, { onDelete: 'CASCADE' })
    public inventory: Inventory;


    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}