import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getOrderItems, deleteOrderItemById } from 'apiSdk/order-items';
import { OrderItemInterface } from 'interfaces/order-item';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function OrderItemListPage() {
  const { data, error, isLoading, mutate } = useSWR<OrderItemInterface[]>(
    () => '/order-items',
    () =>
      getOrderItems({
        relations: ['order', 'menu_item'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteOrderItemById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Order Item
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Link href={`/order-items/create`}>
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
                  <Th>Quantity</Th>
                  <Th>Order ID</Th>
                  <Th>Menu Item</Th>

                  <Th>Edit</Th>
                  <Th>View</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.quantity}</Td>
                    <Td>
                      <Link href={`/orders/view/${record.order?.id}`}>{record.order?.status}</Link>
                    </Td>
                    <Td>
                      <Link href={`/menu-items/view/${record.menu_item?.id}`}>{record.menu_item?.name}</Link>
                    </Td>

                    <Td>
                      <Link href={`/order-items/edit/${record.id}`} passHref legacyBehavior>
                        <Button as="a">Edit</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/order-items/view/${record.id}`} passHref legacyBehavior>
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
  entity: 'order_item',
  operation: AccessOperationEnum.READ,
})(OrderItemListPage);
