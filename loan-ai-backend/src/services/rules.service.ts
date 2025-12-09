import { RiskLevel } from '@prisma/client';
import { LOAN_RULES, RISK_THRESHOLDS } from '../config/prompts.js';
import type {
    ExtractedDataMap,
    RuleEngineResult,
    RuleFinding,
    RuleStatus,
    RuleSeverity,
} from '../types/index.js';

export function evaluateRules(extractedData: ExtractedDataMap): RuleEngineResult {
    const findings: RuleFinding[] = [];
    let riskScore = 0;

    // Calculate financial metrics
    const avgNetIncome = extractedData.bankStatement?.summary.avgNetMonthlyIncome || 0;
    const avgMonthlyEmi = extractedData.bankStatement?.summary.avgMonthlyEmi || 0;
    const foir = avgNetIncome > 0 ? avgMonthlyEmi / avgNetIncome : 0;
    const bounceCount = extractedData.bankStatement?.bounces.length || 0;
    const salarySlipCount = extractedData.salarySlips.length;

    // Rule 1: FOIR Check (CRITICAL)
    if (avgNetIncome > 0) {
        const foirStatus: RuleStatus = foir <= LOAN_RULES.MAX_FOIR ? 'PASS' : 'FAIL';
        findings.push({
            rule: 'FOIR_CHECK',
            status: foirStatus,
            severity: 'CRITICAL',
            message: `FOIR is ${(foir * 100).toFixed(1)}% (Max allowed: ${LOAN_RULES.MAX_FOIR * 100}%). ${foirStatus === 'FAIL' ? 'EMI burden too high!' : 'Within acceptable limits.'}`,
            value: foir,
        });

        if (foirStatus === 'FAIL') {
            riskScore += 40;
        } else if (foir > 0.4) {
            riskScore += 20;
        } else {
            riskScore += 5;
        }
    } else {
        findings.push({
            rule: 'FOIR_CHECK',
            status: 'WARNING',
            severity: 'HIGH',
            message: 'Unable to calculate FOIR - bank statement data missing',
            value: null,
        });
        riskScore += 25;
    }

    // Rule 2: Minimum Salary Check (CRITICAL)
    const latestSalary = extractedData.salarySlips[0]?.netSalary || 0;
    const salaryStatus: RuleStatus = latestSalary >= LOAN_RULES.MIN_NET_SALARY ? 'PASS' : 'FAIL';
    findings.push({
        rule: 'MIN_SALARY_CHECK',
        status: salaryStatus,
        severity: 'CRITICAL',
        message: `Net salary is ₹${latestSalary.toLocaleString('en-IN')} (Min required: ₹${LOAN_RULES.MIN_NET_SALARY.toLocaleString('en-IN')})`,
        value: latestSalary,
    });

    if (salaryStatus === 'FAIL') {
        riskScore += 35;
    } else {
        riskScore += 0;
    }

    // Rule 3: Cheque Bounce Check (CRITICAL)
    const bounceStatus: RuleStatus = bounceCount <= LOAN_RULES.MAX_BOUNCES_ALLOWED ? 'PASS' : 'FAIL';
    findings.push({
        rule: 'BOUNCE_CHECK',
        status: bounceStatus,
        severity: 'CRITICAL',
        message: `${bounceCount} cheque bounce(s) detected in last 6 months (Max allowed: ${LOAN_RULES.MAX_BOUNCES_ALLOWED})`,
        value: bounceCount,
    });

    if (bounceStatus === 'FAIL') {
        riskScore += 30;
    }

    // Rule 4: Salary Stability Check (HIGH)
    const stabilityStatus: RuleStatus = salarySlipCount >= LOAN_RULES.MIN_SALARY_MONTHS ? 'PASS' : 'WARNING';
    findings.push({
        rule: 'SALARY_STABILITY',
        status: stabilityStatus,
        severity: 'HIGH',
        message: `${salarySlipCount} salary slip(s) provided (Recommended: ${LOAN_RULES.MIN_SALARY_MONTHS})`,
        value: salarySlipCount,
    });

    if (stabilityStatus === 'WARNING') {
        riskScore += 15;
    } else {
        // Check salary variance
        if (salarySlipCount >= 3) {
            const salaries = extractedData.salarySlips.map(s => s.netSalary);
            const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;
            const variance = salaries.some(s => Math.abs(s - avgSalary) / avgSalary > 0.2);

            if (variance) {
                findings.push({
                    rule: 'SALARY_VARIANCE',
                    status: 'WARNING',
                    severity: 'MEDIUM',
                    message: 'Significant salary variation detected (>20%)',
                    value: avgSalary,
                });
                riskScore += 10;
            }
        }
    }

    // Rule 5: Document Completeness (MEDIUM)
    const hasAllDocs = extractedData.pan && extractedData.aadhaar &&
        extractedData.bankStatement && extractedData.salarySlips.length > 0;
    findings.push({
        rule: 'DOCUMENT_COMPLETENESS',
        status: hasAllDocs ? 'PASS' : 'WARNING',
        severity: 'MEDIUM',
        message: hasAllDocs
            ? 'All essential documents provided'
            : 'Some documents missing (PAN, Aadhaar, Bank Statement, or Salary Slips)',
        value: null,
    });

    if (!hasAllDocs) {
        riskScore += 10;
    }

    // Determine risk level
    let riskLevel: RiskLevel;
    if (riskScore <= RISK_THRESHOLDS.LOW) {
        riskLevel = 'LOW';
    } else if (riskScore <= RISK_THRESHOLDS.MEDIUM) {
        riskLevel = 'MEDIUM';
    } else {
        riskLevel = 'HIGH';
    }

    return {
        riskScore,
        riskLevel,
        findings,
    };
}
