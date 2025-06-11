import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './Producto';

@Entity('almacenamientos')
export class Almacenamiento {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion!: string;

    @Column({ type: 'integer' })
    capacidad!: number;

    @Column({ type: 'integer', default: 0 })
    ocupacion!: number;

    @OneToMany(() => Producto, producto => producto.ubicacion, { cascade: true })
    producto!: Producto[];
}