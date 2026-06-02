import React, { useState} from 'react';
import type { AlertColor } from '@mui/material';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Button, 
  Menu, 
  MenuItem, 
  TablePagination,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { 
  getSubscribers, 
  deleteSubscriber, 
  exportSubscribers 
} from '../services/api/subscribersApi';

const SubscribersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['subscribers', page, rowsPerPage],
    queryFn: () => getSubscribers(page + 1, rowsPerPage),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      setSnackbar({
        open: true,
        message: 'Subscriber deleted successfully',
        severity: 'success'
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to delete subscriber',
        severity: 'error'
      });
    }
  });

  const handleExport = async (format: 'excel' | 'csv' | 'json') => {
    try {
      await exportSubscribers(format);
      setSnackbar({
        open: true,
        message: `Exported subscribers as ${format.toUpperCase()} successfully`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to export subscribers',
        severity: 'error'
      });
    }
    setAnchorEl(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading subscribers: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleMenuOpen}
          >
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleExport('excel')}>Export as Excel</MenuItem>
            <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
            <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>
          </Menu>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Subscribed On</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((subscriber: any) => (
              <TableRow key={subscriber._id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleDelete(subscriber._id)}
                    color="error"
                    disabled={deleteMutation.isPending}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.pagination?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SubscribersPage;
