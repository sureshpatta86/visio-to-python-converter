import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';

export const Header: React.FC = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <DescriptionIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Visio to XML Converter
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            v1.0.0
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};