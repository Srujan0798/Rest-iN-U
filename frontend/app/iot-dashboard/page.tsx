'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import SensorsIcon from '@mui/icons-material/Sensors';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

export default function IoTDashboardPage() {
    const [activeTab, setActiveTab] = useState(0);

    const sensorData = {
        airQuality: { aqi: 42, pm25: 8.5, co2: 520, humidity: 45, status: 'Good', color: 'success' },
        water: { tds: 150, ph: 7.2, chlorine: 0.3, status: 'Safe', color: 'success' },
        noise: { current: 38, average: 42, peak: 58, status: 'Quiet', color: 'success' },
        emf: { level: 0.15, status: 'Low', risk: 'Minimal', color: 'success' }
    };

    const smartDevices = [
        { category: 'Lighting', count: 12, brand: 'Philips Hue', status: 'connected' },
        { category: 'Climate', count: 3, brand: 'Nest', status: 'connected' },
        { category: 'Security', count: 8, brand: 'Ring', status: 'connected' },
        { category: 'Entertainment', count: 4, brand: 'Sonos', status: 'connected' },
        { category: 'Appliances', count: 5, brand: 'Samsung', status: 'connected' }
    ];

    const automations = [
        { name: 'Morning Routine', devices: 8, active: true, trigger: '6:30 AM' },
        { name: 'Away Mode', devices: 15, active: true, trigger: 'Location' },
        { name: 'Night Mode', devices: 12, active: true, trigger: '10:00 PM' },
        { name: 'Guest Mode', devices: 6, active: false, trigger: 'Manual' }
    ];

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <SensorsIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h4" fontWeight={700}>IoT & Smart Home Dashboard</Typography>
                        <Typography color="text.secondary">Real-time environmental monitoring and smart device control</Typography>
                    </Box>
                    <Chip label="6 Sensors Active" color="success" sx={{ ml: 'auto' }} />
                </Box>

                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                    <Tab icon={<SensorsIcon />} label="Environmental Sensors" />
                    <Tab icon={<HomeIcon />} label="Smart Home" />
                    <Tab icon={<SecurityIcon />} label="Security" />
                </Tabs>

                {activeTab === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <AirIcon sx={{ fontSize: 40, color: 'success.main' }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>Air Quality</Typography>
                                        <Chip label={sensorData.airQuality.status} size="small" color="success" />
                                    </Box>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">AQI</Typography>
                                        <Typography variant="h4" fontWeight={700} color="success.main">{sensorData.airQuality.aqi}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">PM2.5</Typography>
                                        <Typography variant="h4" fontWeight={700}>{sensorData.airQuality.pm25} µg/m³</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">CO2</Typography>
                                        <Typography variant="h5">{sensorData.airQuality.co2} ppm</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Humidity</Typography>
                                        <Typography variant="h5">{sensorData.airQuality.humidity}%</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <WaterDropIcon sx={{ fontSize: 40, color: 'info.main' }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>Water Quality</Typography>
                                        <Chip label={sensorData.water.status} size="small" color="success" />
                                    </Box>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">TDS</Typography>
                                        <Typography variant="h5">{sensorData.water.tds} ppm</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">pH</Typography>
                                        <Typography variant="h5">{sensorData.water.ph}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">Chlorine</Typography>
                                        <Typography variant="h5">{sensorData.water.chlorine} ppm</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <VolumeUpIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>Noise Levels</Typography>
                                        <Chip label={sensorData.noise.status} size="small" color="success" />
                                    </Box>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">Current</Typography>
                                        <Typography variant="h5">{sensorData.noise.current} dB</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">Average</Typography>
                                        <Typography variant="h5">{sensorData.noise.average} dB</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">Peak</Typography>
                                        <Typography variant="h5">{sensorData.noise.peak} dB</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <ElectricBoltIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>EMF Radiation</Typography>
                                        <Chip label={sensorData.emf.status} size="small" color="success" />
                                    </Box>
                                </Box>
                                <Typography variant="h3" fontWeight={700} color="success.main">{sensorData.emf.level} mG</Typography>
                                <Typography color="text.secondary">Health Risk: {sensorData.emf.risk}</Typography>
                                <LinearProgress variant="determinate" value={15} sx={{ mt: 2, height: 8, borderRadius: 4 }} color="success" />
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Connected Devices</Typography>
                                <Grid container spacing={2}>
                                    {smartDevices.map(device => (
                                        <Grid item xs={12} sm={6} key={device.category}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={600}>{device.category}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{device.count} devices • {device.brand}</Typography>
                                                    </Box>
                                                    <Chip label={device.status} size="small" color="success" />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Smart Home Score</Typography>
                                <Typography variant="h2" fontWeight={700} color="primary.main">85</Typography>
                                <Chip label="A-" color="primary" sx={{ mt: 1 }} />
                                <Typography color="text.secondary" sx={{ mt: 2 }}>32 devices connected</Typography>
                                <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>$75/mo savings</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Automations</Typography>
                                <Grid container spacing={2}>
                                    {automations.map(auto => (
                                        <Grid item xs={12} sm={6} md={3} key={auto.name}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="subtitle1" fontWeight={600}>{auto.name}</Typography>
                                                        <Switch checked={auto.active} size="small" />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">{auto.devices} devices</Typography>
                                                    <Typography variant="caption" color="text.secondary">Trigger: {auto.trigger}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 2 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Security Status</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
                                    <SecurityIcon sx={{ fontSize: 60, color: 'success.main' }} />
                                    <Box>
                                        <Typography variant="h4" fontWeight={700} color="success.main">Armed</Typography>
                                        <Typography color="text.secondary">All sensors active</Typography>
                                    </Box>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><Typography>Cameras: 4</Typography></Grid>
                                    <Grid item xs={6}><Typography>Door Locks: 3</Typography></Grid>
                                    <Grid item xs={6}><Typography>Motion Sensors: 6</Typography></Grid>
                                    <Grid item xs={6}><Typography>Video Doorbells: 2</Typography></Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Recent Activity</Typography>
                                {[
                                    { time: '2 mins ago', event: 'Motion detected at front door', type: 'info' },
                                    { time: '1 hour ago', event: 'Front door unlocked', type: 'success' },
                                    { time: '3 hours ago', event: 'Garage door closed', type: 'success' }
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                                        <Chip label={item.time} size="small" variant="outlined" />
                                        <Typography variant="body2">{item.event}</Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
