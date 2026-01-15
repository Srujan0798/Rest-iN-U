import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface LoanOption {
  type: string;
  interestRate: number;
  termYears: number;
  monthlyEMI: number;
  totalInterest: number;
  totalCost: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanAmount: number;
}

interface AffordabilityMetrics {
  debtToIncomeRatio: number;
  monthlyPaymentToIncomeRatio: number;
  totalCostToIncomeRatio: number;
  affordabilityScore: number;
  recommendedMaxPrice: number;
}

interface FinancialAnalysis {
  propertyPrice: number;
  loanOptions: LoanOption[];
  recommendedOption: LoanOption;
  affordability: AffordabilityMetrics;
  cashFlowAnalysis: CashFlowAnalysis;
  investmentMetrics: InvestmentMetrics;
  recommendations: string[];
}

interface CashFlowAnalysis {
  estimatedRentalIncome: number;
  monthlyExpenses: number;
  netMonthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
}

interface InvestmentMetrics {
  capRate: number;
  grossRentMultiplier: number;
  pricePerSquareFoot: number;
  breakEvenOccupancy: number;
  paybackPeriodYears: number;
}

export class FinanceArchitect extends BaseAgent {
  private defaultInterestRates = {
    conventional: 0.0699,
    fha: 0.0649,
    va: 0.0625,
    jumbo: 0.0749,
    arm5_1: 0.0599,
  };

  private assumedAnnualIncome = 150000; // Default assumption for calculations

  constructor(agentId?: string) {
    super(agentId || `finance-architect-${Date.now()}`, "finance-architect");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 650 + 325);

