import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';

export interface StaffInterface {
  id?: string;
  user_id: string;
  restaurant_id: string;
  role: string;

  user?: UserInterface;
  restaurant?: RestaurantInterface;
  _count?: {};
}
