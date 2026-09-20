# Probability Calibration: Platt Scaling & Isotonic
> **Discipline**: ML  
> **Difficulty**: Advanced | **Estimated Time**: 4 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Modern boosted trees and deep neural networks are notorious for having great classification rank order (high ROC-AUC) but terrible probability calibration. If a fraud model says a transaction has a 90% chance of fraud, but out of 100 such transactions only 30 are actually fraud, your risk thresholds and revenue calculations are broken. Platt Scaling (logistic fit) and Isotonic Regression (non-parametric monotonic fit) rescale raw model outputs into true empirical probabilities.

---

## The Interview Trap & Senior Insight
ROC-AUC is completely invariant to probability calibration! A model that outputs probabilities strictly between 0.49 and 0.51 can have a perfect 1.0 ROC-AUC. If business decisions depend on expected dollar value (p * revenue), you must evaluate calibration using Brier Score and calibration curves (Reliability Diagrams).

---

## Technical Implementation
```python
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import brier_score_loss

# Uncalibrated baseline model
base_model = HistGradientBoostingClassifier()
base_model.fit(X_train, y_train)

# Calibrate via Sigmoid (Platt Scaling) or Isotonic Regression on validation fold
calibrated_model = CalibratedClassifierCV(estimator=base_model, method='isotonic', cv='prefit')
calibrated_model.fit(X_val, y_val)

prob_calibrated = calibrated_model.predict_proba(X_test)[:, 1]
print("Calibrated Brier Score:", brier_score_loss(y_test, prob_calibrated))
```

## Interview Drill Check (8 Questions)

### Question 1: Which metric directly quantifies probability calibration accuracy rather than rank ordering?
- **Correct Answer**: `Brier Score (Mean Squared Error of predicted probabilities vs actual outcomes)`
- **Key Takeaway**: Brier Score measures the mean squared difference between predicted probabilities and actual binary outcomes (0 or 1). A lower Brier score indicates superior calibration.

### Question 2: What critical interview trap should candidates watch out for when discussing "Probability Calibration: Platt Scaling & Isotonic"?
- **Correct Answer**: `ROC-AUC is completely invariant to probability calibration! A model that outputs probabilities stric...`
- **Key Takeaway**: Senior insight: ROC-AUC is completely invariant to probability calibration! A model that outputs probabilities strictly between 0.49 and 0.51 can have a perfect 1.0 ROC-AUC. If... Always call out this failure mode proactively in interviews.

### Question 3: When evaluating "Probability Calibration: Platt Scaling & Isotonic" under heavy class imbalance (e.g., 99.5% negative class), which metric is most deceptive?
- **Correct Answer**: `Raw Accuracy (which can be 99.5% simply by predicting the majority class for every sample)`
- **Key Takeaway**: A naive classifier predicting 'No Fraud' 100% of the time achieves 99.5% accuracy. Never evaluate imbalanced models with accuracy; use PR-AUC or F-beta.

### Question 4: How does "Probability Calibration: Platt Scaling & Isotonic" impact the Bias-Variance tradeoff?
- **Correct Answer**: `Increasing model capacity reduces training bias but increases variance on unseen validation splits`
- **Key Takeaway**: Underfitting exhibits high bias; overfitting exhibits high variance. Calibrating regularization or depth finds the optimal irreducible error boundary.

### Question 5: What form of data leakage is most frequently introduced when implementing "Probability Calibration: Platt Scaling & Isotonic"?
- **Correct Answer**: `Calculating feature statistics (mean, scaling, target encoding) across the entire dataset before train-test splitting`
- **Key Takeaway**: Leakage occurs whenever information from the validation or test fold contaminates training feature engineering. Transformations must be strictly fit on training folds only.

### Question 6: In production pipelines, how can data drift degrade "Probability Calibration: Platt Scaling & Isotonic" post-deployment?
- **Correct Answer**: `Covariate shift: the underlying distribution of input features P(X) changes over time while the true relationship P(Y|X) may shift (concept drift)`
- **Key Takeaway**: Real-world consumer behavior shifts over time. Monitoring Population Stability Index (PSI) or Kolmogorov-Smirnov statistics detects drift before performance collapses.

### Question 7: According to Predicting Good Probabilities With Supervised Learning (Niculescu-Mizil & Caruana, ICML 2005), what mathematical objective does this method optimize?
- **Correct Answer**: `A convex or surrogate loss function (e.g. log-loss, squared error) that approximates true empirical risk`
- **Key Takeaway**: Because zero-one loss is non-differentiable and NP-hard, machine learning algorithms optimize smooth surrogate loss functions using gradient descent.

### Question 8: How should you explain the trade-offs of "Probability Calibration: Platt Scaling & Isotonic" to non-technical business stakeholders?
- **Correct Answer**: `Frame the trade-off in terms of false positives vs false negatives: cost of lost customers vs cost of fraudulent transactions`
- **Key Takeaway**: Executive communication requires mapping statistical precision/recall trade-offs directly into financial P&L impact and customer experience friction.

---

## Deep Research & Reading
- **Resource**: [Predicting Good Probabilities With Supervised Learning (Niculescu-Mizil & Caruana, ICML 2005)](https://www.cs.cornell.edu/~alexn/papers/calibration.icml05.crc.rev3.pdf)
- **Authority**: `ICML Proceedings`

---
*Generated with DS Roulette | Practice daily to build mastery.*
