# Survival Analysis & Kaplan-Meier Churn Curves
> **Discipline**: ML  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
When predicting when a subscriber will cancel, active customers haven't churned yet - they are 'right-censored'. If you drop active users, you underestimate lifetime. If you treat their current tenure as their churn date, you heavily bias the model. Kaplan-Meier estimator calculates the probability of surviving past time t, correctly factoring in censored data.

---

## The Interview Trap & Senior Insight
Candidates often frame user lifetime as a standard linear or XGBoost regression on 'days_until_churn'. But for users who joined last month and are still active, what is their churn date? Dropping them or imputing arbitrary dates destroys the distribution. Always explain that time-to-event requires Survival Analysis (Cox Proportional Hazards or Kaplan-Meier).

---

## Technical Implementation
```python
from lifelines import KaplanMeierFitter
import matplotlib.pyplot as plt

# durations: tenure in months; events: 1 if churned, 0 if still active (censored)
tenure_months = [1, 2, 3, 5, 8, 12, 12, 14, 18, 24]
churned_event = [1, 1, 1, 0, 1, 0, 1, 0, 0, 0] # 0 = right-censored

kmf = KaplanMeierFitter()
kmf.fit(durations=tenure_months, event_observed=churned_event)

print(f"Median Survival Time: {kmf.median_survival_time_} months")
print(f"6-Month Retention Probability: {kmf.predict(6):.2%}")
```

## Interview Drill Check (8 Questions)

### Question 1: What does 'right-censoring' mean in the context of user churn modeling?
- **Correct Answer**: `Users who are still active at the end of the study observation window, whose eventual churn time has not yet occurred`
- **Key Takeaway**: Right-censoring occurs when an event (churn, cancellation, death) has not yet happened for an subject by the time data collection concludes.

### Question 2: What critical interview trap should candidates watch out for when discussing "Survival Analysis & Kaplan-Meier Churn Curves"?
- **Correct Answer**: `Candidates often frame user lifetime as a standard linear or XGBoost regression on 'days_until_churn...`
- **Key Takeaway**: Senior insight: Candidates often frame user lifetime as a standard linear or XGBoost regression on 'days_until_churn'. But for users who joined last month and are still active,... Always call out this failure mode proactively in interviews.

### Question 3: When evaluating "Survival Analysis & Kaplan-Meier Churn Curves" under heavy class imbalance (e.g., 99.5% negative class), which metric is most deceptive?
- **Correct Answer**: `Raw Accuracy (which can be 99.5% simply by predicting the majority class for every sample)`
- **Key Takeaway**: A naive classifier predicting 'No Fraud' 100% of the time achieves 99.5% accuracy. Never evaluate imbalanced models with accuracy; use PR-AUC or F-beta.

### Question 4: How does "Survival Analysis & Kaplan-Meier Churn Curves" impact the Bias-Variance tradeoff?
- **Correct Answer**: `Increasing model capacity reduces training bias but increases variance on unseen validation splits`
- **Key Takeaway**: Underfitting exhibits high bias; overfitting exhibits high variance. Calibrating regularization or depth finds the optimal irreducible error boundary.

### Question 5: What form of data leakage is most frequently introduced when implementing "Survival Analysis & Kaplan-Meier Churn Curves"?
- **Correct Answer**: `Calculating feature statistics (mean, scaling, target encoding) across the entire dataset before train-test splitting`
- **Key Takeaway**: Leakage occurs whenever information from the validation or test fold contaminates training feature engineering. Transformations must be strictly fit on training folds only.

### Question 6: In production pipelines, how can data drift degrade "Survival Analysis & Kaplan-Meier Churn Curves" post-deployment?
- **Correct Answer**: `Covariate shift: the underlying distribution of input features P(X) changes over time while the true relationship P(Y|X) may shift (concept drift)`
- **Key Takeaway**: Real-world consumer behavior shifts over time. Monitoring Population Stability Index (PSI) or Kolmogorov-Smirnov statistics detects drift before performance collapses.

### Question 7: According to Nonparametric Estimation from Incomplete Observations (Kaplan & Meier, JASA 1958), what mathematical objective does this method optimize?
- **Correct Answer**: `A convex or surrogate loss function (e.g. log-loss, squared error) that approximates true empirical risk`
- **Key Takeaway**: Because zero-one loss is non-differentiable and NP-hard, machine learning algorithms optimize smooth surrogate loss functions using gradient descent.

### Question 8: How should you explain the trade-offs of "Survival Analysis & Kaplan-Meier Churn Curves" to non-technical business stakeholders?
- **Correct Answer**: `Frame the trade-off in terms of false positives vs false negatives: cost of lost customers vs cost of fraudulent transactions`
- **Key Takeaway**: Executive communication requires mapping statistical precision/recall trade-offs directly into financial P&L impact and customer experience friction.

---

## Deep Research & Reading
- **Resource**: [Nonparametric Estimation from Incomplete Observations (Kaplan & Meier, JASA 1958)](https://www.jstor.org/stable/2281868)
- **Authority**: `Journal of the American Statistical Association`

---
*Generated with DS Roulette | Practice daily to build mastery.*
