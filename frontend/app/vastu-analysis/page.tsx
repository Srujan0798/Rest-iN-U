'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';

const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];

const RULING_DEITIES = {
    north: { deity: 'Kubera', governs: 'Wealth & Finances', element: 'Water', color: 'blue' },
    northeast: { deity: 'Eshanya (Lord Shiva)', governs: 'Spirituality', element: 'Water', color: 'lightblue' },
    east: { deity: 'Indra', governs: 'Prosperity', element: 'Air', color: 'green' },
    southeast: { deity: 'Agni', governs: 'Fire & Energy', element: 'Fire', color: 'orange' },
    south: { deity: 'Yama', governs: 'Dharma', element: 'Fire', color: 'red' },
    southwest: { deity: 'Nir Rakshasa', governs: 'Ancestors', element: 'Earth', color: 'brown' },
    west: { deity: 'Varuna', governs: 'Water', element: 'Water', color: 'cyan' },
    northwest: { deity: 'Vayu', governs: 'Wind', element: 'Air', color: 'lightgreen' }
};

export default function VastuAnalysisPage() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [roomLayout, setRoomLayout] = useState({
        entrance: 'east',
        kitchen: 'southeast',
        masterBedroom: 'southwest',
        bathroom: 'west',
        livingRoom: 'north',
        poojaRoom: 'northeast'
    });

    const runAnalysis = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockResult = {
            score: 78,
            grade: 'B+',
            summary: 'Good Vastu compliance with 2 areas for improvement.',
            issues: [
                { name: 'Kitchen Placement', severity: 'moderate', description: 'Kitchen is in southeast - ideal placement!', remedy: '', scoreImpact: 15 },
                { name: 'Bathroom Direction', severity: 'minor', description: 'Bathroom in west is acceptable but north-west preferred.', remedy: 'No structural changes needed', scoreImpact: -3 }
            ],
            fiveElements: {
                earth: { score: 75, status: 'balanced' },
                water: { score: 80, status: 'balanced' },
                fire: { score: 90, status: 'ideal' },
                air: { score: 70, status: 'balanced' },
                ether: { score: 85, status: 'balanced' }
            },
            certificateEligible: true
        };

        setResult(mockResult);
        setLoading(false);
        setStep(2);
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <ErrorIcon color="error" />;
            case 'moderate': return <WarningIcon color="warning" />;
            default: return <CheckCircleIcon color="success" />;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <TempleHinduIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>Vastu AI Analysis</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Analyze your property against 10,000+ Vedic Vastu Shastra principles for optimal energy flow
                    </Typography>
                </Box>

                <Stepper activeStep={step} sx={{ mb: 4 }}>
                    <Step><StepLabel>Enter Details</StepLabel></Step>
                    <Step><StepLabel>Analyze</StepLabel></Step>
                    <Step><StepLabel>Results</StepLabel></Step>
                </Stepper>

                {step === 0 && (
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Room Placement</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Select the direction of each room in your property
                        </Typography>

                        <Grid container spacing={3}>
                            {Object.entries(roomLayout).map(([room, direction]) => (
                                <Grid item xs={12} sm={6} md={4} key={room}>
                                    <TextField
                                        select
                                        fullWidth
                                        label={room.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        value={direction}
                                        onChange={(e) => setRoomLayout({ ...roomLayout, [room]: e.target.value })}
                                    >
                                        {directions.map((dir) => (
                                            <MenuItem key={dir} value={dir}>
                                                {dir.charAt(0).toUpperCase() + dir.slice(1)} - {RULING_DEITIES[dir as keyof typeof RULING_DEITIES]?.deity}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button variant="contained" size="large" onClick={() => setStep(1)}>
                                Continue to Analysis
                            </Button>
                        </Box>
                    </Paper>
                )}

                {step === 1 && (
                    <Paper sx={{ p: 6, textAlign: 'center' }}>
                        {loading ? (
                            <>
                                <CircularProgress size={60} sx={{ mb: 3 }} />
                                <Typography variant="h6">Analyzing Vastu Compliance...</Typography>
                                <Typography color="text.secondary">Checking against 10,000+ Vedic principles</Typography>
                            </>
                        ) : (
                            <>
                                <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h5" fontWeight={600} gutterBottom>Ready to Analyze</Typography>
                                <Typography color="text.secondary" sx={{ mb: 3 }}>
                                    Click below to run comprehensive Vastu analysis
                                </Typography>
                                <Button variant="contained" size="large" onClick={runAnalysis}>
                                    Run Vastu Analysis
                                </Button>
                            </>
                        )}
                    </Paper>
                )}

                {step === 2 && result && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>Vastu Score</Typography>
                                <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={result.score}
                                        size={120}
                                        thickness={6}
                                        color={getScoreColor(result.score) as any}
                                    />
                                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                        <Typography variant="h3" fontWeight={700}>{result.score}</Typography>
                                        <Typography variant="h6">{result.grade}</Typography>
                                    </Box>
                                </Box>
                                <Chip label={result.certificateEligible ? 'Certificate Eligible' : 'Needs Improvement'} color={result.certificateEligible ? 'success' : 'warning'} />
                                <Typography color="text.secondary" sx={{ mt: 2 }}>{result.summary}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Five Elements Balance</Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(result.fiveElements).map(([element, data]) => (
                                        <Grid item xs={12} key={element}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography sx={{ width: 60, textTransform: 'capitalize' }}>{element}</Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(data as any).score}
                                                    sx={{ flex: 1, height: 10, borderRadius: 5 }}
                                                    color={(data as any).score >= 70 ? 'success' : 'warning'}
                                                />
                                                <Typography sx={{ width: 40 }}>{(data as any).score}%</Typography>
                                                <Chip label={(data as any).status} size="small" color={(data as any).score >= 70 ? 'success' : 'default'} />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Analysis Details</Typography>
                                {result.issues.map((issue: any, i: number) => (
                                    <Accordion key={i}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {getSeverityIcon(issue.severity)}
                                                <Typography>{issue.name}</Typography>
                                                <Chip label={`${issue.scoreImpact > 0 ? '+' : ''}${issue.scoreImpact}`} size="small" color={issue.scoreImpact >= 0 ? 'success' : 'warning'} />
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography color="text.secondary">{issue.description}</Typography>
                                            {issue.remedy && (
                                                <Alert severity="info" sx={{ mt: 2 }}>Remedy: {issue.remedy}</Alert>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Directional Energy Map</Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(RULING_DEITIES).map(([direction, info]) => (
                                        <Grid item xs={6} sm={3} key={direction}>
                                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: `${info.color}22`, border: `2px solid ${info.color}` }}>
                                                <Typography variant="subtitle2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{direction}</Typography>
                                                <Typography variant="body2" color="text.secondary">{info.deity}</Typography>
                                                <Chip label={info.element} size="small" sx={{ mt: 1 }} />
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Button variant="contained" size="large" sx={{ mr: 2 }}>Download Certificate</Button>
                            <Button variant="outlined" onClick={() => { setStep(0); setResult(null); }}>Analyze Another Property</Button>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
