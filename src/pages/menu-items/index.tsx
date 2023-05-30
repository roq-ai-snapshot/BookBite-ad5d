import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getMenuItems, deleteMenuItemById } from 'apiSdk/menu-items';
import { MenuItemInterface } from 'interfaces/menu-item';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function MenuItemListPage() {
  const { data, error, isLoading, mutate } = useSWR<MenuItemInterface[]>(
    () => '/menu-items',
    () =>
      getMenuItems({
        relations: ['restaurant'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteMenuItemById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Menu Item
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Link href={`/menu-items/create`}>
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
                  <Th>Description</Th>
                  <Th>Price</Th>
                  <Th>Image URL</Th>
                  <Th>Restaurant</Th>

                  <Th>Edit</Th>
                  <Th>View</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>{record.description}</Td>
                    <Td>{record.price}</Td>
                    <Td>{record.image_url}</Td>
                    <Td>
                      <Link href={`/restaurants/view/${record.restaurant?.id}`}>{record.restaurant?.name}</Link>
                    </Td>

                    <Td>
                      <Link href={`/menu-items/edit/${record.id}`} passHref legacyBehavior>
                        <Button as="a">Edit</Button>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/menu-items/view/${record.id}`} passHref legacyBehavior>
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
  entity: 'menu_item',
  operation: AccessOperationEnum.READ,
})(MenuItemListPage);
