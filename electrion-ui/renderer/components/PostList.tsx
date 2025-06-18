import React, { useMemo, useEffect, useState } from 'react'
import {
  MantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_TablePagination,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Box, Flex, Menu, Image } from '@mantine/core';
import { SavedPostData } from '../../post';

export function PostList() {
  const [data, setData] = useState<SavedPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.deletePostData(postId);
      if (result.success) {
        const postData = await window.electronAPI.getPostDatas();
        setData(postData);
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
        console.error(error);
        alert('エラーが発生しました');
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await window.electronAPI.getPostDatas();
        console.log(postData)
        setData(postData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<SavedPostData>[]>(
    () => [
      {
        accessorKey: 'scheduledTime',
        header: 'scheduledTime',
      },
      {
        accessorKey: 'comment',
        header: 'comment',
      },
      {
        accessorKey: 'id',
        header: 'postId',
      },
      {
        accessorKey: 'image',
        header: 'image',
        Cell: ({ cell }) => {
          const imagePath = cell.getValue<string>();
          return (
            <Box style={{ width: 50, height: 50, marginBottom: 20 }}>
            <Image
              src={`file://${imagePath}`}
              width="100%"
              height="100%"
              fit="cover"
            />
            </Box>
          );
        },
      },
    ], []);

  const table = useMantineReactTable({
    columns,
    data,
    enableRowActions: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: true,
    enableBottomToolbar: false,
    mantineTableProps: {
      highlightOnHover: false,
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },
    state: {
      isLoading,
    },
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item
          color='blue'
        >
          Edit
        </Menu.Item>
        <Menu.Item
          onClick={() => handleDeletePost(row.original.id)}
          color="red"
        >
          Delete
        </Menu.Item>
      </>
    ),
    renderTopToolbar: ({ table }) => {
      return (
        <Flex justify="space-between" align="center" p="md">
          <MRT_GlobalFilterTextInput table={table} />
          <MRT_TablePagination table={table} />
        </Flex>
      );
    },
  });



  return (
    <MantineReactTable table={table} />
  )
}