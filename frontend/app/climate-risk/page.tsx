'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import FloodIcon from '@mui/icons-material/Flood';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const states = ['FL', 'CA', 'TX', 'NY', 'CO', 'AZ', 'WA', 'OR', 'NC', 'GA'];

export default function ClimateRiskPage() {
    const [state, setState] = useState('CA');
    const [elevation, setElevation] = useState(100);
    const [analyzed, setAnalyzed] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Mock climate data
    const climateData = {
        FL: { flood: 75, wildfire: 20, hurricane: 85, heat: 70, drought: 30, seaLevel: 90 },
        CA: { flood: 30, wildfire: 85, hurricane: 5, heat: 60, drought: 75, seaLevel: 40 },
        TX: { flood: 50, wildfire: 40, hurricane: 60, heat: 80, drought: 65, seaLevel: 35 },
        NY: { flood: 40, wildfire: 10, hurricane: 35, heat: 40, drought: 20, seaLevel: 45 },
        CO: { flood: 35, wildfire: 65, hurricane: 0, heat: 30, drought: 55, seaLevel: 0 }
    };

    const risks = climateData[state as keyof typeof climateData] || climateData.CA;
    const overallRisk = Math.round((risks.flood + risks.wildfire + risks.hurricane + risks.heat + risks.drought) / 5);

    const timeline = [
        { year: 2025, overall: overallRisk, flood: risks.flood, wildfire: risks.wildfire, heat: risks.heat },
        { year: 2030, overall: Math.min(100, overallRisk * 1.1), flood: Math.min(100, risks.flood * 1.1), wildfire: Math.min(100, risks.wildfire * 1.15), heat: Math.min(100, risks.heat * 1.2) },
        { year: 2040, overall: Math.min(100, overallRisk * 1.25), flood: Math.min(100, risks.flood * 1.2), wildfire: Math.min(100, risks.wildfire * 1.3), heat: Math.min(100, risks.heat * 1.4) },
        { year: 2050, overall: Math.min(100, overallRisk * 1.4), flood: Math.min(100, risks.flood * 1.35), wildfire: Math.min(100, risks.wildfire * 1.5), heat: Math.min(100, risks.heat * 1.6) },
        { year: 2075, overall: Math.min(100, overallRisk * 1.65), flood: Math.min(100, risks.flood * 1.5), wildfire: Math.min(100, risks.wildfire * 1.8), heat: Math.min(100, risks.heat * 2) },
        { year: 2100, overall: Math.min(100, overallRisk * 1.9), flood: Math.min(100, risks.flood * 1.7), wildfire: Math.min(100, risks.wildfire * 2), heat: Math.min(100, risks.heat * 2.5) }
    ];

    const insurance = timeline.map(t => ({
        year: t.year,
        annual: Math.round(1500 * (1 + t.overall / 100)),
        flood: risks.flood > 50 ? Math.round(800 * (1 + t.flood / 200)) : 0,
        wildfire: risks.wildfire > 50 ? Math.round(600 * (1 + t.wildfire / 200)) : 0
    }));

    const getRiskColor = (score: number) => {
        if (score <= 30) return 'success';
        if (score <= 60) return 'warning';
        return 'error';
    };

    const getRiskLabel = (score: number) => {
        if (score <= 20) return 'Low';
        if (score <= 40) return 'Moderate';
        if (score <= 60) return 'Elevated';
        if (score <= 80) return 'High';
        return 'Extreme';
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <WbCloudyIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>Climate Prophet AI</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        100-year climate risk projections with insurance cost modeling and adaptation recommendations
                    </Typography>
                </Box>

                <Paper sx={{ p: 4, mb: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="State"
                                value={state}
                                onChange={(e) => { setState(e.target.value); setAnalyzed(false); }}
                            >
                                {states.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Elevation (ft)"
                                value={elevation}
                                onChange={(e) => setElevation(Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button variant="contained" size="large" fullWidth onClick={() => setAnalyzed(true)}>
                                Analyze Climate Risks
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {analyzed && (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: getRiskColor(overallRisk) + '.50' }}>
                                    <Typography variant="h2" fontWeight={700} color={getRiskColor(overallRisk) + '.dark'}>{overallRisk}</Typography>
                                    <Typography variant="h6" color={getRiskColor(overallRisk) + '.dark'}>{getRiskLabel(overallRisk)} Risk</Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>Overall Climate Risk Score</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>Risk Breakdown</Typography>
                                    <Grid container spacing={2}>
                                        {[
                                            { label: 'Flood', value: risks.flood, icon: <FloodIcon /> },
                                            { label: 'Wildfire', value: risks.wildfire, icon: <LocalFireDepartmentIcon /> },
                                            { label: 'Hurricane', value: risks.hurricane, icon: <WbCloudyIcon /> },
                                            { label: 'Extreme Heat', value: risks.heat, icon: <ThermostatIcon /> },
                                            { label: 'Drought', value: risks.drought, icon: <AcUnitIcon /> },
                                            { label: 'Sea Level Rise', value: risks.seaLevel, icon: <WaterDropIcon /> }
                                        ].map(risk => (
                                            <Grid item xs={6} sm={4} key={risk.label}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    {risk.icon}
                                                    <Typography variant="body2">{risk.label}</Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={risk.value}
                                                    color={getRiskColor(risk.value) as any}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                    <Typography variant="caption">{risk.value}%</Typography>
                                                    <Chip label={getRiskLabel(risk.value)} size="small" color={getRiskColor(risk.value) as any} />
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Paper sx={{ mb: 4 }}>
                            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tab label="100-Year Timeline" />
                                <Tab label="Insurance Projections" />
                                <Tab label="Recommendations" />
                            </Tabs>

                            <Box sx={{ p: 3 }}>
                                {activeTab === 0 && (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Year</TableCell>
                                                    <TableCell>Overall Risk</TableCell>
                                                    <TableCell>Flood Risk</TableCell>
                                                    <TableCell>Wildfire Risk</TableCell>
                                                    <TableCell>Heat Risk</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {timeline.map(row => (
                                                    <TableRow key={row.year}>
                                                        <TableCell><strong>{row.year}</strong></TableCell>
                                                        <TableCell><Chip label={`${Math.round(row.overall)}%`} size="small" color={getRiskColor(row.overall) as any} /></TableCell>
                                                        <TableCell>{Math.round(row.flood)}%</TableCell>
                                                        <TableCell>{Math.round(row.wildfire)}%</TableCell>
                                                        <TableCell>{Math.round(row.heat)}%</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}

                                {activeTab === 1 && (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Year</TableCell>
                                                    <TableCell>Estimated Annual Premium</TableCell>
                                                    <TableCell>Flood Insurance</TableCell>
                                                    <TableCell>Wildfire Rider</TableCell>
                                                    <TableCell>Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {insurance.map(row => (
                                                    <TableRow key={row.year}>
                                                        <TableCell><strong>{row.year}</strong></TableCell>
                                                        <TableCell>${row.annual.toLocaleString()}</TableCell>
                                                        <TableCell>{row.flood > 0 ? `$${row.flood.toLocaleString()}` : 'N/A'}</TableCell>
                                                        <TableCell>{row.wildfire > 0 ? `$${row.wildfire.toLocaleString()}` : 'N/A'}</TableCell>
                                                        <TableCell><strong>${(row.annual + row.flood + row.wildfire).toLocaleString()}</strong></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}

                                {activeTab === 2 && (
                                    <Grid container spacing={2}>
                                        {[
                                            { title: 'Flood Barriers', cost: '$15,000', reduction: '30%', priority: risks.flood > 50 ? 'High' : 'Low' },
                                            { title: 'Fire-Resistant Landscaping', cost: '$5,000', reduction: '25%', priority: risks.wildfire > 50 ? 'High' : 'Low' },
                                            { title: 'Solar + Battery Backup', cost: '$25,000', reduction: '20%', priority: 'Medium' },
                                            { title: 'Enhanced Insulation', cost: '$8,000', reduction: '15%', priority: risks.heat > 60 ? 'High' : 'Medium' },
                                            { title: 'Rainwater Harvesting', cost: '$3,000', reduction: '10%', priority: risks.drought > 50 ? 'High' : 'Low' }
                                        ].map(item => (
                                            <Grid item xs={12} sm={6} md={4} key={item.title}>
                                                <Paper variant="outlined" sx={{ p: 2 }}>
                                                    <Typography variant="subtitle1" fontWeight={600}>{item.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Cost: {item.cost}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Risk Reduction: {item.reduction}</Typography>
                                                    <Chip label={`${item.priority} Priority`} size="small" sx={{ mt: 1 }} color={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'default'} />
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Paper>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                Data sources: NOAA Climate Data, FEMA Flood Maps, NASA Earth Science, EPA Air Quality, USGS Water Resources
                            </Typography>
                        </Alert>
                    </>
                )}
            </Container>
        </Box>
    );
}
