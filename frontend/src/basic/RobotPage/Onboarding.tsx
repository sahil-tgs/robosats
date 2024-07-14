import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Grid,
  LinearProgress,
  Link,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { type Robot } from '../../models';
import { Casino, Bolt, Check, Storefront, AddBox, School } from '@mui/icons-material';
import RobotAvatar from '../../components/RobotAvatar';
import TokenInput from './TokenInput';
import { genBase62Token } from '../../utils';
import { NewTabIcon } from '../../components/Icons';
import { AppContext, type UseAppStoreType } from '../../contexts/AppContext';
import { GarageContext, type UseGarageStoreType } from '../../contexts/GarageContext';
import { styled } from '@mui/system';

interface OnboardingProps {
  setView: (state: 'welcome' | 'onboarding' | 'recovery' | 'profile') => void;
  robot: Robot;
  setRobot: (state: Robot) => void;
  inputToken: string;
  setInputToken: (state: string) => void;
  getGenerateRobot: (token: string) => void;
  badToken: string;
  baseUrl: string;
}

const StyledPaper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: `8px 8px 0px 0px ${theme.palette.mode === 'dark' ? 'white' : 'black'}`,
  borderRadius: '1vw',
  border: `2px solid ${theme.palette.text.primary}`,
  padding: '1vh',
  color: theme.palette.text.primary,
  marginBottom: '1em',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  justifyContent: 'center',
  textAlign: 'center',
  padding: theme.spacing(2),
  height: '100%',
  borderRadius: '8px',
  border: `2px solid ${theme.palette.text.primary}`,
  boxShadow: `4px 4px 0px 0px ${theme.palette.mode === 'dark' ? 'white' : 'black'}`,
  '&:hover': {
    boxShadow: `8px 8px 0px 0px ${theme.palette.mode === 'dark' ? 'white' : 'black'}`,
  },
  margin: '0.5em 0',
}));

