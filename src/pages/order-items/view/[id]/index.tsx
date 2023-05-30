import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getOrderItemById } from 'apiSdk/order-items';
import { Error } from 'components/error';
import { OrderItemInterface } from 'interfaces/order-item';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function OrderItemViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OrderItemInterface>(
    () => (id ? `/order-items/${id}` : null),
    () =>
      getOrderItemById(id, {
        relations: ['order', 'menu_item'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Order Item Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Quantity: {data?.quantity}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Order: <Link href={`/orders/view/${data?.order?.id}`}>{data?.order?.status}</Link>
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Menu Item: <Link href={`/menu-items/view/${data?.menu_item?.id}`}>{data?.menu_item?.name}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'order_item',
  operation: AccessOperationEnum.READ,
})(OrderItemViewPage);
