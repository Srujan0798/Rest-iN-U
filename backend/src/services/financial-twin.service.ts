import { v4 as uuidv4 } from 'uuid';

/**
 * Financial Twin Simulation Service
 * 10-year financial modeling for property affordability
 */
class FinancialTwinService {

    async simulateFinancialFuture(userId: string, propertyPrice: number, userData: any): Promise<any> {
        const years = 10;
        const projections = this.calculateProjections(propertyPrice, userData, years);
        const alerts = this.detectFinancialRisks(projections);

        return {
            simulationId: uuidv4(),
            userId,
            propertyPrice,
            simulationYears: years,
            currentAffordability: projections[0].affordabilityScore,
            projections,
            riskAlerts: alerts,
            recommendation: alerts.length === 0 ? 'Property is sustainable long-term' : 'Review risk factors',
            generatedAt: new Date().toISOString()
        };
    }

    private calculateProjections(price: number, userData: any, years: number): any[] {
        const income = userData.annualIncome || 100000;
        const projections = [];

        for (let year = 0; year <= years; year++) {
            const projectedIncome = income * Math.pow(1.03, year); // 3% annual raise
            const mortgagePayment = this.calculateMortgage(price, 0.07, 30);
            const annualPayments = mortgagePayment * 12;
            const dti = (annualPayments / projectedIncome) * 100;

            projections.push({
                year: new Date().getFullYear() + year,
                projectedIncome: Math.round(projectedIncome),
                annualMortgage: Math.round(annualPayments),
                dtiRatio: Math.round(dti),
                affordabilityScore: dti < 28 ? 'excellent' : dti < 36 ? 'good' : dti < 43 ? 'moderate' : 'stressed',
                estimatedEquity: Math.round(price * 0.2 + (price * 0.02 * year))
            });
        }

        return projections;
    }

    private calculateMortgage(principal: number, rate: number, years: number): number {
        const monthlyRate = rate / 12;
        const payments = years * 12;
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    }

    private detectFinancialRisks(projections: any[]): any[] {
        const risks = [];

        for (const p of projections) {
            if (p.dtiRatio > 43) {
                risks.push({
                    year: p.year,
                    type: 'High DTI',
                    severity: 'warning',
                    message: `Debt-to-income ratio exceeds 43% in year ${p.year}`
                });
            }
        }

        return risks;
    }

    async compareScenarios(userId: string, scenarios: any[]): Promise<any> {
        return {
            userId,
            scenarios: scenarios.map(s => ({
                name: s.name,
                propertyPrice: s.price,
                monthlyPayment: Math.round(this.calculateMortgage(s.price, 0.07, 30)),
                affordability: 'good'
            })),
            recommendation: 'Scenario 1 offers best long-term value'
        };
    }
}

export const financialTwinService = new FinancialTwinService();
export default FinancialTwinService;

