import * as yup from 'yup';
import { orderItemValidationSchema } from 'validationSchema/order-items';

export const menuItemValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  price: yup.number().integer().required(),
  image_url: yup.string(),
  restaurant_id: yup.string().nullable().required(),
  order_item: yup.array().of(orderItemValidationSchema),
});
