import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { AppContext, type UseAppStoreType, closeAll } from '../../contexts/AppContext';
import { GarageContext, type UseGarageStoreType } from '../../contexts/GarageContext';
import { FederationContext, type UseFederationStoreType } from '../../contexts/FederationContext';
import { type Page, isPage } from '.';

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)', // Hard black shadow
  borderRadius: theme.spacing(1),
  border: `2px solid black`, // Hard black outline
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
    '& .MuiBottomNavigationAction-root': {
      minWidth: '80px',
    },
  },
}));

const NavBar = (): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { page, setPage, settings, setSlideDirection, open, setOpen, windowSize } =
    useContext<UseAppStoreType>(AppContext);
  const { garage, robotUpdatedAt } = useContext<UseGarageStoreType>(GarageContext);
  const { setCurrentOrderId } = useContext<UseFederationStoreType>(FederationContext);

  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = React.useState(page);

  const pagesPosition = {
    robot: 1,
    offers: 2,
    create: 3,
    order: 4,
    settings: 5,
  };

  useEffect(() => {
    // re-render on order and robot updated at for latest orderId in tab
  }, [robotUpdatedAt]);

  useEffect(() => {
    // change tab (page) into the current route
    const pathPage: Page | string = location.pathname.split('/')[1];
    if (pathPage === 'index.html') {
      navigate('/robot');
      setPage('robot');
    }
    if (isPage(pathPage)) {
      setPage(pathPage);
    }
    setValue(pathPage as Page);
  }, [location]);

  const handleSlideDirection = function (oldPage: Page, newPage: Page): void {
    const oldPos: number = pagesPosition[oldPage];
    const newPos: number = pagesPosition[newPage];
    setSlideDirection(
      newPos > oldPos ? { in: 'left', out: 'right' } : { in: 'right', out: 'left' }
    );
  };

  const changePage = function (event: React.SyntheticEvent, newPage: Page): void {
    if (newPage !== 'none') {
      const slot = garage.getSlot();
      handleSlideDirection(page, newPage);
      setPage(newPage);
      const shortAlias = String(slot?.activeShortAlias);
      const activeOrderId = slot?.getRobot(slot?.activeShortAlias ?? '')?.activeOrderId;
      const lastOrderId = slot?.getRobot(slot?.lastShortAlias ?? '')?.lastOrderId;
      const param =
        newPage === 'order' ? `${shortAlias}/${String(activeOrderId ?? lastOrderId)}` : '';
      if (newPage === 'order') {
        setCurrentOrderId({ id: activeOrderId ?? lastOrderId, shortAlias });
      }
      setTimeout(() => {
        navigate(`/${newPage}/${param}`);
      }, theme.transitions.duration.leavingScreen * 3);
    }
  };

  useEffect(() => {
    setOpen(closeAll);
  }, [page, setOpen]);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: isSmallScreen ? 0 : 16,
        left: isSmallScreen ? 0 : '50%',
        transform: isSmallScreen ? 'none' : 'translateX(-50%)',
        zIndex: 1000,
        width: isSmallScreen ? '100%' : 'auto',
        maxWidth: 600,
        borderRadius: isSmallScreen ? 0 : theme.spacing(1),
        boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)', 
      }}
      elevation={3}
    >
      <StyledBottomNavigation value={value} onChange={changePage} showLabels>
        <BottomNavigationAction
          label={t('Robot')}
          value="robot"
          icon={<SmartToyOutlinedIcon />}
        />
        <BottomNavigationAction
          label={t('Offers')}
          value="offers"
          icon={<StorefrontOutlinedIcon />}
        />
        <BottomNavigationAction
          label={t('Create')}
          value="create"
          icon={<AddBoxOutlinedIcon />}
        />
        <BottomNavigationAction
          label={t('Orders')}
          value="order"
          icon={<AssignmentOutlinedIcon />}
          disabled={!garage.getSlot()?.getRobot()?.activeOrderId}
        />
        <BottomNavigationAction
          label={t('Settings')}
          value="settings"
          icon={<SettingsOutlinedIcon />}
        />
      </StyledBottomNavigation>
    </Paper>
  );
};

export default NavBar;
