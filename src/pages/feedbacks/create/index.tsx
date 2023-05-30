import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createFeedback } from 'apiSdk/feedbacks';
import { Error } from 'components/error';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';
import { FeedbackInterface } from 'interfaces/feedback';

function FeedbackCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FeedbackInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFeedback(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FeedbackInterface>({
    initialValues: {
      rating: 0,
      comment: '',
      customer_id: (router.query.customer_id as string) ?? null,
      restaurant_id: (router.query.restaurant_id as string) ?? null,
    },
    validationSchema: feedbackValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Feedback
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="rating" mb="4" isInvalid={!!formik.errors?.rating}>
            <FormLabel>Rating</FormLabel>
            <NumberInput
              name="rating"
              value={formik.values?.rating}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.rating && <FormErrorMessage>{formik.errors?.rating}</FormErrorMessage>}
          </FormControl>
          <FormControl id="comment" mb="4" isInvalid={!!formik.errors?.comment}>
            <FormLabel>Comment</FormLabel>
            <Input type="text" name="comment" value={formik.values?.comment} onChange={formik.handleChange} />
            {formik.errors.comment && <FormErrorMessage>{formik.errors?.comment}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'customer_id'}
            label={'Customer'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.roq_user_id}
              </option>
            )}
          />
          <AsyncSelect<RestaurantInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Restaurant'}
            placeholder={'Select Restaurant'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.name}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'feedback',
  operation: AccessOperationEnum.CREATE,
})(FeedbackCreatePage);
