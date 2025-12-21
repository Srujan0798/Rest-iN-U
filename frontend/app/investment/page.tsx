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
import Slider from '@mui/material/Slider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PieChartIcon from '@mui/icons-material/PieChart';

export default function InvestmentAnalysisPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(500000);
    const [downPayment, setDownPayment] = useState(100000);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);

    // Calculations
    const loanAmount = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    const estimatedRent = purchasePrice * 0.008;
    const operatingExpenses = estimatedRent * 0.30;
    const monthlyNOI = estimatedRent - operatingExpenses;
    const annualNOI = monthlyNOI * 12;
    const monthlyCashFlow = monthlyNOI - monthlyPayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const capRate = (annualNOI / purchasePrice) * 100;
    const cashOnCash = (annualCashFlow / downPayment) * 100;

    const getGrade = () => {
        if (capRate >= 7 && cashOnCash >= 10 && monthlyCashFlow >= 300) return { grade: 'A', color: 'success' };
        if (capRate >= 5 && cashOnCash >= 5 && monthlyCashFlow >= 0) return { grade: 'B', color: 'warning' };
        return { grade: 'C', color: 'error' };
    };

    const grade = getGrade();

    const projections = Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        const appreciation = Math.pow(1.03, year);
        const value = Math.round(purchasePrice * appreciation);
        const equity = Math.round(downPayment + (loanAmount / 30 * year) + (value - purchasePrice));
        return { year, value, equity, cashFlow: Math.round(annualCashFlow * year) };
    });

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <TrendingUpIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>Investment Analysis</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Professional-grade real estate investment analysis with cap rate, cash-on-cash return, and ROI projections
                    </Typography>
                </Box>

                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                    <Tab icon={<CalculateIcon />} label="Calculator" />
                    <Tab icon={<PieChartIcon />} label="10-Year Projections" />
                    <Tab icon={<AccountBalanceIcon />} label="Loan Scenarios" />
                </Tabs>

                {activeTab === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Property Details</Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Typography gutterBottom>Purchase Price: ${purchasePrice.toLocaleString()}</Typography>
                                    <Slider
                                        value={purchasePrice}
                                        onChange={(e, v) => setPurchasePrice(v as number)}
                                        min={100000}
                                        max={2000000}
                                        step={10000}
                                    />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography gutterBottom>Down Payment: ${downPayment.toLocaleString()} ({((downPayment / purchasePrice) * 100).toFixed(0)}%)</Typography>
                                    <Slider
                                        value={downPayment}
                                        onChange={(e, v) => setDownPayment(v as number)}
                                        min={purchasePrice * 0.03}
                                        max={purchasePrice * 0.5}
                                        step={5000}
                                    />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography gutterBottom>Interest Rate: {interestRate}%</Typography>
                                    <Slider
                                        value={interestRate}
                                        onChange={(e, v) => setInterestRate(v as number)}
                                        min={3}
                                        max={10}
                                        step={0.125}
                                    />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography gutterBottom>Loan Term: {loanTerm} years</Typography>
                                    <Slider
                                        value={loanTerm}
                                        onChange={(e, v) => setLoanTerm(v as number)}
                                        min={10}
                                        max={30}
                                        step={5}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: `${grade.color}.50` }}>
                                        <Typography variant="h6">Investment Grade</Typography>
                                        <Typography variant="h2" fontWeight={700} color={`${grade.color}.dark`}>{grade.grade}</Typography>
                                        <Chip label={monthlyCashFlow >= 0 ? 'Cash Flow Positive' : 'Cash Flow Negative'} color={grade.color as any} />
                                    </Paper>
                                </Grid>

                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">Cap Rate</Typography>
                                        <Typography variant="h5" fontWeight={700} color={capRate >= 6 ? 'success.main' : 'warning.main'}>
                                            {capRate.toFixed(1)}%
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">Cash on Cash</Typography>
                                        <Typography variant="h5" fontWeight={700} color={cashOnCash >= 8 ? 'success.main' : 'warning.main'}>
                                            {cashOnCash.toFixed(1)}%
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">Monthly Cash Flow</Typography>
                                        <Typography variant="h5" fontWeight={700} color={monthlyCashFlow >= 0 ? 'success.main' : 'error.main'}>
                                            ${Math.round(monthlyCashFlow).toLocaleString()}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">Monthly Payment</Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            ${Math.round(monthlyPayment).toLocaleString()}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Income & Expenses</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography color="text.secondary">Est. Monthly Rent</Typography>
                                                <Typography variant="h6">${Math.round(estimatedRent).toLocaleString()}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography color="text.secondary">Operating Expenses</Typography>
                                                <Typography variant="h6">${Math.round(operatingExpenses).toLocaleString()}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography color="text.secondary">Monthly NOI</Typography>
                                                <Typography variant="h6">${Math.round(monthlyNOI).toLocaleString()}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography color="text.secondary">Annual NOI</Typography>
                                                <Typography variant="h6">${Math.round(annualNOI).toLocaleString()}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 1 && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>10-Year Investment Projection</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Based on 3% annual appreciation and current cash flow
                        </Typography>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Year</TableCell>
                                        <TableCell>Property Value</TableCell>
                                        <TableCell>Total Equity</TableCell>
                                        <TableCell>Accumulated Cash Flow</TableCell>
                                        <TableCell>Total Return</TableCell>
                                        <TableCell>ROI</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projections.map(row => (
                                        <TableRow key={row.year}>
                                            <TableCell><strong>Year {row.year}</strong></TableCell>
                                            <TableCell>${row.value.toLocaleString()}</TableCell>
                                            <TableCell>${row.equity.toLocaleString()}</TableCell>
                                            <TableCell>${row.cashFlow.toLocaleString()}</TableCell>
                                            <TableCell><strong>${(row.equity - downPayment + row.cashFlow).toLocaleString()}</strong></TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${((row.equity - downPayment + row.cashFlow) / downPayment * 100).toFixed(0)}%`}
                                                    color="success"
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Alert severity="success" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                <strong>10-Year Summary:</strong> Starting with ${downPayment.toLocaleString()} down payment,
                                you could build ${projections[9]?.equity.toLocaleString()} in equity plus
                                ${projections[9]?.cashFlow.toLocaleString()} in accumulated cash flow.
                            </Typography>
                        </Alert>
                    </Paper>
                )}

                {activeTab === 2 && (
                    <Grid container spacing={3}>
                        {[
                            { name: 'Conservative (25% Down)', down: 0.25, rate: 7.0, term: 30 },
                            { name: 'Standard (20% Down)', down: 0.20, rate: 6.5, term: 30 },
                            { name: 'Aggressive (10% Down)', down: 0.10, rate: 6.5, term: 30 },
                            { name: 'FHA (3.5% Down)', down: 0.035, rate: 6.25, term: 30 },
                            { name: '15-Year Fixed', down: 0.20, rate: 5.75, term: 15 }
                        ].map(scenario => {
                            const sDown = purchasePrice * scenario.down;
                            const sLoan = purchasePrice - sDown;
                            const sRate = scenario.rate / 100 / 12;
                            const sPayments = scenario.term * 12;
                            const sPayment = sLoan * (sRate * Math.pow(1 + sRate, sPayments)) /
                                (Math.pow(1 + sRate, sPayments) - 1);
                            const sInterest = (sPayment * sPayments) - sLoan;
                            const sCashFlow = estimatedRent - operatingExpenses - sPayment;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={scenario.name}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>{scenario.name}</Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}><Typography color="text.secondary">Down Payment</Typography></Grid>
                                                <Grid item xs={6}><Typography>${Math.round(sDown).toLocaleString()}</Typography></Grid>
                                                <Grid item xs={6}><Typography color="text.secondary">Loan Amount</Typography></Grid>
                                                <Grid item xs={6}><Typography>${Math.round(sLoan).toLocaleString()}</Typography></Grid>
                                                <Grid item xs={6}><Typography color="text.secondary">Rate / Term</Typography></Grid>
                                                <Grid item xs={6}><Typography>{scenario.rate}% / {scenario.term}yr</Typography></Grid>
                                                <Grid item xs={6}><Typography color="text.secondary">Monthly Payment</Typography></Grid>
                                                <Grid item xs={6}><Typography fontWeight={600}>${Math.round(sPayment).toLocaleString()}</Typography></Grid>
                                                <Grid item xs={6}><Typography color="text.secondary">Total Interest</Typography></Grid>
                                                <Grid item xs={6}><Typography>${Math.round(sInterest).toLocaleString()}</Typography></Grid>
                                                <Grid item xs={6}><Typography color="text.secondary">Cash Flow</Typography></Grid>
                                                <Grid item xs={6}>
                                                    <Chip
                                                        label={`$${Math.round(sCashFlow).toLocaleString()}`}
                                                        color={sCashFlow >= 0 ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
