import * as yup from 'yup';

export const feedbackValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  comment: yup.string(),
  customer_id: yup.string().nullable().required(),
  restaurant_id: yup.string().nullable().required(),
});
