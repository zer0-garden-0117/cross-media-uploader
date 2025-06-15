import React, { useMemo, useEffect, useState } from 'react'
import Head from 'next/head'
import {
  MantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_TablePagination,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Box, Flex, Menu, Image } from '@mantine/core';
import { SavedPostData } from '../../post';

export default function PostListPage() {
  const [data, setData] = useState<SavedPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    renderRowActionMenuItems: () => (
      <>
        <Menu.Item>Edit</Menu.Item>
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
    <>
      <Head>
        <title>Cross Media Uploader</title>
      </Head>
      <MantineReactTable table={table} />
    </>
  );
}