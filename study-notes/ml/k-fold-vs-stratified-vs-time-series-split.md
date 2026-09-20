# K-Fold vs Stratified vs Time-Series Split
> **Discipline**: ML  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Standard K-Fold randomly splits data. Stratified K-Fold preserves the exact percentage of each class across folds (essential for imbalanced classes). Time-Series Split (Walk-Forward) ensures training data ONLY contains past records and validation is in the future.

---

## The Interview Trap & Senior Insight
Using standard K-Fold CV on stock prices, user transactions, or time-series data produces massive look-ahead bias! The model trains on Tuesday and Thursday to predict Wednesday. Always use TimeSeriesSplit for temporal data.

---

## Technical Implementation
```python
from sklearn.model_selection import TimeSeriesSplit, StratifiedKFold
import numpy as np

# For Time Series (No future lookahead!):
tscv = TimeSeriesSplit(n_splits=5)
for train_index, test_index in tscv.split(X):
    # Train is ALWAYS chronologically prior to Test
    X_train, X_test = X[train_index], X[test_index]

# For Imbalanced Classification:
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
```

## Interview Drill Check (8 Questions)

### Question 1: Why should you never use shuffle=True in K-Fold Cross Validation for financial forecasting models?
- **Correct Answer**: `It creates temporal data leakage by evaluating past outcomes using future training observations`
- **Key Takeaway**: Shuffling temporal data allows information from future time periods to leak into training folds, causing unrealistically high CV scores that crash in production.

### Question 2: What critical interview trap should candidates watch out for when discussing "K-Fold vs Stratified vs Time-Series Split"?
- **Correct Answer**: `Using standard K-Fold CV on stock prices, user transactions, or time-series data produces massive lo...`
- **Key Takeaway**: Senior insight: Using standard K-Fold CV on stock prices, user transactions, or time-series data produces massive look-ahead bias! The model trains on Tuesday and Thursday to p... Always call out this failure mode proactively in interviews.

### Question 3: When evaluating "K-Fold vs Stratified vs Time-Series Split" under heavy class imbalance (e.g., 99.5% negative class), which metric is most deceptive?
- **Correct Answer**: `Raw Accuracy (which can be 99.5% simply by predicting the majority class for every sample)`
- **Key Takeaway**: A naive classifier predicting 'No Fraud' 100% of the time achieves 99.5% accuracy. Never evaluate imbalanced models with accuracy; use PR-AUC or F-beta.

### Question 4: How does "K-Fold vs Stratified vs Time-Series Split" impact the Bias-Variance tradeoff?
- **Correct Answer**: `Increasing model capacity reduces training bias but increases variance on unseen validation splits`
- **Key Takeaway**: Underfitting exhibits high bias; overfitting exhibits high variance. Calibrating regularization or depth finds the optimal irreducible error boundary.

### Question 5: What form of data leakage is most frequently introduced when implementing "K-Fold vs Stratified vs Time-Series Split"?
- **Correct Answer**: `Calculating feature statistics (mean, scaling, target encoding) across the entire dataset before train-test splitting`
- **Key Takeaway**: Leakage occurs whenever information from the validation or test fold contaminates training feature engineering. Transformations must be strictly fit on training folds only.

### Question 6: In production pipelines, how can data drift degrade "K-Fold vs Stratified vs Time-Series Split" post-deployment?
- **Correct Answer**: `Covariate shift: the underlying distribution of input features P(X) changes over time while the true relationship P(Y|X) may shift (concept drift)`
- **Key Takeaway**: Real-world consumer behavior shifts over time. Monitoring Population Stability Index (PSI) or Kolmogorov-Smirnov statistics detects drift before performance collapses.

### Question 7: According to Scikit-Learn Guide on Pipeline Construction & Avoiding Leakage, what mathematical objective does this method optimize?
- **Correct Answer**: `A convex or surrogate loss function (e.g. log-loss, squared error) that approximates true empirical risk`
- **Key Takeaway**: Because zero-one loss is non-differentiable and NP-hard, machine learning algorithms optimize smooth surrogate loss functions using gradient descent.

### Question 8: How should you explain the trade-offs of "K-Fold vs Stratified vs Time-Series Split" to non-technical business stakeholders?
- **Correct Answer**: `Frame the trade-off in terms of false positives vs false negatives: cost of lost customers vs cost of fraudulent transactions`
- **Key Takeaway**: Executive communication requires mapping statistical precision/recall trade-offs directly into financial P&L impact and customer experience friction.

---

## Deep Research & Reading
- **Resource**: [Scikit-Learn Guide on Pipeline Construction & Avoiding Leakage](https://scikit-learn.org/stable/modules/compose.html#pipeline)
- **Authority**: `Scikit-Learn Documentation`

---
*Generated with DS Roulette | Practice daily to build mastery.*
