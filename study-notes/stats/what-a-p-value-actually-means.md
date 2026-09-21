# What a P-Value Actually Means
> **Discipline**: STATS  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
A p-value is NOT the probability that your hypothesis is true. It is the probability of observing data at least as extreme as yours, ASSUMING the null hypothesis (that there is zero effect) is 100% true.

---

## The Interview Trap & Senior Insight
Saying 'a p-value of 0.03 means there is a 97% chance my feature works' is an immediate fail in data science interviews. Say: 'If the feature had zero effect, we would see this result only 3% of the time by sheer random chance.'

---

## Technical Implementation
```python
from scipy import stats

# Two-sample t-test comparing treatment vs control conversions
t_stat, p_val = stats.ttest_ind(treatment_conversions, control_conversions)

print(f"p-value: {p_val:.4f}")
if p_val < 0.05:
    print("Statistically significant: reject the null hypothesis at alpha=0.05")
```

## Interview Drill Check (8 Questions)

### Question 1: If an A/B test reports p = 0.02, which statement is scientifically correct?
- **Correct Answer**: `Under the assumption of no difference, there is a 2% chance of seeing a difference this large`
- **Key Takeaway**: P-value is conditional on the null hypothesis being true: P(Data as or more extreme | H0 is true).

### Question 2: What critical interview trap should candidates watch out for when discussing "What a P-Value Actually Means"?
- **Correct Answer**: `Saying 'a p-value of 0.03 means there is a 97% chance my feature works' is an immediate fail in data...`
- **Key Takeaway**: Senior insight: Saying 'a p-value of 0.03 means there is a 97% chance my feature works' is an immediate fail in data science interviews. Say: 'If the feature had zero effect, w... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "What a P-Value Actually Means" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "What a P-Value Actually Means", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "What a P-Value Actually Means"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "What a P-Value Actually Means", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to The ASA's Statement on p-Values: Context, Process, and Purpose (Wasserstein & Lazar, 2016), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "What a P-Value Actually Means", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [P-Value Definition, Statistical Significance & Interpretation](https://en.wikipedia.org/wiki/P-value)
- **Authority**: `Wikipedia / OpenIntro`

---
*Generated with DS Roulette | Practice daily to build mastery.*
