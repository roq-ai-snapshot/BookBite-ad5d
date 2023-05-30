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
import { createStaff } from 'apiSdk/staff';
import { Error } from 'components/error';
import { staffValidationSchema } from 'validationSchema/staff';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';
import { StaffInterface } from 'interfaces/staff';

function StaffCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: StaffInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createStaff(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<StaffInterface>({
    initialValues: {
      role: '',
      user_id: (router.query.user_id as string) ?? null,
      restaurant_id: (router.query.restaurant_id as string) ?? null,
    },
    validationSchema: staffValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Staff
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="role" mb="4" isInvalid={!!formik.errors?.role}>
            <FormLabel>Role</FormLabel>
            <Input type="text" name="role" value={formik.values?.role} onChange={formik.handleChange} />
            {formik.errors.role && <FormErrorMessage>{formik.errors?.role}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'User'}
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
  entity: 'staff',
  operation: AccessOperationEnum.CREATE,
})(StaffCreatePage);
