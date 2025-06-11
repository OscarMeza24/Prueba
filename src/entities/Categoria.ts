import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './Producto';

@Entity('categorias')
export class Categoria {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion!: string;

    @OneToMany(() => Producto, producto => producto.categoria, { cascade: true })
    productos!: Producto[];
}