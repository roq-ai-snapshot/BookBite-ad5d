import { OrderItemInterface } from 'interfaces/order-item';
import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';

export interface OrderInterface {
  id?: string;
  customer_id: string;
  restaurant_id: string;
  status: string;
  order_type: string;
  special_requests?: string;
  payment_information: string;
  order_item?: OrderItemInterface[];
  user?: UserInterface;
  restaurant?: RestaurantInterface;
  _count?: {
    order_item?: number;
  };
}
