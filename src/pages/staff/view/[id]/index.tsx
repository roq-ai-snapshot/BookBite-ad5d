import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getStaffById } from 'apiSdk/staff';
import { Error } from 'components/error';
import { StaffInterface } from 'interfaces/staff';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function StaffViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StaffInterface>(
    () => (id ? `/staff/${id}` : null),
    () =>
      getStaffById(id, {
        relations: ['user', 'restaurant'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Staff Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Role: {data?.role}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              User: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.roq_user_id}</Link>
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Restaurant: <Link href={`/restaurants/view/${data?.restaurant?.id}`}>{data?.restaurant?.name}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'staff',
  operation: AccessOperationEnum.READ,
})(StaffViewPage);
