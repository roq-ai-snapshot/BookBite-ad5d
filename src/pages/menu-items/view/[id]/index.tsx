import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getMenuItemById } from 'apiSdk/menu-items';
import { Error } from 'components/error';
import { MenuItemInterface } from 'interfaces/menu-item';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function MenuItemViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MenuItemInterface>(
    () => (id ? `/menu-items/${id}` : null),
    () =>
      getMenuItemById(id, {
        relations: ['restaurant'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Menu Item Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Name: {data?.name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Description: {data?.description}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Price: {data?.price}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Image URL: {data?.image_url}
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
  entity: 'menu_item',
  operation: AccessOperationEnum.READ,
})(MenuItemViewPage);
