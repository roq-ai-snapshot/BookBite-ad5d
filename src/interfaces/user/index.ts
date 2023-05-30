import { FeedbackInterface } from 'interfaces/feedback';
import { OrderInterface } from 'interfaces/order';
import { ReservationInterface } from 'interfaces/reservation';
import { RestaurantInterface } from 'interfaces/restaurant';
import { StaffInterface } from 'interfaces/staff';

export interface UserInterface {
  id?: string;
  roq_user_id: string;
  tenant_id: string;
  feedback?: FeedbackInterface[];
  order?: OrderInterface[];
  reservation?: ReservationInterface[];
  restaurant?: RestaurantInterface[];
  staff?: StaffInterface[];

  _count?: {
    feedback?: number;
    order?: number;
    reservation?: number;
    restaurant?: number;
    staff?: number;
  };
}
