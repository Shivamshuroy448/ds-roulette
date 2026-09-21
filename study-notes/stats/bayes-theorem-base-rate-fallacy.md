# Bayes' Theorem & Base Rate Fallacy
> **Discipline**: STATS  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
P(A|B) = [P(B|A) * P(A)] / P(B). If a rare disease affects 1 in 10,000 people (0.01%), and a test is 99% accurate, testing positive still means you have less than a 1% chance of actually having the disease because the false positive pool among 9,999 healthy people dwarfs the true positive pool!

---

## The Interview Trap & Senior Insight
This is the single most common probability interview question at FAANG and hedge funds. Candidates almost always forget to incorporate the base rate P(Disease) and calculate only the test accuracy.

---

## Technical Implementation
```python
def bayes_disease_probability(prevalence, sensitivity, false_positive_rate):
    # P(Disease) = prevalence
    # P(Positive | Disease) = sensitivity
    # P(Positive | Healthy) = false_positive_rate
    p_healthy = 1.0 - prevalence
    
    # Total probability of testing positive:
    p_pos = (sensitivity * prevalence) + (false_positive_rate * p_healthy)
    
    # Posterior: P(Disease | Positive)
    p_disease_given_pos = (sensitivity * prevalence) / p_pos
    return p_disease_given_pos

# 99% accurate test on 1/1,000 rare disease:
prob = bayes_disease_probability(0.001, 0.99, 0.01)
print(f"Actual probability of disease: {prob:.1%}") # Only ~9.0%!
```

## Interview Drill Check (8 Questions)

### Question 1: If disease prevalence is 0.1% and a test has 5% false positive rate with 100% sensitivity, what is P(Disease | Positive)?
- **Correct Answer**: `~1.96%`
- **Key Takeaway**: Out of 100,000 people: 100 have disease (all 100 test positive). 99,900 healthy people produce 5% = 4,995 false positives. P = 100 / (100 + 4995) = ~1.96%.

### Question 2: What critical interview trap should candidates watch out for when discussing "Bayes' Theorem & Base Rate Fallacy"?
- **Correct Answer**: `This is the single most common probability interview question at FAANG and hedge funds. Candidates a...`
- **Key Takeaway**: Senior insight: This is the single most common probability interview question at FAANG and hedge funds. Candidates almost always forget to incorporate the base rate P(Disease) ... Always call out this failure mode proactively in interviews.

### Question 3: What is the risk of 'Peeking' (early stopping) when evaluating "Bayes' Theorem & Base Rate Fallacy" in an ongoing A/B test?
- **Correct Answer**: `It inflates the true Type I error rate (false positive rate) from 5% to over 30%`
- **Key Takeaway**: Continuously checking p-values and stopping as soon as p < 0.05 guarantees high false positive rates due to optional stopping. Use fixed sample sizing or sequential testing (mSPRT).

### Question 4: Under "Bayes' Theorem & Base Rate Fallacy", what is the formal definition of statistical power (1 - beta)?
- **Correct Answer**: `The probability of correctly rejecting the null hypothesis when a true effect actually exists`
- **Key Takeaway**: Power is the sensitivity of the experiment: the probability that your test will detect an effect of a given magnitude if it is genuinely present in reality.

### Question 5: How does sample size N scale with Minimum Detectable Effect (MDE) in "Bayes' Theorem & Base Rate Fallacy"?
- **Correct Answer**: `Sample size is inversely proportional to MDE squared: cutting MDE in half requires 4x the sample size`
- **Key Takeaway**: Because standard error scales with 1/sqrt(N), detecting an effect that is half as large requires 4 times as many experimental units (users).

### Question 6: When dealing with heavy-tailed metrics (like revenue per user) in "Bayes' Theorem & Base Rate Fallacy", which technique is recommended?
- **Correct Answer**: `Winsorization / capping extreme outliers at the 99th percentile, or applying log/bootstrapping transformations`
- **Key Takeaway**: Skewed revenue data exhibits extreme variance that dilutes statistical power. Capping or applying variance reduction (CUPED) stabilizes t-tests.

### Question 7: According to Bayes' Rule: A Tutorial Introduction to Bayesian Analysis (Stone, 2013), what is the fundamental assumption of classical hypothesis testing?
- **Correct Answer**: `The Null Hypothesis (H0) is assumed true until empirical observations are sufficiently improbable under that null distribution`
- **Key Takeaway**: Frequentist inference assumes H0 (no effect). The p-value measures the probability of observing data at least as extreme as what was measured, assuming H0 holds.

### Question 8: In two-sided hypothesis testing for "Bayes' Theorem & Base Rate Fallacy", how is the p-value computed relative to the critical threshold?
- **Correct Answer**: `By measuring the area under both tails of the null distribution beyond the observed test statistic`
- **Key Takeaway**: A two-sided test accounts for the probability of observing extreme deviations in either positive or negative directions, splitting alpha across both tails.

---

## Deep Research & Reading
- **Resource**: [Bayes Theorem: Prior Probability, Likelihood, and Posterior Odds](https://en.wikipedia.org/wiki/Bayes%27_theorem)
- **Authority**: `Wikipedia / Stanford Encyclopedia`

---
*Generated with DS Roulette | Practice daily to build mastery.*
