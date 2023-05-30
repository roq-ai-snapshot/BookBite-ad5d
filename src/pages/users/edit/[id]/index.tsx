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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getUserById, updateUserById } from 'apiSdk/users';
import { Error } from 'components/error';
import { userValidationSchema } from 'validationSchema/users';
import { UserInterface } from 'interfaces/user';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function UserEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<UserInterface>(
    () => (id ? `/users/${id}` : null),
    () => getUserById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: UserInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateUserById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<UserInterface>({
    initialValues: data,
    validationSchema: userValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit User
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="roq_user_id" mb="4" isInvalid={!!formik.errors?.roq_user_id}>
              <FormLabel>Roq User ID</FormLabel>
              <Input type="text" name="roq_user_id" value={formik.values?.roq_user_id} onChange={formik.handleChange} />
              {formik.errors.roq_user_id && <FormErrorMessage>{formik.errors?.roq_user_id}</FormErrorMessage>}
            </FormControl>
            <FormControl id="tenant_id" mb="4" isInvalid={!!formik.errors?.tenant_id}>
              <FormLabel>Tenant ID</FormLabel>
              <Input type="text" name="tenant_id" value={formik.values?.tenant_id} onChange={formik.handleChange} />
              {formik.errors.tenant_id && <FormErrorMessage>{formik.errors?.tenant_id}</FormErrorMessage>}
            </FormControl>

            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'user',
  operation: AccessOperationEnum.UPDATE,
})(UserEditPage);
