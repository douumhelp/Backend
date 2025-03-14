import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
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
    @PrimaryColumn()
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

    @ManyToOne(() => UserPJ, userPJ => userPJ.orderDeals)
    userPJ: UserPJ;

    @ManyToOne(() => Category, category => category.orderDeals)
    category: Category;

    @ManyToOne(() => OrderRequest, orderRequest => orderRequest.orderDeals)
    orderRequest: OrderRequest;

    @OneToOne(() => Order, order => order.ordelDeal)
    order: Order[];
}