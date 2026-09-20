# Precision vs Recall vs F1
> **Discipline**: ML  
> **Difficulty**: Beginner | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Precision: 'Of all the cases we predicted positive, how many were actually positive?' (Quality of alarms). Recall: 'Of all the actual positives out there, how many did we successfully find?' (Coverage of alarms).

---

## The Interview Trap & Senior Insight
Never say 'We used F1 score because it balances both' without clarifying business impact! In Cancer Detection or Fraud, False Negatives cost lives or money, so prioritize Recall. In spam filtering or automated account bans, False Positives ruin user trust, so prioritize Precision.

---

## Technical Implementation
```python
from sklearn.metrics import classification_report, precision_score, recall_score

# High Recall: Catches almost all fraud (Low False Negatives)
# High Precision: When it alerts fraud, it is almost definitely fraud (Low False Positives)
# F1: Harmonic mean = 2 * (P * R) / (P + R)

print(classification_report(y_true, y_pred))
```

## Interview Drill Check (8 Questions)

### Question 1: In a medical diagnostic system screening for an aggressive curable illness, which metric is most critical to maximize?
- **Correct Answer**: `Recall (minimizing missed cases)`
- **Key Takeaway**: A False Negative means a patient with a curable illness goes untreated. Maximizing Recall ensures nearly all sick patients are flagged for follow-up testing.

### Question 2: What critical interview trap should candidates watch out for when discussing "Precision vs Recall vs F1"?
- **Correct Answer**: `Never say 'We used F1 score because it balances both' without clarifying business impact! In Cancer ...`
- **Key Takeaway**: Senior insight: Never say 'We used F1 score because it balances both' without clarifying business impact! In Cancer Detection or Fraud, False Negatives cost lives or money, so ... Always call out this failure mode proactively in interviews.

### Question 3: When evaluating "Precision vs Recall vs F1" under heavy class imbalance (e.g., 99.5% negative class), which metric is most deceptive?
- **Correct Answer**: `Raw Accuracy (which can be 99.5% simply by predicting the majority class for every sample)`
- **Key Takeaway**: A naive classifier predicting 'No Fraud' 100% of the time achieves 99.5% accuracy. Never evaluate imbalanced models with accuracy; use PR-AUC or F-beta.

### Question 4: How does "Precision vs Recall vs F1" impact the Bias-Variance tradeoff?
- **Correct Answer**: `Increasing model capacity reduces training bias but increases variance on unseen validation splits`
- **Key Takeaway**: Underfitting exhibits high bias; overfitting exhibits high variance. Calibrating regularization or depth finds the optimal irreducible error boundary.

### Question 5: What form of data leakage is most frequently introduced when implementing "Precision vs Recall vs F1"?
- **Correct Answer**: `Calculating feature statistics (mean, scaling, target encoding) across the entire dataset before train-test splitting`
- **Key Takeaway**: Leakage occurs whenever information from the validation or test fold contaminates training feature engineering. Transformations must be strictly fit on training folds only.

### Question 6: In production pipelines, how can data drift degrade "Precision vs Recall vs F1" post-deployment?
- **Correct Answer**: `Covariate shift: the underlying distribution of input features P(X) changes over time while the true relationship P(Y|X) may shift (concept drift)`
- **Key Takeaway**: Real-world consumer behavior shifts over time. Monitoring Population Stability Index (PSI) or Kolmogorov-Smirnov statistics detects drift before performance collapses.

### Question 7: According to Scikit-Learn User Guide: Precision-Recall & F-measure Metrics, what mathematical objective does this method optimize?
- **Correct Answer**: `A convex or surrogate loss function (e.g. log-loss, squared error) that approximates true empirical risk`
- **Key Takeaway**: Because zero-one loss is non-differentiable and NP-hard, machine learning algorithms optimize smooth surrogate loss functions using gradient descent.

### Question 8: How should you explain the trade-offs of "Precision vs Recall vs F1" to non-technical business stakeholders?
- **Correct Answer**: `Frame the trade-off in terms of false positives vs false negatives: cost of lost customers vs cost of fraudulent transactions`
- **Key Takeaway**: Executive communication requires mapping statistical precision/recall trade-offs directly into financial P&L impact and customer experience friction.

---

## Deep Research & Reading
- **Resource**: [Scikit-Learn User Guide: Precision-Recall & F-measure Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-and-f-measures)
- **Authority**: `Scikit-Learn Docs`

---
*Generated with DS Roulette | Practice daily to build mastery.*
