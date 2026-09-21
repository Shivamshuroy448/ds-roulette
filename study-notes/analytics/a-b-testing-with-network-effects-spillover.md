# A/B Testing with Network Effects & Spillover
> **Discipline**: ANALYTICS  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
In two-sided marketplaces (e.g. Uber drivers and riders), if you put 50% of riders in a Treatment group with a 20% discount coupon, Treatment riders will book more rides and consume all nearby drivers, leaving Control riders stranded with longer wait times! The Treatment contaminated the Control group (SUTVA violation).

---

## The Interview Trap & Senior Insight
To solve SUTVA violations in marketplace A/B tests, use: (1) Cluster Randomization (randomizing distinct geographic cities like Austin vs Miami), (2) Switchback Experiments (alternating Treatment and Control across 2-hour time windows in the same city), or (3) Synthetic Controls.

---

## Technical Implementation
```python
# Switchback Experiment Design Matrix:
# Alternates all users in a city between Treatment & Control in discrete time blocks
# Time Block 1 (12:00 - 14:00): Treatment (Dynamic Pricing Algorithm v2)
# Time Block 2 (14:00 - 16:00): Control (Baseline Algorithm)
# Washout period (15 min) between blocks to drain in-flight dispatch queues!
```

## Interview Drill Check (8 Questions)

### Question 1: What core statistical assumption of traditional A/B testing is violated when Treatment users directly affect Control users?
- **Correct Answer**: `SUTVA (Stable Unit Treatment Value Assumption)`
- **Key Takeaway**: SUTVA requires that the treatment assigned to one unit does not affect the potential outcomes of other units (no interference/spillover).

### Question 2: What critical interview trap should candidates watch out for when discussing "A/B Testing with Network Effects & Spillover"?
- **Correct Answer**: `To solve SUTVA violations in marketplace A/B tests, use: (1) Cluster Randomization (randomizing dist...`
- **Key Takeaway**: Senior insight: To solve SUTVA violations in marketplace A/B tests, use: (1) Cluster Randomization (randomizing distinct geographic cities like Austin vs Miami), (2) Switchback... Always call out this failure mode proactively in interviews.

### Question 3: When defining metrics related to "A/B Testing with Network Effects & Spillover", what is the danger of optimizing for a 'Vanity Metric'?
- **Correct Answer**: `A metric like total registered users or pageviews can climb steadily while active engagement, retention, and monetization are dying`
- **Key Takeaway**: Vanity metrics only go up and give a false sense of progress. Actionable metrics (retention cohorts, conversion rates, LTV:CAC) directly inform operational decisions.

### Question 4: How do you distinguish between correlation and causation when analyzing "A/B Testing with Network Effects & Spillover"?
- **Correct Answer**: `By running a randomized controlled trial (A/B experiment) or employing quasi-experimental methods like Difference-in-Differences and Instrumental Variables`
- **Key Takeaway**: Observational correlation does not prove causation due to confounders. Controlled experimentation or econometric causal inference methods are mandatory.

### Question 5: What does cohort analysis reveal about "A/B Testing with Network Effects & Spillover" that aggregate metrics obscure?
- **Correct Answer**: `Aggregate numbers blend old and new user behavior, hiding whether recent product releases are improving or worsening user retention`
- **Key Takeaway**: If you acquire 100k users with high churn, aggregate active user numbers look healthy. Cohort retention curves isolate specific vintage cohorts to measure genuine product improvements.

### Question 6: According to Measuring Market Effects in Two-Sided Marketplace Experiments (Chamandy, Uber Engineering), what is the hallmark of a world-class growth strategy?
- **Correct Answer**: `High Day 30+ retention curve that flattens horizontally, creating compounding compounding lifetime customer value`
- **Key Takeaway**: Without a flat retention baseline, pouring users into the top of the funnel is a 'leaky bucket'. Long-term cohort retention is the foundation of sustainable growth.

### Question 7: How should you structure an executive dashboard tracking "A/B Testing with Network Effects & Spillover"?
- **Correct Answer**: `Display a top-level North Star metric with key input drivers, conversion funnels, and drill-downs by user segment`
- **Key Takeaway**: Executive dashboards must provide hierarchical clarity: the primary outcome metric at a glance, followed by actionable leading indicator drivers.

### Question 8: If an interviewer asks: 'Our metric for A/B Testing with Network Effects & Spillover dropped 12% yesterday. How do you investigate?', what is your structured approach?
- **Correct Answer**: `Verify tracking integrity and data pipeline latency, check seasonality/holidays, segment by platform/geography/version, and check recent product deployments`
- **Key Takeaway**: A top-tier analytics diagnostic framework always begins with data integrity validation, followed by external seasonality checks, platform segmentation, and recent code releases.

---

## Deep Research & Reading
- **Resource**: [Design and Analysis of Switchback Experiments in Two-Sided Platforms (Bojinov et al.)](https://arxiv.org/abs/1903.01314)
- **Authority**: `arXiv:1903.01314`

---
*Generated with DS Roulette | Practice daily to build mastery.*
