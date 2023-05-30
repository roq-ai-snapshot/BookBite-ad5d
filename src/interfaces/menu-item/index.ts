import { OrderItemInterface } from 'interfaces/order-item';
import { RestaurantInterface } from 'interfaces/restaurant';

export interface MenuItemInterface {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  restaurant_id: string;
  order_item?: OrderItemInterface[];
  restaurant?: RestaurantInterface;
  _count?: {
    order_item?: number;
  };
}
