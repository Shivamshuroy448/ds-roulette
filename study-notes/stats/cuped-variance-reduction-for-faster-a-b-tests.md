# CUPED: Variance Reduction for Faster A/B Tests
> **Discipline**: STATS  
> **Difficulty**: Advanced | **Estimated Time**: 4 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
In an A/B test on revenue, much of the variance comes from pre-existing user differences (e.g. whales who spend $1,000/mo vs casual users). CUPED (Controlled-experiment Using Pre-Experiment Data) uses a user's pre-experiment metric (X) as a control covariate to remove predictable baseline noise from the post-experiment outcome (Y): Y_cuped = Y - theta * (X - E[X]), where theta = Cov(Y, X) / Var(X).

---

## The Interview Trap & Senior Insight
Interviewers will ask: 'How can you detect a 1% lift when your metric is high-variance and you don't have 6 months to wait for sample size?' Mentioning CUPED demonstrates top-tier tech experimentation maturity. It preserves the un-biasedness of the treatment effect while dramatically shrinking standard errors.

---

## Technical Implementation
```python
import numpy as np

def apply_cuped(y_treatment, y_control, x_treatment, x_control):
    # X: pre-experiment metric (e.g. previous 2 weeks spend)
    # Y: post-experiment metric during the test
    x_all = np.concatenate([x_treatment, x_control])
    y_all = np.concatenate([y_treatment, y_control])
    
    # Calculate optimal theta: Cov(Y, X) / Var(X)
    cov_matrix = np.cov(y_all, x_all)
    theta = cov_matrix[0, 1] / cov_matrix[1, 1]
    x_mean = np.mean(x_all)
    
    # Variance-reduced metrics:
    y_treatment_cuped = y_treatment - theta * (x_treatment - x_mean)
    y_control_cuped = y_control - theta * (x_control - x_mean)
    
    var_reduction = 1 - (np.var(y_treatment_cuped) / np.var(y_treatment))
    print(f"Variance reduced by: {var_reduction:.1%}")
    return y_treatment_cuped, y_control_cuped
```

## Interview Drill Check (8 Questions)

### Question 1: By how much does CUPED reduce the variance of the primary metric Y when the correlation with pre-experiment covariate X is r = 0.6?
- **Correct Answer**: `36% (1 - r^2 = 1 - 0.36 = 64% remaining variance, a 36% reduction)`
- **Key Takeaway**: The theoretical variance reduction of CUPED is exactly equal to the squared correlation coefficient: Var(Y_cuped) = Var(Y) * (1 - r^2). When r = 0.6, variance drops by 36%.

### Question 2: What critical interview trap should candidates watch out for when discussing "CUPED: Variance Reduction for Faster A/B Tests"?
- **Correct Answer**: `Interviewers will ask: 'How can you detect a 1% lift when your metric is high-variance and you don't...`
- **Key Takeaway**: Senior insight: Interviewers will ask: 'How can you detect a 1% lift when your metric is high-variance and you don't have 6 months to wait for sample size?' Mentioning CUPED de... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "CUPED: Variance Reduction for Faster A/B Tests" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "CUPED: Variance Reduction for Faster A/B Tests", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "CUPED: Variance Reduction for Faster A/B Tests"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "CUPED: Variance Reduction for Faster A/B Tests", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data (Deng et al., WSDM 2013), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "CUPED: Variance Reduction for Faster A/B Tests", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data (Deng et al., WSDM 2013)](https://exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf)
- **Authority**: `Microsoft Research / WSDM`

---
*Generated with DS Roulette | Practice daily to build mastery.*
