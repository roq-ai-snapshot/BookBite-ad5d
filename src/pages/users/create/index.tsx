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
import { createUser } from 'apiSdk/users';
import { Error } from 'components/error';
import { userValidationSchema } from 'validationSchema/users';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';

function UserCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UserInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUser(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UserInterface>({
    initialValues: {
      roq_user_id: '',
      tenant_id: '',
    },
    validationSchema: userValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create User
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'user',
  operation: AccessOperationEnum.CREATE,
})(UserCreatePage);
