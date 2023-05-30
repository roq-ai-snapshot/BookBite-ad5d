import * as yup from 'yup';

export const reservationValidationSchema = yup.object().shape({
  reservation_time: yup.date().required(),
  status: yup.string().required(),
  customer_id: yup.string().nullable().required(),
  restaurant_id: yup.string().nullable().required(),
});
