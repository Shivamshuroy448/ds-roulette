# The Central Limit Theorem (CLT)
> **Discipline**: STATS  
> **Difficulty**: Beginner | **Estimated Time**: 2 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Even if your raw data is heavily skewed (like exponential user revenue or binary clicks), the average of random samples drawn from that population will form a bell curve (Normal distribution) as sample size n increases (typically n >= 30).

---

## The Interview Trap & Senior Insight
Candidates claim 'The CLT says all data becomes normal if you collect enough samples'. WRONG! The raw population distribution does NOT change or become normal. It is ONLY the distribution of the sample mean (x̄) that converges to a Gaussian distribution.

---

## Technical Implementation
```python
import numpy as np
import matplotlib.pyplot as plt

# Skewed population: Exponential distribution (e.g. dwell time)
population = np.random.exponential(scale=2.0, size=100000)

# Take 1,000 sample means (each sample size n = 40)
sample_means = [np.mean(np.random.choice(population, size=40)) for _ in range(1000)]

# sample_means is now perfectly bell-shaped (Normal distribution)!
print(f"Mean of means: {np.mean(sample_means):.2f}, Pop mean: {np.mean(population):.2f}")
```

## Interview Drill Check (8 Questions)

### Question 1: According to the Central Limit Theorem, what happens to the standard deviation of the sample mean as sample size n increases?
- **Correct Answer**: `It decreases proportional to sigma / sqrt(n)`
- **Key Takeaway**: The standard error of the mean is sigma / sqrt(n), so larger sample sizes cause the sampling distribution to become narrower and more concentrated around the true population mean.

### Question 2: What critical interview trap should candidates watch out for when discussing "The Central Limit Theorem (CLT)"?
- **Correct Answer**: `Candidates claim 'The CLT says all data becomes normal if you collect enough samples'. WRONG! The ra...`
- **Key Takeaway**: Senior insight: Candidates claim 'The CLT says all data becomes normal if you collect enough samples'. WRONG! The raw population distribution does NOT change or become normal. ... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "The Central Limit Theorem (CLT)" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "The Central Limit Theorem (CLT)", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "The Central Limit Theorem (CLT)"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "The Central Limit Theorem (CLT)", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to The Central Limit Theorem in Statistics and Probability (Rice Mathematical Statistics), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "The Central Limit Theorem (CLT)", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [The Central Limit Theorem: Proofs, Asymptotics & Finite Variance](https://en.wikipedia.org/wiki/Central_limit_theorem)
- **Authority**: `Wikipedia / MIT OpenCourseWare`

---
*Generated with DS Roulette | Practice daily to build mastery.*
