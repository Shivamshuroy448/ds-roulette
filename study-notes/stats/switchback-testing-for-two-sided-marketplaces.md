# Switchback Testing for Two-Sided Marketplaces
> **Discipline**: STATS  
> **Difficulty**: Advanced | **Estimated Time**: 4 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
In a rideshare marketplace, if you give a 20% discount to Treatment riders in Manhattan, they consume all available drivers. Control riders now experience surge pricing and long ETAs. The two groups violate the Stable Unit Treatment Value Assumption (SUTVA). A switchback design randomizes the entire market geography over alternating time windows (e.g. Manhattan runs Algorithm A from 2-4 PM, Algorithm B from 4-6 PM).

---

## The Interview Trap & Senior Insight
Candidates propose standard 50/50 user randomization for marketplace pricing tests. Interviewers will instantly flag interference/cannibalization. Always specify Switchback Testing (time-bucket randomization) or Cluster Randomization (synthetic control across isolated metro areas).

---

## Technical Implementation
```python
# Switchback design: Alternating treatment/control in 60-min market windows
import pandas as pd
import numpy as np

# Sample market schedule with washout periods to prevent supply carryover
schedule = pd.DataFrame({
    "time_window": ["12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"],
    "market": ["Manhattan", "Manhattan", "Manhattan", "Manhattan"],
    "variant": ["Control", "Treatment", "Control", "Treatment"],
    "washout_buffer_mins": [15, 15, 15, 15] # Discard initial 15 mins to clear backlog
})
print("Market Switchback Schedule:\n", schedule)
```

## Interview Drill Check (8 Questions)

### Question 1: What key statistical assumption is violated when standard A/B user-randomization is applied to ride-hailing supply/demand algorithms?
- **Correct Answer**: `SUTVA (Stable Unit Treatment Value Assumption: one unit's treatment must not affect another unit's outcome)`
- **Key Takeaway**: SUTVA requires that the treatment assigned to one user does not affect the potential outcomes of other users. In shared supply pools (drivers, couriers), treatment users cannibalize control supply.

### Question 2: What critical interview trap should candidates watch out for when discussing "Switchback Testing for Two-Sided Marketplaces"?
- **Correct Answer**: `Candidates propose standard 50/50 user randomization for marketplace pricing tests. Interviewers wil...`
- **Key Takeaway**: Senior insight: Candidates propose standard 50/50 user randomization for marketplace pricing tests. Interviewers will instantly flag interference/cannibalization. Always specif... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "Switchback Testing for Two-Sided Marketplaces" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "Switchback Testing for Two-Sided Marketplaces", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "Switchback Testing for Two-Sided Marketplaces"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "Switchback Testing for Two-Sided Marketplaces", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Design and Analysis of Switchback Experiments in Two-Sided Platforms (Bojinov et al., JASA 2023), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "Switchback Testing for Two-Sided Marketplaces", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Design and Analysis of Switchback Experiments in Two-Sided Platforms (Bojinov et al., JASA 2023)](https://arxiv.org/abs/1903.01314)
- **Authority**: `arXiv:1903.01314`

---
*Generated with DS Roulette | Practice daily to build mastery.*
