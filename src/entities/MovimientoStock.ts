import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from './Producto';

@Entity('movimientos_stock')
export class MovimientoStock {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha!: Date;

    @Column({ type: 'varchar', length: 20 })
    tipo!: 'entrada' | 'salida';

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cantidad!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion!: string;

    @ManyToOne(() => Producto, producto => producto.movimientos, { onDelete: 'CASCADE' })
    producto!: Producto;
}