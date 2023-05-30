import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getRestaurants, deleteRestaurantById } from 'apiSdk/restaurants';
import { RestaurantInterface } from 'interfaces/restaurant';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function RestaurantListPage() {
  const { data, error, isLoading, mutate } = useSWR<RestaurantInterface[]>(
    () => '/restaurants',
    () =>
      getRestaurants({
        relations: ['user', 'feedback.count', 'menu_item.count', 'order.count', 'reservation.count', 'staff.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteRestaurantById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Restaurant
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Link href={`/restaurants/create`}>
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
                  <Th>Name</Th>
                  <Th>Owner</Th>
                  <Th>Feedback</Th>
                  <Th>Menu Items</Th>
                  <Th>Orders</Th>
                  <Th>Reservations</Th>
                  <Th>Staff</Th>
                  <Th>Edit</Th>
                  <Th>View</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>
                      <Link href={`/users/view/${record.user?.id}`}>{record.user?.roq_user_id}</Link>
                    </Td>
                    <Td>{record?._count?.feedback}</Td>
                    <Td>{record?._count?.menu_item}</Td>
                    <Td>{record?._count?.order}</Td>
                    <Td>{record?._count?.reservation}</Td>
                    <Td>{record?._count?.staff}</Td>
                    <Td>
                      <Link href={`/restaurants/edit/${record.id}`} passHref legacyBehavior>
                        <Button as="a">Edit</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/restaurants/view/${record.id}`} passHref legacyBehavior>
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
  entity: 'restaurant',
  operation: AccessOperationEnum.READ,
})(RestaurantListPage);
