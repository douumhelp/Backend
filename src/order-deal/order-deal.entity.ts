import { Entity, Column, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { UserPF } from "../userpf/userpf.entity";
import { UserPJ } from "../userpj/userpj.entity";
import { Category } from "../categories/category.entity";
import { Order } from "../order/order.entity";
import { OrderRequest } from "src/order-request/order-request.entity";

export enum ClientAcceptance {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}

@Entity()
export class OrderDeal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "enum",
        enum: ClientAcceptance,
        nullable: true
    })
    clientAcceptance: ClientAcceptance;

    @Column("real")
    freelancerPrice: number;

    @Column({ type: 'timestamp', nullable: true })
    scheduledDate: Date | null; 

    @Column({ type: 'int', nullable: false})
    estimatedDuration: number; //duração estimada do serviço em minutos

    @ManyToOne(() => UserPJ, userPJ => userPJ.orderDeals)
    userPJ: UserPJ;

    @ManyToOne(() => Category, category => category.orderDeals)
    category: Category;

    @ManyToOne(() => OrderRequest, orderRequest => orderRequest.orderDeals)
    orderRequest: OrderRequest;

    @OneToOne(() => Order)
    @JoinColumn({ name: 'order_id' }) // Define a coluna de junção
    order: Order;
}