const Onboarding = ({
  setView,
  inputToken,
  setInputToken,
  badToken,
  getGenerateRobot,
}: OnboardingProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { setPage } = useContext<UseAppStoreType>(AppContext);
  const { garage } = useContext<UseGarageStoreType>(GarageContext);

  const [step, setStep] = useState<'1' | '2' | '3'>('1');
  const [generatedToken, setGeneratedToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const generateToken = (): void => {
    setGeneratedToken(true);
    setInputToken(genBase62Token(36));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const slot = garage.getSlot();

  const steps = [t('1. Generate a token'), t('2. Meet your robot identity'), t('3. Browse or create an order')];

  return (
    <Box>
      <Stepper activeStep={parseInt(step) - 1} alternativeLabel sx={{ marginBottom: '2em' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === '1' && (
        <StyledPaper>
          <Typography variant='h5' color='text.primary'>
            {steps[0]}
          </Typography>
          <Grid container direction='column' alignItems='center' spacing={1} padding={1}>
            <Grid item>
              <Typography>
                {t(
                  'This temporary key gives you access to a unique and private robot identity for your trade.',
                )}
              </Typography>
            </Grid>
            {!generatedToken ? (
              <Grid item>
                <StyledButton autoFocus onClick={generateToken} variant='contained' size='large'>
                  <Casino />
                  {t('Generate token')}
                </StyledButton>
              </Grid>
            ) : (
              <Grid item>
                <Collapse in={generatedToken}>
                  <Grid container direction='column' alignItems='center' spacing={1}>
                    <Grid item>
                      <Alert variant='outlined' severity='info'>
                        <b>{`${t('Store it somewhere safe!')} `}</b>
                        {t(
                          `This token is the one and only key to your robot and trade. You will need it later to recover your order or check its status.`,
                        )}
                      </Alert>
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TokenInput
                        loading={loading}
                        autoFocusTarget='copyButton'
                        inputToken={inputToken}
                        setInputToken={setInputToken}
                        badToken={badToken}
                        onPressEnter={() => null}
                      />
                    </Grid>
                    <Grid item>
                      <Typography>
                        {t('You can also add your own random characters into the token or')}
                        <Button size='small' onClick={generateToken}>
                          <Casino />
                          {t('roll again')}
                        </Button>
                      </Typography>
                    </Grid>

                    <Grid item>
                      <StyledButton
                        onClick={() => {
                          setStep('2');
                          getGenerateRobot(inputToken);
                        }}
                        variant='contained'
                        size='large'
                      >
                        <Check />
                        {t('Continue')}
                      </StyledButton>
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
            )}
          </Grid>
        </StyledPaper>
      )}

      {step === '2' && (
        <StyledPaper>
          <Typography variant='h5' color='text.primary'>
            {steps[1]}
          </Typography>
          <Grid container direction='column' alignItems='center' spacing={1}>
            <Grid item>
              <Typography>
                {slot?.hashId ? (
                  t('This is your trading avatar')
                ) : (
                  <>
                    <b>{t('Building your robot!')}</b>
                    <LinearProgress />
                  </>
                )}
              </Typography>
            </Grid>

            <Grid item sx={{ width: '13.5em' }}>
              <RobotAvatar
                hashId={slot?.hashId ?? ''}
                smooth={true}
                style={{ maxWidth: '12.5em', maxHeight: '12.5em' }}
                placeholderType='generating'
                imageStyle={{
                  transform: '',
                  border: '2px solid #555',
                  filter: 'drop-shadow(1px 1px 1px #000000)',
                  height: '12.4em',
                  width: '12.4em',
                }}
                tooltipPosition='top'
              />
            </Grid>

            {slot?.nickname ? (
              <Grid item>
                <Typography align='center'>{t('Hi! My name is')}</Typography>
                <Typography component='h5' variant='h5'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Bolt
                      sx={{
                        color: '#fcba03',
                        height: '1.5em',
                        width: '1.5em',
                      }}
                    />
                    <b>{slot?.nickname}</b>
                    <Bolt
                      sx={{
                        color: '#fcba03',
                        height: '1.5em',
                        width: '1.5em',
                      }}
                    />
                  </div>
                </Typography>
              </Grid>
            ) : null}
            <Grid item>
              <Collapse in={!!slot?.hashId}>
                <StyledButton
                  onClick={() => {
                    setStep('3');
                  }}
                  variant='contained'
                  size='large'
                >
                  <Check />
                  {t('Continue')}
                </StyledButton>
              </Collapse>
            </Grid>
          </Grid>
        </StyledPaper>
      )}

      {step === '3' && (
        <StyledPaper>
          <Typography variant='h5' color='text.primary'>
            {steps[2]}
          </Typography>
          <Grid container direction='column' alignItems='center' spacing={1} padding={1.5}>
            <Grid item>
              <Typography>
                {t(
                  'RoboSats is a peer-to-peer marketplace. You can browse the public offers or create a new one.',
                )}
              </Typography>
            </Grid>

            <Grid item>
              <ButtonGroup variant='contained'>
                <Button
                  color='primary'
                  onClick={() => {
                    navigate('/offers');
                    setPage('offers');
                  }}
                >
                    <Storefront /> <div style={{ width: '0.5em' }} />
                    {t('Offers')}
                </Button>
                <Button
                  color='secondary'
                  onClick={() => {
                    navigate('/create');
                    setPage('create');
                  }}
                >
                    <AddBox /> <div style={{ width: '0.5em' }} />
                    {t('Create')}
                </Button>
              </ButtonGroup>
            </Grid>

            <Grid item>
              <Typography>
                {`${t('If you need help on your RoboSats journey join our public support')} `}
                <Link target='_blank' href='https://t.me/robosats_es' rel='noreferrer'>
                  {t('Telegram group')}
                </Link>
                {`, ${t('or visit the robot school for documentation.')} `}
              </Typography>
            </Grid>
            <Grid item>
              <StyledButton
                component={Link}
                href='https://learn.robosats.com'
                target='_blank'
                color='inherit'
                variant='contained'
              >
                <School /> <div style={{ width: '0.5em' }} />
                {t('Learn RoboSats')}
                <div style={{ width: '0.5em' }} />
                <NewTabIcon sx={{ width: '0.8em' }} />
              </StyledButton>
            </Grid>
            <Grid item sx={{ position: 'relative', top: '0.6em' }}>
              <Button
                color='inherit'
                onClick={() => {
                  setView('profile');
                }}
              >
                {t('See profile')}
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>
      )}
    </Box>
  );
};

export default Onboarding;
