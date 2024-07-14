import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, useMediaQuery, styled, useTheme, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppContext, type UseAppStoreType, closeAll } from '../../contexts/AppContext';
import { GarageContext, type UseGarageStoreType } from '../../contexts/GarageContext';
import RobotAvatar from '../../components/RobotAvatar';
import { RoboSatsTextIcon } from '../../components/Icons';
import { useTranslation } from 'react-i18next';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : 'white',
  boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
  borderRadius: '1vw',
  border: `2px solid ${theme.palette.mode === 'dark' ? '#fff' : '#000'}`,
  padding: '1vh',
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  top: theme.spacing(2), // Add margin to prevent sticking to top edge
  left: theme.spacing(2), // Add margin to prevent sticking to left edge
  right: theme.spacing(2), // Add margin to prevent sticking to right edge
  width: 'calc(100% - 64px)', // Adjust width to prevent overflow
  position: 'fixed',
  zIndex: 1100,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '0 2vw',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-between',
  },
}));

const CenterBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '5vw',
  flexGrow: 1,
});

const CenterButton = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const MobileToolbarContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '100%',
  marginLeft: theme.spacing(2),
}));

const TopNavBar = (): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setOpen, open } = useContext<UseAppStoreType>(AppContext);
  const { garage } = useContext<UseGarageStoreType>(GarageContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const slot = garage.getSlot();

  const navItems = [
    { label: 'Robosats Info', key: 'info' },
    { label: 'Learn Robosats', key: 'learn' },
    { label: 'Community', key: 'community' },
    { label: 'Exchange Summary', key: 'exchange' },
  ];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleLogoClick = () => {
    setOpen({ ...closeAll, client: !open.client });
  };

  return (
    <>
      <StyledAppBar position="fixed" elevation={3}>
        <StyledToolbar>
          <svg width={0} height={0}>
            <linearGradient id="linearColors" x1={1} y1={0} x2={1} y2={1}>
              <stop offset={0} stopColor={theme.palette.primary.main} />
              <stop offset={1} stopColor={theme.palette.secondary.main} />
            </linearGradient>
          </svg>
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <MobileToolbarContent>
                {slot?.hashId ? (
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setOpen({ ...closeAll, profile: !open.profile });
                    }}
                  >
                    <RobotAvatar
                      style={{ width: '2.5em', height: '2.5em' }}
                      avatarClass={theme.palette.mode === 'dark' ? 'navBarAvatarDark' : 'navBarAvatar'}
                      hashId={slot?.hashId}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setOpen({ ...closeAll, profile: !open.profile });
                    }}
                  >
                    <AccountCircleIcon style={{ fontSize: '1.5em' }} />
                  </IconButton>
                )}
              </MobileToolbarContent>
              <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List>
                  <ListItem button onClick={handleLogoClick}>
                    <RoboSatsTextIcon
                      sx={{
                        height: '2em',
                        width: 'auto',
                        cursor: 'pointer',
                        fill: 'url(#linearColors)',
                      }}
                    />
                  </ListItem>
                  {navItems.map((item) => (
                    <ListItem button key={item.key} onClick={() => setOpen({ ...closeAll, [item.key]: !open[item.key] })}>
                      <ListItemText primary={t(item.label)} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <>
              <RoboSatsTextIcon
                sx={{
                  height: '1.5em',
                  width: 'auto',
                  cursor: 'pointer',
                  marginLeft: -2,
                  fill: 'url(#linearColors)',
                }}
                onClick={handleLogoClick}
              />
              <CenterBox>
                {navItems.map((item) => (
                  <CenterButton
                    key={item.key}
                    onClick={() => setOpen({ ...closeAll, [item.key]: !open[item.key] })}
                  >
                    {t(item.label)}
                  </CenterButton>
                ))}
              </CenterBox>
              {slot?.hashId ? (
                <IconButton
                  edge="end"
                  onClick={() => {
                    setOpen({ ...closeAll, profile: !open.profile });
                  }}
                >
                  <RobotAvatar
                    style={{ width: '2.5em', height: '2.5em' }}
                    avatarClass={theme.palette.mode === 'dark' ? 'navBarAvatarDark' : 'navBarAvatar'}
                    hashId={slot?.hashId}
                  />
                </IconButton>
              ) : (
                <IconButton
                  edge="end"
                  onClick={() => {
                    setOpen({ ...closeAll, profile: !open.profile });
                  }}
                >
                  <AccountCircleIcon style={{ fontSize: '1.5em' }} />
                </IconButton>
              )}
            </>
          )}
        </StyledToolbar>
      </StyledAppBar>
    </>
  );
};

export default TopNavBar;
