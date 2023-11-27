'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';

import { ModalEdit } from '@/components/parts/modalEdit';
import { TaskService } from '@/lib/services/tasks.service';

import { useSession } from 'next-auth/react';
import { ModalCreate } from './modalCreate';
import { ModalDelete } from './modalDelete';
import { Button } from '../ui/button';
import EditIcon from '@mui/icons-material/Edit';

export const TableMain = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [row, setRow] = useState<any>({});

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
  }, [session]);

  const getData = async () => {
    const response = await TaskService.getTasks();
    if (response.error) {
      alert(response.error);
      return;
    } else if (!response.length || response.length === 0) {
      alert('Nenhuma tarefa encontrada.');
      return;
    } else {
      setData(response);
      setLoadingTasks(true);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      getData();
    }
  }, [user]);

  const handleClose = (data: any) => {
    setOpenModalEdit(false);
    getData();
  };

  const handleOpenModalEdit = (row: any) => {
    setOpenModalEdit(true);
    setRow(row);
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'title',

        header: 'Título',
        size: 200,
        Cell: ({ cell }) => <p>{cell.getValue<string>()}</p>,
      },
      {
        accessorKey: 'description',
        header: 'Descrição',
        Cell: ({ cell }) => <p>{cell.getValue<string>()}</p>,
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        enableHiding: true,
        Cell: ({ cell }) => <p>{cell.getValue<string[]>()?.join(', ')}</p>,
      },
      {
        accessorKey: 'responsible.name',
        header: 'Responsável',
        size: 200,
        Cell: ({ cell }) => <p>{cell.getValue<string>()}</p>,
      },
      {
        accessorFn: (row) => new Date(row.createdAt),
        id: 'createdAt',
        header: 'Data de Criação',
        filterVariant: 'date',
        filterFn: 'lessThan',
        sortingFn: 'datetime',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ cell }) =>
          cell.getValue<Date>()?.toLocaleDateString?.('pt-BR'),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: '250px',
          },
        },
      },
      {
        accessorFn: (row) => row,
        accessorKey: 'actions',
        header: 'Ações',
        enableHiding: false,
        enableSorting: false,
        enableFiltering: false,

        Cell: ({ row }) => {
          return (
            <div className='flex flex-row gap-2'>
              <Button
                variant='outline'
                onClick={() => handleOpenModalEdit(row)}
              >
                <EditIcon />
              </Button>
              <ModalDelete selectedRow={row.original} />
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      {!loadingTasks ? (
        <div>Carregando...</div>
      ) : (
        <MaterialReactTable
          state={{}}
          muiLinearProgressProps={({ isTopToolbar }) => ({
            color: 'error',
          })}
          positionToolbarAlertBanner='bottom'
          columns={columns}
          data={data || []}
          enableGlobalFilter={false}
          enableDensityToggle={false}
          enableColumnActions={false}
          memoMode='cells'
          muiToolbarAlertBannerProps={undefined}
          muiTableHeadCellProps={{
            sx: {
              color: '#000000',
              fontFamily: 'inherit',
              fontWeight: 'normal',
              paddingRight: '2px',
              fontSize: 11,
            },
          }}
          muiTableHeadRowProps={{
            sx: {
              backgroundColor: '#e7dfe1',
              borderRadius: '20px',
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: (event) => {
              // row.original.message !== null &&
              // handleDetail(row.id, row.original);
            },
            sx: {
              cursor: 'pointer',
            },
          })}
          muiTableBodyCellProps={{
            sx: {
              fontFamily: 'inherit',
              paddingBottom: '4px',
              paddingTop: '4px',
              padding: 1,
              paddingRight: '5px',
              fontSize: 12,
              textAlignt: 'center',
            },
          }}
          muiTableBodyProps={{
            sx: {
              '& .MuiTableRow-root:last-child': {
                borderBottom: 'none',
              },
            },
          }}
          muiTablePaperProps={{
            elevation: 10,
            sx: {
              borderRadius: '20px',
              border: '0.5px solid #e0e0e0',
              padding: '20px',
            },
          }}
          initialState={{
            showColumnFilters: true,
            density: 'compact',
            pagination: { pageSize: 5, pageIndex: 0 },
            columnVisibility: {
              id: true,
              title: true,
              description: true,
              tags: true,
              responsible: true,
              createdAt: true,
            },
          }}
          renderTopToolbarCustomActions={({ table }) => (
            <div
              className='d-flex justify-content-between'
              style={{ width: '100%', paddingLeft: 5 }}
            >
              <div className='d-flex'>
                <Typography
                  component='span'
                  variant='h5'
                  fontFamily={'inherit'}
                  alignSelf='center'
                >
                  Lista de Tarefas
                </Typography>

                <Box
                  sx={{
                    margin: '0.5rem',
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                ></Box>
              </div>

              <ModalCreate />

              <ModalEdit
                open={openModalEdit}
                selectedRow={row.original}
                handleClose={handleClose}
              />
            </div>
          )}
        />
      )}
    </>
  );
};
