# Simpson's Paradox in Data
> **Discipline**: STATS  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
A trend appears in different groups of data but disappears or reverses when the groups are combined. This happens when a hidden confounding variable influences both the group allocation and the outcome.

---

## The Interview Trap & Senior Insight
Classic interview case: Treatment looks superior overall, but within every individual age group, Control won. Always segment data before drawing executive conclusions.

---

## Technical Implementation
```python
import pandas as pd

# Group A: Young users (High inherent conversion, mostly in Variant 1)
# Group B: Senior users (Low inherent conversion, mostly in Variant 2)
# Confounding distribution leads aggregate totals to lie!

# Always group by confounding dimension:
segmented = df.groupby(['user_segment', 'variant'])['converted'].mean()
print(segmented)
```

## Interview Drill Check (8 Questions)

### Question 1: What is the primary cause of Simpson's Paradox?
- **Correct Answer**: `An unobserved confounding variable with unequal distribution across cohorts`
- **Key Takeaway**: A confounding factor correlated with both group assignment and outcome can reverse aggregate statistical relationships.

### Question 2: What critical interview trap should candidates watch out for when discussing "Simpson's Paradox in Data"?
- **Correct Answer**: `Classic interview case: Treatment looks superior overall, but within every individual age group, Con...`
- **Key Takeaway**: Senior insight: Classic interview case: Treatment looks superior overall, but within every individual age group, Control won. Always segment data before drawing executive concl... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "Simpson's Paradox in Data" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "Simpson's Paradox in Data", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "Simpson's Paradox in Data"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "Simpson's Paradox in Data", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Understanding Simpson's Paradox and Confounders (Judea Pearl, 2014), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "Simpson's Paradox in Data", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Understanding Simpson's Paradox and Confounders (Judea Pearl, 2014)](https://ftp.cs.ucla.edu/pub/stat_ser/r414.pdf)
- **Authority**: `UCLA Cognitive Systems`

---
*Generated with DS Roulette | Practice daily to build mastery.*
