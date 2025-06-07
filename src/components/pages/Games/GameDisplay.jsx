import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Grid as Grid2 } from '@mui/material'; // in v6, Grid2 is stable

import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Slide,
  Zoom,
  Paper,
  Avatar,
  IconButton,
  Divider,
  LinearProgress
} from '@mui/material';
import { styled, keyframes, alpha } from '@mui/material/styles';
import {
  CheckCircle,
  Person,
  ShoppingCart,
  Payment,
  AccountBalanceWallet,
  QrCode,
  ArrowBack,
  SportsEsports,
  Star,
  Shield,
  Bolt,
  CreditCard,
  Security,
  Speed,
  LocalFireDepartment,
  EmojiEvents
} from '@mui/icons-material';


// Pixelmoon Gaming Theme Styles
const neonGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
    box-shadow: 0 0 5px currentColor;
  }
  50% { 
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const floatingParticles = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
  33% { transform: translateY(-10px) rotate(120deg); opacity: 0.8; }
  66% { transform: translateY(5px) rotate(240deg); opacity: 0.6; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 1; }
`;

// Styled Components
// 1) A root wrapper that strips out the custom prop
const PixelmoonContainerRoot = ({ currentTheme, ...otherProps }) => {
  return <Container {...otherProps} />;
};

// 2) Styled version uses currentTheme for styling but never forwards it to the DOM
export const PixelmoonContainer = styled(PixelmoonContainerRoot)(
  ({ theme, currentTheme }) => ({
    minHeight: '100vh',
    background: currentTheme === 'dark'
      ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      : 'linear-gradient(135deg, #f0f2ff 0%, #e6f3ff 50%, #dbeafe 100%)',
    position: 'relative',
    padding: '2rem 1rem',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: currentTheme === 'dark'
        ? `radial-gradient(circle at 20% 20%, ${alpha('#0f3460', 0.3)} 0%, transparent 50%),
           radial-gradient(circle at 80% 80%, ${alpha('#533a7b', 0.3)} 0%, transparent 50%),
           radial-gradient(circle at 40% 40%, ${alpha('#1e40af', 0.2)} 0%, transparent 50%)`
        : `radial-gradient(circle at 20% 20%, ${alpha('#3b82f6', 0.1)} 0%, transparent 50%),
           radial-gradient(circle at 80% 80%, ${alpha('#8b5cf6', 0.1)} 0%, transparent 50%)`,
      pointerEvents: 'none',
    },
  })
);
// 1) Create a wrapper to strip out currentTheme & variant
const NeonCardRoot = ({ currentTheme, variant, ...otherProps }) => {
  // We forward only valid props (e.g. className, children, sx, etc.) to <Card>
  return <Card {...otherProps} />;
};

// 2) Use styled() on NeonCardRoot so we can still access currentTheme & variant in the styling callback
export const NeonCard = styled(NeonCardRoot)(
  ({ theme, currentTheme, variant = 'default' }) => {
    // Compute border & glow colors based on currentTheme + variant
    const getColors = () => {
      if (currentTheme === 'dark') {
        switch (variant) {
          case 'validate': return { border: '#00f5ff', glow: '#00f5ff' };
          case 'packs':    return { border: '#ff6b6b', glow: '#ff6b6b' };
          case 'summary':  return { border: '#4ecdc4', glow: '#4ecdc4' };
          case 'payment':  return { border: '#ffe66d', glow: '#ffe66d' };
          default:         return { border: '#00f5ff', glow: '#00f5ff' };
        }
      } else {
        switch (variant) {
          case 'validate': return { border: '#2563eb', glow: '#2563eb' };
          case 'packs':    return { border: '#dc2626', glow: '#dc2626' };
          case 'summary':  return { border: '#059669', glow: '#059669' };
          case 'payment':  return { border: '#d97706', glow: '#d97706' };
          default:         return { border: '#2563eb', glow: '#2563eb' };
        }
      }
    };

    const { border, glow } = getColors();

    return {
      borderRadius: '16px',
      border: `2px solid ${border}`,
      boxShadow: `0 0 15px ${alpha(glow, 0.5)}`,
      background: currentTheme === 'dark' ? '#1a1a1a' : '#fff',
      color: currentTheme === 'dark' ? '#e0e0e0' : '#111',
      overflow: 'hidden',
      position: 'relative',
      // If you want an additional neon‐pulse effect, you can add:
      // animation: variant === 'validate' ? `${pulseAnimation} 2s infinite` : 'none',
    };
  }
);

// 1) Wrapper that strips out currentTheme and selected
const PackCardRoot = ({ currentTheme, selected, ...otherProps }) => {
  return <Card {...otherProps} />;
};

// 2) Styled version uses currentTheme + selected for CSS but never forwards them to DOM
export const PackCard = styled(PackCardRoot)(
  ({ theme, currentTheme, selected }) => ({
    background: currentTheme === 'dark'
      ? (selected
          ? 'linear-gradient(145deg, rgba(0, 245, 255, 0.1), rgba(0, 200, 255, 0.05))'
          : 'linear-gradient(145deg, rgba(40, 40, 80, 0.8), rgba(30, 30, 60, 0.8))'
        )
      : (selected
          ? 'linear-gradient(145deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05))'
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))'
        ),
    border: `2px solid ${
      selected
        ? (currentTheme === 'dark' ? '#00f5ff' : '#2563eb')
        : (currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')
    }`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: selected
        ? `linear-gradient(45deg, ${alpha(currentTheme === 'dark' ? '#00f5ff' : '#2563eb', 0.1)}, transparent)`
        : 'transparent',
      transition: 'all 0.3s ease',
    },

    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: selected
        ? `0 20px 40px ${alpha(currentTheme === 'dark' ? '#00f5ff' : '#2563eb', 0.3)}`
        : `0 16px 32px ${alpha(currentTheme === 'dark' ? '#ffffff' : '#000000', 0.1)}`,
      '&::before': {
        background: `linear-gradient(45deg, ${
          alpha(currentTheme === 'dark' ? '#00f5ff' : '#2563eb', 0.15)
        }, transparent)`,
      },
    },

    animation: selected ? `${pulseAnimation} 2s infinite` : 'none',
  })
);

// 1) Create a wrapper that removes custom props
const NeonButtonRoot = ({ currentTheme, variant, ...otherProps }) => {
  // Only pass valid props (e.g., children, onClick, disabled, sx) to <Button>
  return <Button {...otherProps} />;
};

// 2) Use styled() on that wrapper so the callback still sees currentTheme + variant,
//    but those props never get forwarded to the DOM element.
export const NeonButton = styled(NeonButtonRoot)(
  ({ theme, currentTheme, variant = 'primary' }) => {
    // Determine colors based on currentTheme and variant
    const getColors = () => {
      if (currentTheme === 'dark') {
        switch (variant) {
          case 'success':
            return { bg: '#00ff88', color: '#000', glow: '#00ff88' };
          case 'validate':
            return { bg: '#00f5ff', color: '#000', glow: '#00f5ff' };
          default:
            return { bg: '#ff6b6b', color: '#fff', glow: '#ff6b6b' };
        }
      } else {
        switch (variant) {
          case 'success':
            return { bg: '#059669', color: '#fff', glow: '#059669' };
          case 'validate':
            return { bg: '#2563eb', color: '#fff', glow: '#2563eb' };
          default:
            return { bg: '#dc2626', color: '#fff', glow: '#dc2626' };
        }
      }
    };

    const colors = getColors();

    return {
      background: `linear-gradient(45deg, ${colors.bg}, ${alpha(colors.bg, 0.8)})`,
      color: colors.color,
      border: `2px solid ${colors.bg}`,
      borderRadius: '8px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: `0 0 20px ${alpha(colors.glow, 0.4)}`,
      transition: 'all 0.3s ease',

      '&:hover': {
        background: `linear-gradient(45deg, ${alpha(colors.bg, 0.9)}, ${colors.bg})`,
        boxShadow: `0 0 30px ${alpha(colors.glow, 0.6)}, 0 0 60px ${alpha(colors.glow, 0.3)}`,
        transform: 'translateY(-2px)',
        animation: `${neonGlow} 1.5s ease-in-out infinite`,
      },

      '&:disabled': {
        background:
          currentTheme === 'dark'
            ? 'rgba(100, 100, 100, 0.3)'
            : 'rgba(200, 200, 200, 0.3)',
        color:
          currentTheme === 'dark'
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.3)',
        boxShadow: 'none',
        animation: 'none',
      },
    };
  }
);

// 1) Create a small wrapper that strips out custom props
const StepIconRoot = ({ currentTheme, active, completed, ...otherProps }) => {
  // Only valid props (e.g. className, children) get forwarded to Avatar
  return <Avatar {...otherProps} />;
};

// 2) Use styled() on that wrapper.
//    The styling callback still sees currentTheme, active, completed
export const StepIcon = styled(StepIconRoot)(
  ({ theme, currentTheme, active, completed }) => ({
    width: 48,
    height: 48,
    fontSize: '1.2rem',
    fontWeight: 'bold',

    // Background gradient or fallback based on state
    background: completed
      ? (currentTheme === 'dark' ? '#00ff88' : '#059669')
      : active
      ? (currentTheme === 'dark' ? '#00f5ff' : '#2563eb')
      : (currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),

    // Text color when active/completed or fallback
    color: completed || active
      ? '#000'
      : (currentTheme === 'dark' ? '#fff' : '#666'),

    // Border color when active/completed or fallback
    border: `2px solid ${
      completed
        ? (currentTheme === 'dark' ? '#00ff88' : '#059669')
        : active
        ? (currentTheme === 'dark' ? '#00f5ff' : '#2563eb')
        : (currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)')
    }`,

    // Glow shadow when active/completed
    boxShadow: completed || active
      ? `0 0 20px ${
          alpha(
            completed
              ? (currentTheme === 'dark' ? '#00ff88' : '#059669')
              : (currentTheme === 'dark' ? '#00f5ff' : '#2563eb'),
            0.5
          )
        }`
      : 'none',

    // Simple pulse animation when active
    animation: active ? `${pulseAnimation} 2s infinite` : 'none',
  })
);

// 1) Wrapper to strip out currentTheme before passing props to Box
const FloatingParticleRoot = ({ currentTheme, ...otherProps }) => {
  return <Box {...otherProps} />;
};

// 2) Styled component that still sees “currentTheme” in its callback, but never forwards it to the DOM
export const FloatingParticle = styled(FloatingParticleRoot)(
  ({ theme, currentTheme }) => ({
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: currentTheme === 'dark' ? '#00f5ff' : '#2563eb',
    borderRadius: '50%',
    animation: `${floatingParticles} 6s ease-in-out infinite`, // use your existing keyframes
    opacity: 0.6,
  })
);

const GameDisplay = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme: currentTheme } = useTheme();
  const API_BASE = import.meta.env.VITE_API_URL;

  // State
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ userId: '' });
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [paymentMode, setPaymentMode] = useState('wallet');
  const [purchasing, setPurchasing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Mock data for demo
useEffect(() => {
  const fetchGame = async () => {
    try {
      const response = await fetch(`${API_BASE}/games/${gameId}`);
      const data = await response.json();
      if (response.ok && data.success && data.game) {
        setGame(data.game);
      } else {
        navigate('/games');
      }
    } catch (error) {
      console.error('Error fetching game:', error);
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  fetchGame();
}, [gameId, navigate, API_BASE]);

  // Functions
 const validateUser = async () => {
  if (!userInfo.userId.trim()) {
    alert('Please enter your User ID');
    return;
  }

  setValidating(true);
  try {
    const response = await fetch(`${API_BASE}/games/validate-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: gameId,
        userId: userInfo.userId,
        serverId: ""
      }),
    });

    const data = await response.json();
    if (response.ok && data.success && data.valid) {
      setValidationResult(data.data);
      setShowValidationAlert(true);
      setActiveStep(1);
      setTimeout(() => setShowValidationAlert(false), 3000);
    } else {
      alert(data.message || 'User validation failed');
      setValidationResult(null);
    }
  } catch (error) {
    console.error('Error validating user:', error);
    alert('An error occurred during validation');
    setValidationResult(null);
  } finally {
    setValidating(false);
  }
};

  const handlePackSelect = (pack) => {
    setSelectedPack(pack);
    setActiveStep(2);
  };

  const handlePurchase = async () => {
    if (!selectedPack || !validationResult) return;
    
    setPurchasing(true);
    setActiveStep(3);
    setTimeout(() => {
      alert('Purchase Successful! (Demo)');
      setPurchasing(false);
    }, 3000);
  };

  const getPackPrice = (pack) => {
    if (!user) return pack.retailPrice;
    return user.role === 'reseller' ? pack.resellerPrice : pack.retailPrice;
  };

  const steps = ['Validate User', 'Select Pack', 'Order Summary', 'Payment'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" 
           sx={{ background: currentTheme === 'dark' ? '#0a0a0a' : '#f0f2ff' }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', mb: 2 }} />
          <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#fff' : '#000' }}>
            Loading Game Universe...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <PixelmoonContainer maxWidth="xl" currentTheme={currentTheme}>
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle
          key={i}
          currentTheme={currentTheme}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Header */}
      <Slide direction="down" in={true} timeout={800}>
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: '"Orbitron", monospace',
              fontWeight: 'bold',
              background: currentTheme === 'dark'
                ? 'linear-gradient(45deg, #00f5ff, #ff6b6b, #00ff88)'
                : 'linear-gradient(45deg, #2563eb, #dc2626, #059669)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 1,
              animation: `${neonGlow} 3s ease-in-out infinite`,
            }}
          >
            PIXELMOON STORE
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: currentTheme === 'dark' ? '#fff' : '#374151',
              opacity: 0.8,
              letterSpacing: '2px'
            }}
          >
            {game?.name} - Premium Gaming Experience
          </Typography>
        </Box>
      </Slide>

      {/* Progress Stepper */}
      <Fade in={true} timeout={1000}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            background: 'transparent',
            border: `1px solid ${currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '16px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={() => (
                    <StepIcon 
                      currentTheme={currentTheme}
                      active={index === activeStep}
                      completed={index < activeStep}
                    >
                      {index < activeStep ? <CheckCircle /> : index + 1}
                    </StepIcon>
                  )}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: currentTheme === 'dark' ? '#fff' : '#374151',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      mt: 1
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Fade>

      <Grid container spacing={4}>
        {/* Game Info Sidebar */}
        <Grid2 xs={12} lg={3}>
          <Slide direction="right" in={true} timeout={1000}>
            <NeonCard currentTheme={currentTheme} variant="default">
              <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                <img 
                  src={game?.image} 
                  alt={game?.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    filter: currentTheme === 'dark' ? 'brightness(0.8) contrast(1.2)' : 'none'
                  }}
                />
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    p: 2
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {game?.name}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip label={game?.region} size="small" sx={{ bgcolor: '#00f5ff', color: '#000' }} />
                    <Chip label={game?.category} size="small" sx={{ bgcolor: '#ff6b6b', color: '#fff' }} />
                  </Box>
                </Box>
              </Box>
              
              <CardContent>
                <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', mb: 2 }}>
                  <SportsEsports sx={{ mr: 1, verticalAlign: 'middle' }} />
                  How to Top-Up
                </Typography>
                
                {[
                  { icon: <Person />, text: 'Enter your User ID', color: '#00f5ff' },
                  { icon: <ShoppingCart />, text: 'Select a pack', color: '#ff6b6b' },
                  { icon: <Star />, text: 'Review your order', color: '#4ecdc4' },
                  { icon: <Payment />, text: 'Choose payment', color: '#ffe66d' },
                  { icon: <CheckCircle />, text: 'Complete purchase', color: '#00ff88' },
                ].map((step, index) => (
                  <Box 
                    key={index}
                    display="flex" 
                    alignItems="center" 
                    mb={2}
                    sx={{
                      animation: `${slideInLeft} 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(step.color, 0.2), 
                        color: step.color, 
                        width: 32, 
                        height: 32, 
                        mr: 2 
                      }}
                    >
                      {step.icon}
                    </Avatar>
                    <Typography sx={{ color: currentTheme === 'dark' ? '#fff' : '#374151' }}>
                      {step.text}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </NeonCard>
          </Slide>
        </Grid2>

        {/* Main Content */}
        <Grid2 xs={12} lg={6}>
          {/* User Validation */}
          <Slide direction="up" in={true} timeout={1200}>
            <NeonCard currentTheme={currentTheme} variant="validate" sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', mb: 3 }}>
                  <Shield sx={{ mr: 1, verticalAlign: 'middle' }} />
                  User Validation
                </Typography>

                {showValidationAlert && (
                  <Zoom in={showValidationAlert}>
                    <Alert 
                      severity="success" 
                      sx={{ 
                        mb: 3, 
                        background: currentTheme === 'dark' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                        border: `1px solid ${currentTheme === 'dark' ? '#00ff88' : '#059669'}`,
                        color: currentTheme === 'dark' ? '#00ff88' : '#059669'
                      }}
                    >
                      User <strong>{validationResult?.username}</strong> validated successfully!
                    </Alert>
                  </Zoom>
                )}

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Your User ID"
                    placeholder="Enter your gaming ID"
                    value={userInfo.userId}
                    onChange={(e) => setUserInfo({ userId: e.target.value })}
                    disabled={Boolean(validationResult)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        '& fieldset': {
                          borderColor: currentTheme === 'dark' ? 'rgba(0,245,255,0.3)' : 'rgba(37,99,235,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: currentTheme === 'dark' ? '#00f5ff' : '#2563eb',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: currentTheme === 'dark' ? '#00f5ff' : '#2563eb',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: currentTheme === 'dark' ? '#fff' : '#374151',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: currentTheme === 'dark' ? '#fff' : '#000',
                      }
                    }}
                  />
                  <NeonButton
                    currentTheme={currentTheme}
                    variant="validate"
                    onClick={validateUser}
                    disabled={!userInfo.userId.trim() || validating || validationResult}
                    sx={{ minWidth: 140, height: 56 }}
                  >
                    {validating ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Validating...
                      </>
                    ) : validationResult ? (
                      <>
                        <CheckCircle sx={{ mr: 1 }} />
                        Validated
                      </>
                    ) : (
                      'Validate'
                    )}
                  </NeonButton>
                </Box>
              </CardContent>
            </NeonCard>
          </Slide>

          {/* Pack Selection */}
          <Slide direction="up" in={true} timeout={1400}>
            <NeonCard currentTheme={currentTheme} variant="packs">
              <CardContent>
                <Typography variant="h5" sx={{ color: currentTheme === 'dark' ? '#ff6b6b' : '#dc2626', mb: 3 }}>
                  <Bolt sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Power Up Packs
                </Typography>

                <Grid container spacing={3}>
                  {game?.packs?.map((pack, index) => {
                    const price = getPackPrice(pack);
                    const isSelected = selectedPack?.packId === pack.packId;
                    
                    return (
                      <Grid item xs={12} sm={6} key={pack.packId}>
                        <Zoom in={true} timeout={600 + index * 200}>
                          <PackCard
                            currentTheme={currentTheme}
                            selected={isSelected}
                            onClick={() => handlePackSelect(pack)}
                          >
                            <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                              {isSelected && (
                                <CheckCircle 
                                  sx={{ 
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: currentTheme === 'dark' ? '#00ff88' : '#059669',
                                    fontSize: 32,
                                    animation: `${pulseAnimation} 1s ease-in-out`
                                  }} 
                                  
                                />
                                )}

                              <Box display="flex" justifyContent="center" mb={2}>
                                <Avatar 
                                  sx={{ 
                                    width: 60, 
                                    height: 60, 
                                    background: `linear-gradient(45deg, ${currentTheme === 'dark' ? '#ff6b6b' : '#dc2626'}, ${currentTheme === 'dark' ? '#ff9999' : '#ef4444'})`,
                                    color: '#fff',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    boxShadow: `0 0 20px ${alpha(currentTheme === 'dark' ? '#ff6b6b' : '#dc2626', 0.5)}`
                                  }}
                                >
                                  {String(pack.amount).match(/\d+/)[0].slice(0, 2)}
                                </Avatar>
                              </Box>

                              <Typography variant="h6" sx={{ 
                                fontWeight: 'bold', 
                                color: currentTheme === 'dark' ? '#fff' : '#000',
                                mb: 1 
                              }}>
                                {pack.name}
                              </Typography>
                              
                              <Typography variant="h4" sx={{ 
                                color: currentTheme === 'dark' ? '#00ff88' : '#059669',
                                fontWeight: 'bold',
                                mb: 1
                              }}>
                                {pack.amount}
                              </Typography>

                              <Typography variant="body2" sx={{ 
                                color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                mb: 2 
                              }}>
                                {pack.description}
                              </Typography>

                              <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                                {user?.role === 'reseller' && (
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      textDecoration: 'line-through',
                                      color: currentTheme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                    }}
                                  >
                                    ₹{pack.retailPrice}
                                  </Typography>
                                )}
                                <Typography 
                                  variant="h5" 
                                  sx={{ 
                                    color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  ₹{price}
                                </Typography>
                              </Box>

                              {user?.role === 'reseller' && (
                                <Chip 
                                  label={`Save ₹${pack.retailPrice - pack.resellerPrice}`}
                                  size="small"
                                  sx={{ 
                                    mt: 1,
                                    bgcolor: currentTheme === 'dark' ? '#00ff88' : '#059669',
                                    color: '#000',
                                    fontWeight: 'bold'
                                  }}
                                />
                              )}
                            </CardContent>
                          </PackCard>
                        </Zoom>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </NeonCard>
          </Slide>
        </Grid2>

        {/* Order Summary & Payment */}
        <Grid2 xs={12} lg={3}>
          {/* Order Summary */}
          {selectedPack && (
            <Slide direction="left" in={true} timeout={1600}>
              <NeonCard currentTheme={currentTheme} variant="summary" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#4ecdc4' : '#059669', mb: 2 }}>
                    <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Order Summary
                  </Typography>

                  <Box sx={{ 
                    p: 2, 
                    background: currentTheme === 'dark' ? 'rgba(78, 205, 196, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme === 'dark' ? '#4ecdc4' : '#059669'}`,
                    mb: 2
                  }}>
                    <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? '#fff' : '#000', opacity: 0.7 }}>
                      Game: {game?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? '#fff' : '#000', opacity: 0.7 }}>
                      User: {validationResult?.username}
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                    <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#fff' : '#000' }}>
                      {selectedPack.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: currentTheme === 'dark' ? '#4ecdc4' : '#059669' }}>
                      {selectedPack.amount}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body1" sx={{ color: currentTheme === 'dark' ? '#fff' : '#000' }}>
                      Total Amount:
                    </Typography>
                    <Typography variant="h5" sx={{ 
                      color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                      fontWeight: 'bold'
                    }}>
                      ₹{getPackPrice(selectedPack)}
                    </Typography>
                  </Box>

                  {user?.role === 'reseller' && (
                    <Alert 
                      severity="info"
                      sx={{
                        background: currentTheme === 'dark' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                        border: `1px solid ${currentTheme === 'dark' ? '#00f5ff' : '#2563eb'}`,
                        color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb',
                        fontSize: '0.8rem'
                      }}
                    >
                      Reseller Discount Applied!
                    </Alert>
                  )}
                </CardContent>
              </NeonCard>
            </Slide>
          )}

          {/* Payment Options */}
          {selectedPack && (
            <Slide direction="left" in={true} timeout={1800}>
              <NeonCard currentTheme={currentTheme} variant="payment">
                <CardContent>
                  <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#ffe66d' : '#d97706', mb: 3 }}>
                    <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Payment Method
                  </Typography>

                  <FormControl fullWidth>
                    <RadioGroup
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      <FormControlLabel
                        value="wallet"
                        control={
                          <Radio 
                            sx={{ 
                              color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                              '&.Mui-checked': {
                                color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                              }
                            }} 
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccountBalanceWallet sx={{ color: currentTheme === 'dark' ? '#ffe66d' : '#d97706' }} />
                            <Box>
                              <Typography sx={{ color: currentTheme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}>
                                Wallet Balance
                              </Typography>
                              <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                                Available: ₹{user?.walletBalance || 5000}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      
                      <FormControlLabel
                        value="upi"
                        control={
                          <Radio 
                            sx={{ 
                              color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                              '&.Mui-checked': {
                                color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                              }
                            }} 
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <QrCode sx={{ color: currentTheme === 'dark' ? '#ffe66d' : '#d97706' }} />
                            <Box>
                              <Typography sx={{ color: currentTheme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}>
                                UPI Payment
                              </Typography>
                              <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                                Pay via UPI apps
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />

                      <FormControlLabel
                        value="card"
                        control={
                          <Radio 
                            sx={{ 
                              color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                              '&.Mui-checked': {
                                color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                              }
                            }} 
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <CreditCard sx={{ color: currentTheme === 'dark' ? '#ffe66d' : '#d97706' }} />
                            <Box>
                              <Typography sx={{ color: currentTheme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}>
                                Card Payment
                              </Typography>
                              <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                                Credit/Debit cards
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  <NeonButton
                    fullWidth
                    currentTheme={currentTheme}
                    variant="success"
                    onClick={handlePurchase}
                    disabled={!selectedPack || !validationResult || purchasing}
                    sx={{ mt: 3, height: 56, fontSize: '1.1rem' }}
                  >
                    {purchasing ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 2 }} />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <LocalFireDepartment sx={{ mr: 1 }} />
                        Complete Purchase
                      </>
                    )}
                  </NeonButton>

                  {/* Security badges */}
                  <Box display="flex" justifyContent="center" gap={1} mt={2}>
                    <Chip 
                      icon={<Security />}
                      label="Secure"
                      size="small"
                      sx={{ 
                        bgcolor: currentTheme === 'dark' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(5, 150, 105, 0.2)',
                        color: currentTheme === 'dark' ? '#00ff88' : '#059669'
                      }}
                    />
                    <Chip 
                      icon={<Speed />}
                      label="Instant"
                      size="small"
                      sx={{ 
                        bgcolor: currentTheme === 'dark' ? 'rgba(255, 235, 109, 0.2)' : 'rgba(217, 119, 6, 0.2)',
                        color: currentTheme === 'dark' ? '#ffe66d' : '#d97706'
                      }}
                    />
                  </Box>
                </CardContent>
              </NeonCard>
            </Slide>
          )}
        </Grid2>
      </Grid>

      {/* Success Animation */}
      {activeStep === 3 && (
        <Zoom in={true} timeout={1000}>
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
            }}
          >
            <NeonCard currentTheme={currentTheme} variant="success" sx={{ maxWidth: 400, textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: currentTheme === 'dark' ? '#00ff88' : '#059669',
                    color: '#000',
                    mx: 'auto',
                    mb: 2,
                    animation: `${pulseAnimation} 1s ease-in-out infinite`
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography variant="h4" sx={{ 
                  color: currentTheme === 'dark' ? '#00ff88' : '#059669',
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  SUCCESS!
                </Typography>
                
                <Typography variant="h6" sx={{ 
                  color: currentTheme === 'dark' ? '#fff' : '#000',
                  mb: 2
                }}>
                  Your {selectedPack?.name} has been purchased!
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  mb: 3
                }}>
                  {selectedPack?.amount} will be credited to your account within 5 minutes.
                </Typography>

                <LinearProgress 
                  sx={{ 
                    mb: 3,
                    bgcolor: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: currentTheme === 'dark' ? '#00ff88' : '#059669'
                    }
                  }} 
                />
                
                <NeonButton
                  currentTheme={currentTheme}
                  variant="success"
                  onClick={() => setActiveStep(0)}
                  sx={{ minWidth: 150 }}
                >
                  New Purchase
                </NeonButton>
              </CardContent>
            </NeonCard>
          </Box>
        </Zoom>
      )}

      {/* Back Button */}
      <Box position="fixed" top={20} left={20}>
        <IconButton
          onClick={() => window.history.back()}
          sx={{
            bgcolor: currentTheme === 'dark' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(37, 99, 235, 0.1)',
            color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${currentTheme === 'dark' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
            '&:hover': {
              bgcolor: currentTheme === 'dark' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(37, 99, 235, 0.2)',
              transform: 'scale(1.1)',
            }
          }}
        >
          <ArrowBack />
        </IconButton>
      </Box>
    </PixelmoonContainer>
  );
};

export default GameDisplay;