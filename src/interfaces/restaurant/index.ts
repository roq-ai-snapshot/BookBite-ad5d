import { FeedbackInterface } from 'interfaces/feedback';
import { MenuItemInterface } from 'interfaces/menu-item';
import { OrderInterface } from 'interfaces/order';
import { ReservationInterface } from 'interfaces/reservation';
import { StaffInterface } from 'interfaces/staff';
import { UserInterface } from 'interfaces/user';

export interface RestaurantInterface {
  id?: string;
  name: string;
  owner_id: string;
  feedback?: FeedbackInterface[];
  menu_item?: MenuItemInterface[];
  order?: OrderInterface[];
  reservation?: ReservationInterface[];
  staff?: StaffInterface[];
  user?: UserInterface;
  _count?: {
    feedback?: number;
    menu_item?: number;
    order?: number;
    reservation?: number;
    staff?: number;
  };
}
