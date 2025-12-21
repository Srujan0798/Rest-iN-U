'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

interface MortgageCalculatorProps {
    price: number;
}

export default function MortgageCalculator({ price }: MortgageCalculatorProps) {
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(6.99);
    const [loanTerm, setLoanTerm] = useState(30);

    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const monthlyTax = (price * 0.012) / 12;
    const monthlyInsurance = 100;
    const total = monthlyPI + monthlyTax + monthlyInsurance;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Mortgage Calculator</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography gutterBottom>Down Payment: {downPaymentPercent}% (${downPayment.toLocaleString()})</Typography>
                    <Slider
                        value={downPaymentPercent}
                        onChange={(e, v) => setDownPaymentPercent(v as number)}
                        min={5}
                        max={50}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `${v}%`}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Interest Rate (%)"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        fullWidth
                        size="small"
                        inputProps={{ step: 0.01 }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Loan Term</InputLabel>
                        <Select value={loanTerm} label="Loan Term" onChange={(e) => setLoanTerm(e.target.value as number)}>
                            <MenuItem value={15}>15 years</MenuItem>
                            <MenuItem value={20}>20 years</MenuItem>
                            <MenuItem value={30}>30 years</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 2, textAlign: 'center', mb: 2 }}>
                <Typography variant="body2">Estimated Monthly Payment</Typography>
                <Typography variant="h4" fontWeight={700}>${Math.round(total).toLocaleString()}/mo</Typography>
            </Box>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Principal & Interest</Typography>
                    <Typography variant="body2">${Math.round(monthlyPI).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Property Tax</Typography>
                    <Typography variant="body2">${Math.round(monthlyTax).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Home Insurance</Typography>
                    <Typography variant="body2">${monthlyInsurance}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Loan Amount</Typography>
                    <Typography variant="body2">${loanAmount.toLocaleString()}</Typography>
                </Box>
            </Box>
        </Paper>
    );
}
