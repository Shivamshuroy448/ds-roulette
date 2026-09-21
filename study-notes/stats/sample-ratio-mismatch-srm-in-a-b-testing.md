# Sample Ratio Mismatch (SRM) in A/B Testing
> **Discipline**: STATS  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
If your A/B test is designed as a 50/50 split, and you observe 52,000 Control users and 48,000 Treatment users, a simple Chi-Square test reveals whether this deviation is random noise or a critical Sample Ratio Mismatch (SRM). SRM indicates that users in Treatment are crashing, bouncing, or being dropped by bad redirect logic.

---

## The Interview Trap & Senior Insight
Never look at lift or p-values on conversion rate before checking for SRM! If an SRM exists, the two groups are fundamentally non-comparable, and all downstream statistical conclusions are invalid.

---

## Technical Implementation
```python
from scipy.stats import chisquare

def check_srm(control_users, treatment_users, expected_ratio=[0.5, 0.5]):
    total = control_users + treatment_users
    observed = [control_users, treatment_users]
    expected = [total * expected_ratio[0], total * expected_ratio[1]]
    
    stat, p_val = chisquare(f_obs=observed, f_exp=expected)
    if p_val < 0.001:
        print(f"CRITICAL SRM DETECTED! (p={p_val:.2e}). Do NOT trust experiment results!")
    else:
        print(f"Allocation clean. (p={p_val:.4f})")

check_srm(control_users=52100, treatment_users=47900)
```

## Interview Drill Check (8 Questions)

### Question 1: What statistical test is standardly used to diagnose Sample Ratio Mismatch (SRM)?
- **Correct Answer**: `Pearson's Chi-Square Goodness-of-Fit Test`
- **Key Takeaway**: Chi-Square goodness-of-fit compares observed allocation counts against expected theoretical frequencies (e.g. 50/50 split).

### Question 2: What critical interview trap should candidates watch out for when discussing "Sample Ratio Mismatch (SRM) in A/B Testing"?
- **Correct Answer**: `Never look at lift or p-values on conversion rate before checking for SRM! If an SRM exists, the two...`
- **Key Takeaway**: Senior insight: Never look at lift or p-values on conversion rate before checking for SRM! If an SRM exists, the two groups are fundamentally non-comparable, and all downstream... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "Sample Ratio Mismatch (SRM) in A/B Testing" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "Sample Ratio Mismatch (SRM) in A/B Testing", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "Sample Ratio Mismatch (SRM) in A/B Testing"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "Sample Ratio Mismatch (SRM) in A/B Testing", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Diagnosing Sample Ratio Mismatch in Online Controlled Experiments (Fabijan et al., KDD 2019), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "Sample Ratio Mismatch (SRM) in A/B Testing", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Sample Ratio Mismatch (SRM) in Controlled Experiments & Chi-Square Diagnostics](https://en.wikipedia.org/wiki/Sample_ratio_mismatch)
- **Authority**: `Wikipedia / Booking.com Research`

---
*Generated with DS Roulette | Practice daily to build mastery.*
