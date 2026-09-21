# Multiple Testing & False Discovery Rate (FDR)
> **Discipline**: STATS  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
At alpha = 0.05, you have a 5% chance of a false positive per test. If you test 20 different product metrics, the probability of at least one false positive is 1 - (1 - 0.05)^20 ≈ 64%! Solutions: Bonferroni correction (alpha / M, very conservative) or Benjamini-Hochberg (controls False Discovery Rate FDR).

---

## The Interview Trap & Senior Insight
When an A/B test loses on the primary metric, junior PMs slice the data by 40 segments (age, country, device, browser) until they find one significant p < 0.05 result. This is p-hacking. Any post-hoc multi-segment discovery must be corrected with Benjamini-Hochberg or validated in a new follow-up experiment.

---

## Technical Implementation
```python
from statsmodels.stats.multitest import multipletests

raw_p_values = [0.004, 0.03, 0.048, 0.052, 0.12, 0.35, 0.89]

# Benjamini-Hochberg (FDR) correction:
reject, corrected_p, _, _ = multipletests(raw_p_values, alpha=0.05, method='fdr_bh')

print("Significant after FDR correction:", reject)
print("Adjusted p-values:", [round(p, 4) for p in corrected_p])
```

## Interview Drill Check (8 Questions)

### Question 1: If you test 10 independent hypotheses at alpha = 0.05 using Bonferroni correction, what is the new adjusted significance threshold per test?
- **Correct Answer**: `0.005`
- **Key Takeaway**: Bonferroni divides the family-wise alpha by the number of hypotheses tested: 0.05 / 10 = 0.005.

### Question 2: What critical interview trap should candidates watch out for when discussing "Multiple Testing & False Discovery Rate (FDR)"?
- **Correct Answer**: `When an A/B test loses on the primary metric, junior PMs slice the data by 40 segments (age, country...`
- **Key Takeaway**: Senior insight: When an A/B test loses on the primary metric, junior PMs slice the data by 40 segments (age, country, device, browser) until they find one significant p < 0.05 ... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "Multiple Testing & False Discovery Rate (FDR)" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "Multiple Testing & False Discovery Rate (FDR)", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "Multiple Testing & False Discovery Rate (FDR)"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "Multiple Testing & False Discovery Rate (FDR)", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing (Benjamini & Hochberg, 1995), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "Multiple Testing & False Discovery Rate (FDR)", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing (Benjamini & Hochberg, 1995)](https://www.jstor.org/stable/2346101)
- **Authority**: `JSTOR / Royal Statistical Society`

---
*Generated with DS Roulette | Practice daily to build mastery.*
