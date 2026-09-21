# A/B Testing: Avoiding Peeking & P-Hacking
> **Discipline**: STATS  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Checking an A/B test every morning and stopping as soon as p < 0.05 is like flipping a fair coin until you happen to get 4 heads in a row and shouting 'the coin is biased!'. Peeking triples your False Positive Rate.

---

## The Interview Trap & Senior Insight
When interviewers ask 'How long should we run this A/B test?', never say 'until it reaches significance'. Calculate sample size in advance using baseline conversion, MDE (Minimum Detectable Effect), alpha (0.05), and statistical power (0.80).

---

## Technical Implementation
```python
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

# Calculate required sample size BEFORE running experiment
baseline_cr = 0.10  # 10% conversion rate
expected_cr = 0.11  # Expected 10% relative lift -> 11%

effect_size = proportion_effectsize(baseline_cr, expected_cr)
analysis = NormalIndPower()
required_n = analysis.solve_power(
    effect_size=effect_size, 
    power=0.80, 
    alpha=0.05, 
    ratio=1.0
)
print(f"Sample size needed per variation: {int(required_n):,}")
```

## Interview Drill Check (8 Questions)

### Question 1: What is the consequence of continuously monitoring p-values and stopping early once p < 0.05?
- **Correct Answer**: `It inflates the Type I error (False Positive) rate substantially`
- **Key Takeaway**: Repeated peeking gives random fluctuations multiple chances to cross alpha=0.05, dramatically inflating false discovery rates.

### Question 2: What critical interview trap should candidates watch out for when discussing "A/B Testing: Avoiding Peeking & P-Hacking"?
- **Correct Answer**: `When interviewers ask 'How long should we run this A/B test?', never say 'until it reaches significa...`
- **Key Takeaway**: Senior insight: When interviewers ask 'How long should we run this A/B test?', never say 'until it reaches significance'. Calculate sample size in advance using baseline conver... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "A/B Testing: Avoiding Peeking & P-Hacking" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "A/B Testing: Avoiding Peeking & P-Hacking", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "A/B Testing: Avoiding Peeking & P-Hacking"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "A/B Testing: Avoiding Peeking & P-Hacking", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Statistical Power Analysis for the Behavioral Sciences (Jacob Cohen), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "A/B Testing: Avoiding Peeking & P-Hacking", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Statistical Power Analysis for the Behavioral Sciences (Jacob Cohen)](https://www.utstat.toronto.edu/~brunner/oldclass/378f16/readings/CohenPower.pdf)
- **Authority**: `Routledge / Stanford Stats`

---
*Generated with DS Roulette | Practice daily to build mastery.*
