# Type I vs Type II Errors & Power
> **Discipline**: STATS  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Type I Error (Alpha): The boy who cried wolf when there is no wolf (False Alarm). Type II Error (Beta): The villagers sleeping through the real wolf attacking (Missed Detection). Statistical Power is (1 - Beta): the probability of detecting a real effect if it actually exists.

---

## The Interview Trap & Senior Insight
Standard industry A/B tests set Alpha = 0.05 and Power = 0.80 (Beta = 0.20). Notice that people accept a 20% chance of missing a real winner (Type II) just to keep false alarms (Type I) down to 5%!

---

## Technical Implementation
```python
from statsmodels.stats.power import TTestIndPower

# Calculate sample size required for 80% statistical power (alpha=0.05, effect_size=0.1)
analysis = TTestIndPower()
sample_size = analysis.solve_power(
    effect_size=0.1, 
    power=0.80, 
    alpha=0.05, 
    ratio=1.0
)
print(f"Required sample size per variant: {int(sample_size):,}")
```

## Interview Drill Check (8 Questions)

### Question 1: If an A/B test has a statistical power of 0.80, what does this mean?
- **Correct Answer**: `If a true effect exists, there is an 80% chance the test will successfully detect it`
- **Key Takeaway**: Statistical power (1 - beta) is the probability of correctly rejecting the null hypothesis when the alternative hypothesis is true.

### Question 2: What critical interview trap should candidates watch out for when discussing "Type I vs Type II Errors & Power"?
- **Correct Answer**: `Standard industry A/B tests set Alpha = 0.05 and Power = 0.80 (Beta = 0.20). Notice that people acce...`
- **Key Takeaway**: Senior insight: Standard industry A/B tests set Alpha = 0.05 and Power = 0.80 (Beta = 0.20). Notice that people accept a 20% chance of missing a real winner (Type II) just to k... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "Type I vs Type II Errors & Power" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "Type I vs Type II Errors & Power", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "Type I vs Type II Errors & Power"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "Type I vs Type II Errors & Power", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Hypothesis Testing: Type I and Type II Errors (Neyman & Pearson, 1933), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "Type I vs Type II Errors & Power", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Type I and Type II Errors: False Positives, False Negatives & Power](https://en.wikipedia.org/wiki/Type_I_and_type_II_errors)
- **Authority**: `Wikipedia / Neyman-Pearson`

---
*Generated with DS Roulette | Practice daily to build mastery.*
