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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TokenIcon from '@mui/icons-material/Token';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import PieChartIcon from '@mui/icons-material/PieChart';
import GavelIcon from '@mui/icons-material/Gavel';

export default function BlockchainPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');

    const connectWallet = () => {
        setWalletConnected(true);
        setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e75...');
    };

    const mockProperty = {
        tokenId: 847291,
        address: '123 Blockchain Ave, Web3 City',
        value: 500000,
        vastuScore: 85,
        owner: '0x742d35Cc6634C0532925a3b844Bc9e75...',
        registered: '2024-06-15',
        verified: true
    };

    const ownershipHistory = [
        { date: '2024-06-15', event: 'Property Registered', txHash: '0xabc...123' },
        { date: '2024-07-20', event: 'Vastu Certification Added', txHash: '0xdef...456' },
        { date: '2024-08-10', event: 'Climate Report Added', txHash: '0xghi...789' },
        { date: '2024-10-05', event: 'Renovation Recorded', txHash: '0xjkl...012' }
    ];

    const fractionalShares = {
        totalShares: 1000,
        availableShares: 650,
        pricePerShare: 500,
        minInvestment: 500,
        investors: 15
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <TokenIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>Blockchain & Web3</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Immutable property records, NFT ownership, fractional investing, and smart contract escrow
                    </Typography>
                </Box>

                {!walletConnected ? (
                    <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h5" fontWeight={600} gutterBottom>Connect Your Wallet</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Connect your Web3 wallet to access blockchain features
                        </Typography>
                        <Button variant="contained" size="large" onClick={connectWallet}>
                            Connect MetaMask
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
                            Supports MetaMask, Coinbase Wallet, WalletConnect
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        <Alert severity="success" sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography>Wallet Connected: {walletAddress}</Typography>
                                <Chip label="Polygon Network" size="small" color="primary" />
                            </Box>
                        </Alert>

                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                            <Tab icon={<VerifiedIcon />} label="Property Verification" />
                            <Tab icon={<HistoryIcon />} label="Provenance" />
                            <Tab icon={<PieChartIcon />} label="Fractional Ownership" />
                            <Tab icon={<GavelIcon />} label="Smart Escrow" />
                        </Tabs>

                        {activeTab === 0 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <VerifiedIcon sx={{ fontSize: 40, color: 'success.main' }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight={600}>Verified Property</Typography>
                                                <Chip label="On-Chain Verified" size="small" color="success" />
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">Token ID</Typography>
                                        <Typography variant="h5" fontWeight={600} gutterBottom>#{mockProperty.tokenId}</Typography>

                                        <Typography variant="body2" color="text.secondary">Property Address</Typography>
                                        <Typography gutterBottom>{mockProperty.address}</Typography>

                                        <Grid container spacing={2} sx={{ mt: 2 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Value</Typography>
                                                <Typography variant="h6">${mockProperty.value.toLocaleString()}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Vastu Score</Typography>
                                                <Typography variant="h6">{mockProperty.vastuScore}/100</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>Certifications</Typography>
                                        {[
                                            { name: 'Vastu Compliance', score: 85, date: '2024-07-20' },
                                            { name: 'Climate Assessment', score: 72, date: '2024-08-10' },
                                            { name: 'Title Verification', score: 100, date: '2024-06-15' }
                                        ].map(cert => (
                                            <Card variant="outlined" sx={{ mb: 2 }} key={cert.name}>
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                                                    <Box>
                                                        <Typography fontWeight={600}>{cert.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Issued: {cert.date}</Typography>
                                                    </Box>
                                                    <Chip label={`${cert.score}/100`} color="success" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                        <Button variant="outlined" fullWidth sx={{ mt: 2 }}>View on Polygon Explorer</Button>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === 1 && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Property Provenance</Typography>
                                <Typography color="text.secondary" sx={{ mb: 3 }}>
                                    Complete immutable history of this property on the blockchain
                                </Typography>
                                <Stepper orientation="vertical">
                                    {ownershipHistory.map((event, index) => (
                                        <Step key={index} active completed>
                                            <StepLabel>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography fontWeight={600}>{event.event}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{event.date}</Typography>
                                                    </Box>
                                                    <Chip label={event.txHash} size="small" variant="outlined" onClick={() => { }} clickable />
                                                </Box>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Paper>
                        )}

                        {activeTab === 2 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={5}>
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <PieChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                        <Typography variant="h5" fontWeight={600}>Fractional Ownership</Typography>
                                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                                            Invest in premium real estate with as little as ${fractionalShares.minInvestment}
                                        </Typography>

                                        <Box sx={{ my: 3 }}>
                                            <Typography variant="h3" fontWeight={700} color="primary.main">
                                                ${fractionalShares.pricePerShare}
                                            </Typography>
                                            <Typography color="text.secondary">per share</Typography>
                                        </Box>

                                        <Grid container spacing={2} sx={{ textAlign: 'left' }}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Total Shares</Typography>
                                                <Typography fontWeight={600}>{fractionalShares.totalShares}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Available</Typography>
                                                <Typography fontWeight={600}>{fractionalShares.availableShares}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Current Investors</Typography>
                                                <Typography fontWeight={600}>{fractionalShares.investors}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Est. Yield</Typography>
                                                <Typography fontWeight={600} color="success.main">8.5% APY</Typography>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 3 }} />

                                        <TextField fullWidth type="number" label="Number of Shares" defaultValue={1} sx={{ mb: 2 }} />
                                        <Button variant="contained" size="large" fullWidth>Buy Shares</Button>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={7}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>Benefits of Fractional Ownership</Typography>
                                        <Grid container spacing={2}>
                                            {[
                                                { title: 'Proportional Rental Income', desc: 'Earn monthly dividends from rental income' },
                                                { title: 'Voting Rights', desc: 'Vote on property decisions and improvements' },
                                                { title: 'Capital Appreciation', desc: 'Benefit from property value increases' },
                                                { title: 'Secondary Market', desc: 'Trade your shares on our marketplace' },
                                                { title: 'Low Entry Barrier', desc: 'Start investing with just $500' },
                                                { title: 'Professional Management', desc: 'Hands-off property management' }
                                            ].map(benefit => (
                                                <Grid item xs={12} sm={6} key={benefit.title}>
                                                    <Card variant="outlined">
                                                        <CardContent>
                                                            <Typography variant="subtitle1" fontWeight={600}>{benefit.title}</Typography>
                                                            <Typography variant="body2" color="text.secondary">{benefit.desc}</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === 3 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>Smart Contract Escrow</Typography>
                                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                                            Automated, trustless real estate transactions
                                        </Typography>

                                        <Stepper orientation="vertical" activeStep={2}>
                                            <Step completed><StepLabel>Buyer deposits funds to escrow contract</StepLabel></Step>
                                            <Step completed><StepLabel>Inspection conditions met</StepLabel></Step>
                                            <Step active><StepLabel>Awaiting title verification</StepLabel></Step>
                                            <Step><StepLabel>Automatic fund release on closing</StepLabel></Step>
                                        </Stepper>

                                        <Alert severity="info" sx={{ mt: 3 }}>
                                            Funds are held in a smart contract until all conditions are met automatically.
                                        </Alert>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>Accept Crypto Payments</Typography>
                                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                                            Pay for properties using cryptocurrency
                                        </Typography>

                                        <Grid container spacing={2}>
                                            {[
                                                { symbol: 'BTC', name: 'Bitcoin', rate: '$42,000' },
                                                { symbol: 'ETH', name: 'Ethereum', rate: '$2,200' },
                                                { symbol: 'USDC', name: 'USD Coin', rate: '$1.00' },
                                                { symbol: 'MATIC', name: 'Polygon', rate: '$0.85' }
                                            ].map(crypto => (
                                                <Grid item xs={6} key={crypto.symbol}>
                                                    <Card variant="outlined">
                                                        <CardContent sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" fontWeight={600}>{crypto.symbol}</Typography>
                                                            <Typography variant="body2" color="text.secondary">{crypto.name}</Typography>
                                                            <Typography variant="caption">{crypto.rate}</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Button variant="contained" fullWidth sx={{ mt: 3 }}>Initiate Crypto Payment</Button>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}