    const financialAnalysis = await this.conductFinancialAnalysis(property);
    const score = this.calculateFinancialScore(financialAnalysis);
    const confidence = this.calculateConfidence(financialAnalysis);
    const reasoning = this.generateReasoning(financialAnalysis);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence,
      reasoning,
      timestamp: new Date(),
    };
  }

  private async conductFinancialAnalysis(
    property: Property
  ): Promise<FinancialAnalysis> {
    const propertyPrice = property.price || 500000;

    const loanOptions = this.generateLoanOptions(propertyPrice);
    const recommendedOption = this.selectBestOption(loanOptions);
    const affordability = this.calculateAffordability(
      propertyPrice,
      recommendedOption
    );
    const cashFlowAnalysis = this.analyzeCashFlow(property, recommendedOption);
    const investmentMetrics = this.calculateInvestmentMetrics(
      property,
      cashFlowAnalysis
    );
    const recommendations = this.generateRecommendations(
      affordability,
      cashFlowAnalysis,
      investmentMetrics
    );

    return {
      propertyPrice,
      loanOptions,
      recommendedOption,
      affordability,
      cashFlowAnalysis,
      investmentMetrics,
      recommendations,
    };
  }

  private generateLoanOptions(propertyPrice: number): LoanOption[] {
    const options: LoanOption[] = [];

    // Conventional loan - 20% down
    options.push(
      this.calculateLoanOption(
        "Conventional (20% down)",
        propertyPrice,
        0.2,
        this.defaultInterestRates.conventional,
        30
      )
    );

    // Conventional loan - 10% down
    options.push(
      this.calculateLoanOption(
        "Conventional (10% down)",
        propertyPrice,
        0.1,
        this.defaultInterestRates.conventional + 0.0025, // Slightly higher rate
        30
      )
    );

    // FHA loan - 3.5% down
    if (propertyPrice <= 970800) {
      // FHA loan limit
      options.push(
        this.calculateLoanOption(
          "FHA (3.5% down)",
          propertyPrice,
          0.035,
          this.defaultInterestRates.fha,
          30
        )
      );
    }

    // VA loan - 0% down (eligible veterans)
    options.push(
      this.calculateLoanOption(
        "VA (0% down - if eligible)",
        propertyPrice,
        0,
        this.defaultInterestRates.va,
        30
      )
    );

    // 15-year conventional
    options.push(
      this.calculateLoanOption(
        "Conventional 15-year",
        propertyPrice,
        0.2,
        this.defaultInterestRates.conventional - 0.005, // Lower rate for shorter term
        15
      )
    );

    // 5/1 ARM
    options.push(
      this.calculateLoanOption(
        "5/1 ARM",
        propertyPrice,
        0.2,
        this.defaultInterestRates.arm5_1,
        30
      )
    );

    // Jumbo loan if needed
    if (propertyPrice > 726200) {
      options.push(
        this.calculateLoanOption(
          "Jumbo Loan",
          propertyPrice,
          0.2,
          this.defaultInterestRates.jumbo,
          30
        )
      );
    }

    return options;
  }

  private calculateLoanOption(
    type: string,
    propertyPrice: number,
    downPaymentPercent: number,
    interestRate: number,
    termYears: number
  ): LoanOption {
    const downPaymentAmount = propertyPrice * downPaymentPercent;
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyRate = interestRate / 12;
    const numPayments = termYears * 12;

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyEMI =
      loanAmount > 0
        ? (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : 0;

    const totalCost = monthlyEMI * numPayments + downPaymentAmount;
    const totalInterest = totalCost - propertyPrice;

    return {
      type,
      interestRate,
      termYears,
      monthlyEMI: Math.round(monthlyEMI),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      downPaymentPercent,
      downPaymentAmount: Math.round(downPaymentAmount),
      loanAmount: Math.round(loanAmount),
    };
  }

  private selectBestOption(options: LoanOption[]): LoanOption {
    // Score each option based on various factors
    const scoredOptions = options.map((option) => {
      let score = 0;

      // Lower monthly payment is better (weight: 30%)
      const avgMonthly =
        options.reduce((sum, o) => sum + o.monthlyEMI, 0) / options.length;
      score += (1 - option.monthlyEMI / avgMonthly) * 30;

      // Lower total interest is better (weight: 25%)
      const avgInterest =
        options.reduce((sum, o) => sum + o.totalInterest, 0) / options.length;
      score += (1 - option.totalInterest / avgInterest) * 25;

      // Lower down payment requirement can be beneficial (weight: 20%)
      score += (1 - option.downPaymentPercent) * 20;

      // Fixed rate preference (weight: 15%)
      if (!option.type.includes("ARM")) {
        score += 15;
      }

      // 30-year term provides flexibility (weight: 10%)
      if (option.termYears === 30) {
        score += 10;
      }

      return { option, score };
    });

    // Return the option with the highest score
    scoredOptions.sort((a, b) => b.score - a.score);
    return scoredOptions[0].option;
  }

  private calculateAffordability(
    propertyPrice: number,
    selectedLoan: LoanOption
  ): AffordabilityMetrics {
    const monthlyIncome = this.assumedAnnualIncome / 12;

    // Debt-to-income ratio (mortgage payment / monthly income)
    const debtToIncomeRatio = selectedLoan.monthlyEMI / monthlyIncome;

    // Monthly payment to income ratio
    const monthlyPaymentToIncomeRatio = debtToIncomeRatio;

    // Total cost to annual income ratio
    const totalCostToIncomeRatio = selectedLoan.totalCost / this.assumedAnnualIncome;

    // Affordability score (0-10 scale)
    let affordabilityScore = 10;

    // DTI > 28% is considered stressed
    if (debtToIncomeRatio > 0.28) {
      affordabilityScore -= (debtToIncomeRatio - 0.28) * 50;
    }

    // DTI > 36% is concerning
    if (debtToIncomeRatio > 0.36) {
      affordabilityScore -= (debtToIncomeRatio - 0.36) * 30;
    }

    // Calculate recommended max price based on 28% DTI rule
    const maxMonthlyPayment = monthlyIncome * 0.28;
    const monthlyRate = selectedLoan.interestRate / 12;
    const numPayments = 30 * 12;

    const maxLoanAmount =
      (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    const recommendedMaxPrice = maxLoanAmount / (1 - selectedLoan.downPaymentPercent);

    return {
      debtToIncomeRatio: Math.round(debtToIncomeRatio * 1000) / 10,
      monthlyPaymentToIncomeRatio:
        Math.round(monthlyPaymentToIncomeRatio * 1000) / 10,
      totalCostToIncomeRatio: Math.round(totalCostToIncomeRatio * 100) / 100,
      affordabilityScore: Math.max(1, Math.min(10, affordabilityScore)),
      recommendedMaxPrice: Math.round(recommendedMaxPrice),
    };
  }

  private analyzeCashFlow(
    property: Property,
    selectedLoan: LoanOption
  ): CashFlowAnalysis {
    const propertyPrice = property.price || 500000;

    // Estimate rental income (typically 0.8-1.2% of property value monthly)
    const rentMultiplier = this.getRentMultiplier(property);
    const estimatedRentalIncome = Math.round(propertyPrice * rentMultiplier);

    // Monthly expenses beyond mortgage
    const propertyTax = Math.round((propertyPrice * 0.012) / 12); // ~1.2% annual
    const insurance = Math.round((propertyPrice * 0.004) / 12); // ~0.4% annual
    const maintenance = Math.round(estimatedRentalIncome * 0.1); // 10% of rent
    const vacancyAllowance = Math.round(estimatedRentalIncome * 0.05); // 5% vacancy
    const hoa = property.propertyType?.includes("condo") ? 350 : 0;

    const monthlyExpenses =
      selectedLoan.monthlyEMI +
      propertyTax +
      insurance +
      maintenance +
      vacancyAllowance +
      hoa;

    const netMonthlyCashFlow = estimatedRentalIncome - monthlyExpenses;
    const annualCashFlow = netMonthlyCashFlow * 12;

    // Cash-on-cash return = Annual cash flow / Total cash invested
    const totalCashInvested =
      selectedLoan.downPaymentAmount + propertyPrice * 0.03; // Down + closing costs
    const cashOnCashReturn =
      totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

    return {
      estimatedRentalIncome,
      monthlyExpenses,
      netMonthlyCashFlow,
      annualCashFlow,
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
    };
  }

  private getRentMultiplier(property: Property): number {
    // Base rent multiplier
    let multiplier = 0.008;

    // Adjust based on property characteristics
    if (property.bedrooms && property.bedrooms >= 3) {
      multiplier += 0.001;
    }

    if (property.propertyType === "single-family") {
      multiplier += 0.001;
    } else if (property.propertyType === "condo") {
      multiplier -= 0.001;
    }

    // Newer properties can command higher rents
    if (property.yearBuilt && property.yearBuilt >= 2010) {
      multiplier += 0.001;
    }

    return multiplier;
  }

  private calculateInvestmentMetrics(
    property: Property,
    cashFlow: CashFlowAnalysis
  ): InvestmentMetrics {
    const propertyPrice = property.price || 500000;
    const annualRent = cashFlow.estimatedRentalIncome * 12;

    // Cap Rate = Net Operating Income / Property Price
    const noi = annualRent - cashFlow.monthlyExpenses * 12 + cashFlow.netMonthlyCashFlow * 12;
    const capRate = (noi / propertyPrice) * 100;

    // Gross Rent Multiplier = Property Price / Annual Rent
    const grossRentMultiplier = propertyPrice / annualRent;

    // Price per square foot
    const pricePerSquareFoot = property.squareFootage
      ? propertyPrice / property.squareFootage
      : 0;

    // Break-even occupancy
    const annualExpenses = cashFlow.monthlyExpenses * 12;
    const breakEvenOccupancy = (annualExpenses / annualRent) * 100;

    // Payback period (simplified)
    const annualCashFlow = cashFlow.annualCashFlow;
    const downPayment =
      propertyPrice * 0.2 + propertyPrice * 0.03; // 20% down + closing
    const paybackPeriodYears =
      annualCashFlow > 0 ? downPayment / annualCashFlow : 999;

    return {
      capRate: Math.round(capRate * 100) / 100,
      grossRentMultiplier: Math.round(grossRentMultiplier * 100) / 100,
      pricePerSquareFoot: Math.round(pricePerSquareFoot),
      breakEvenOccupancy: Math.round(breakEvenOccupancy * 100) / 100,
      paybackPeriodYears: Math.round(paybackPeriodYears * 10) / 10,
    };
  }

  private calculateFinancialScore(analysis: FinancialAnalysis): number {
    let score = 5; // Base score

    // Affordability factor (weight: 40%)
    score += (analysis.affordability.affordabilityScore - 5) * 0.4;

    // Cash flow factor (weight: 30%)
    if (analysis.cashFlowAnalysis.netMonthlyCashFlow > 0) {
      score += Math.min(2, analysis.cashFlowAnalysis.netMonthlyCashFlow / 500);
    } else {
      score += Math.max(-2, analysis.cashFlowAnalysis.netMonthlyCashFlow / 500);
    }

    // Investment metrics factor (weight: 30%)
    // Good cap rate is typically 5-10%
    if (analysis.investmentMetrics.capRate >= 5) {
      score += 1;
    } else if (analysis.investmentMetrics.capRate < 3) {
      score -= 1;
    }

    // Good GRM is typically 15 or less
    if (analysis.investmentMetrics.grossRentMultiplier <= 15) {
      score += 1;
    } else if (analysis.investmentMetrics.grossRentMultiplier > 20) {
      score -= 1;
    }

    return Math.max(1, Math.min(10, score));
  }

  private calculateConfidence(analysis: FinancialAnalysis): number {
    let confidence = 7; // Base confidence

    // More loan options analyzed = higher confidence
    confidence += Math.min(1.5, analysis.loanOptions.length * 0.2);

    // Has all metrics calculated
    if (
      analysis.investmentMetrics.capRate > 0 &&
      analysis.investmentMetrics.pricePerSquareFoot > 0
    ) {
      confidence += 1;
    }

    // Reasonable values indicate better data quality
    if (
      analysis.affordability.debtToIncomeRatio > 0 &&
      analysis.affordability.debtToIncomeRatio < 100
    ) {
      confidence += 0.5;
    }

    return Math.min(10, confidence);
  }

  private generateRecommendations(
    affordability: AffordabilityMetrics,
    cashFlow: CashFlowAnalysis,
    metrics: InvestmentMetrics
  ): string[] {
    const recommendations: string[] = [];

    // Affordability recommendations
    if (affordability.debtToIncomeRatio > 36) {
      recommendations.push(
        "WARNING: DTI ratio exceeds recommended 36% threshold; consider lower-priced properties"
      );
    } else if (affordability.debtToIncomeRatio > 28) {
      recommendations.push(
        "DTI ratio above ideal 28%; ensure emergency reserves are adequate"
      );
    } else {
      recommendations.push(
        "Affordability looks good; consider maximizing down payment to reduce monthly costs"
      );
    }

    // Cash flow recommendations
    if (cashFlow.netMonthlyCashFlow > 500) {
      recommendations.push(
        "Strong positive cash flow; excellent investment potential"
      );
    } else if (cashFlow.netMonthlyCashFlow > 0) {
      recommendations.push(
        "Positive cash flow expected; build reserves for unexpected expenses"
      );
    } else {
      recommendations.push(
        "Negative cash flow expected; suitable only for appreciation play or primary residence"
      );
    }

    // Investment metric recommendations
    if (metrics.capRate >= 7) {
      recommendations.push("Cap rate indicates strong investment fundamentals");
    } else if (metrics.capRate < 4) {
      recommendations.push(
        "Low cap rate; investment returns depend heavily on appreciation"
      );
    }

    if (metrics.grossRentMultiplier > 20) {
      recommendations.push(
        "High GRM suggests property may be overpriced relative to rental income"
      );
    }

    if (metrics.paybackPeriodYears > 15) {
      recommendations.push(
        "Long payback period; consider this a long-term hold investment"
      );
    }

    // General recommendations
    recommendations.push("Compare multiple lenders to find the best rates");
    recommendations.push(
      "Budget for 1-2% of property value annually for maintenance"
    );

    return recommendations;
  }

  private generateReasoning(analysis: FinancialAnalysis): string {
    let reasoning = `Property: $${analysis.propertyPrice.toLocaleString()}. `;
    reasoning += `Recommended: ${analysis.recommendedOption.type} at ${(analysis.recommendedOption.interestRate * 100).toFixed(2)}%. `;
    reasoning += `Monthly EMI: $${analysis.recommendedOption.monthlyEMI.toLocaleString()}. `;
    reasoning += `Down payment: $${analysis.recommendedOption.downPaymentAmount.toLocaleString()} (${(analysis.recommendedOption.downPaymentPercent * 100).toFixed(0)}%). `;
    reasoning += `DTI: ${analysis.affordability.debtToIncomeRatio}%. `;

    if (analysis.cashFlowAnalysis.netMonthlyCashFlow > 0) {
      reasoning += `Cash flow: +$${analysis.cashFlowAnalysis.netMonthlyCashFlow}/mo. `;
    } else {
      reasoning += `Cash flow: -$${Math.abs(analysis.cashFlowAnalysis.netMonthlyCashFlow)}/mo. `;
    }

    reasoning += `Cap rate: ${analysis.investmentMetrics.capRate}%.`;

    return reasoning;
  }

  getFinancialAnalysis(property: Property): Promise<FinancialAnalysis> {
    return this.conductFinancialAnalysis(property);
  }

  calculateEMI(
    principal: number,
    annualRate: number,
    termYears: number
  ): number {
    const monthlyRate = annualRate / 12;
    const numPayments = termYears * 12;

    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  }

  calculateTotalInterest(
    principal: number,
    annualRate: number,
    termYears: number
  ): number {
    const monthlyEMI = this.calculateEMI(principal, annualRate, termYears);
    const totalPaid = monthlyEMI * termYears * 12;
    return totalPaid - principal;
  }
}
