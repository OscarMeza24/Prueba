import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Categoria } from "./Categoria";
import { Proveedor } from "./Proveedor";
import { Almacenamiento } from "./Almacenamiento";
import { MovimientoStock } from "./MovimientoStock";

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion!: string;

    @Column({ type: 'date' })
    fecha_caducidad!: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cantidad!: number;

    @ManyToOne(() => Categoria, categoria => categoria.productos, { eager: true })
    categoria!: Categoria;

    @ManyToOne(() => Proveedor, proveedor => proveedor.productos, { eager: true })
    proveedor!: Proveedor;

    @ManyToOne(() => Almacenamiento, almacenamiento => almacenamiento.producto, { eager: true })
    ubicacion!: Almacenamiento;

    @OneToMany(() => MovimientoStock, movimiento => movimiento.producto, { cascade: true })
    movimientos!: MovimientoStock[];

    @Column({ type: 'boolean', default: false })
    proximo_vencer!: boolean;

    @Column({ type: 'integer', nullable: true })
    nivel_prioridad!: number;
}