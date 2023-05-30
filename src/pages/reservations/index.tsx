import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getReservations, deleteReservationById } from 'apiSdk/reservations';
import { ReservationInterface } from 'interfaces/reservation';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function ReservationListPage() {
  const { data, error, isLoading, mutate } = useSWR<ReservationInterface[]>(
    () => '/reservations',
    () =>
      getReservations({
        relations: ['user', 'restaurant'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteReservationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Reservation
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Link href={`/reservations/create`}>
          <Button colorScheme="blue" mr="4">
            Create
          </Button>
        </Link>
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Reservation Time</Th>
                  <Th>Status</Th>
                  <Th>Customer</Th>
                  <Th>Restaurant</Th>

                  <Th>Edit</Th>
                  <Th>View</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.reservation_time as unknown as string}</Td>
                    <Td>{record.status}</Td>
                    <Td>
                      <Link href={`/users/view/${record.user?.id}`}>{record.user?.roq_user_id}</Link>
                    </Td>
                    <Td>
                      <Link href={`/restaurants/view/${record.restaurant?.id}`}>{record.restaurant?.name}</Link>
                    </Td>

                    <Td>
                      <Link href={`/reservations/edit/${record.id}`} passHref legacyBehavior>
                        <Button as="a">Edit</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/reservations/view/${record.id}`} passHref legacyBehavior>
                        <Button as="a">View</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'reservation',
  operation: AccessOperationEnum.READ,
})(ReservationListPage);
