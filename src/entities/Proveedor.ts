import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './Producto';

@Entity('proveedores')
export class Proveedor {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'varchar', length: 255 })
    razon_social!: string;

    @Column({ type: 'varchar', length: 255 })
    direccion!: string;

    @Column({ type: 'varchar', length: 20 })
    telefono!: string;

    @Column({ type: 'varchar', length: 100 })
    email!: string;

    @OneToMany(() => Producto, producto => producto.proveedor, { cascade: true })
    productos!: Producto[];
}