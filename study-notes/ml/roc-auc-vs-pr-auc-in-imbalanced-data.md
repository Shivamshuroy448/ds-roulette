# ROC-AUC vs PR-AUC in Imbalanced Data
> **Discipline**: ML  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
ROC-AUC evaluates True Positive Rate vs False Positive Rate. When negative samples vastly outnumber positives (e.g., 99.9% non-fraud vs 0.1% fraud), millions of true negatives make the False Positive Rate look deceptively tiny, making a broken model look '99% AUC' accurate. PR-AUC focuses only on minority positives and precision.

---

## The Interview Trap & Senior Insight
Never report ROC-AUC alone on heavily skewed datasets (fraud, cancer detection, ad clickthrough). The interviewer is waiting to see if you instinctively bring up Precision-Recall curves.

---

## Technical Implementation
```python
from sklearn.metrics import roc_auc_score, average_precision_score

# In severe class imbalance (e.g. 1000 negatives, 5 positives):
roc_score = roc_auc_score(y_true, y_prob)  # Can be misleadingly high (~0.95)
pr_auc = average_precision_score(y_true, y_prob) # Honest evaluation of minority class

print(f"ROC-AUC: {roc_score:.3f} | PR-AUC: {pr_auc:.3f}")
```

## Interview Drill Check (8 Questions)

### Question 1: Why does ROC-AUC present an overly optimistic score on severely imbalanced datasets?
- **Correct Answer**: `The huge number of True Negatives dilutes the False Positive Rate denominator`
- **Key Takeaway**: FPR = FP / (FP + TN). When TN is in the millions, FPR stays near zero even if false alarms (FP) explode.

### Question 2: What critical interview trap should candidates watch out for when discussing "ROC-AUC vs PR-AUC in Imbalanced Data"?
- **Correct Answer**: `Never report ROC-AUC alone on heavily skewed datasets (fraud, cancer detection, ad clickthrough). Th...`
- **Key Takeaway**: Senior insight: Never report ROC-AUC alone on heavily skewed datasets (fraud, cancer detection, ad clickthrough). The interviewer is waiting to see if you instinctively bring u... Always call out this failure mode proactively in interviews.

### Question 3: When evaluating "ROC-AUC vs PR-AUC in Imbalanced Data" under heavy class imbalance (e.g., 99.5% negative class), which metric is most deceptive?
- **Correct Answer**: `Raw Accuracy (which can be 99.5% simply by predicting the majority class for every sample)`
- **Key Takeaway**: A naive classifier predicting 'No Fraud' 100% of the time achieves 99.5% accuracy. Never evaluate imbalanced models with accuracy; use PR-AUC or F-beta.

### Question 4: How does "ROC-AUC vs PR-AUC in Imbalanced Data" impact the Bias-Variance tradeoff?
- **Correct Answer**: `Increasing model capacity reduces training bias but increases variance on unseen validation splits`
- **Key Takeaway**: Underfitting exhibits high bias; overfitting exhibits high variance. Calibrating regularization or depth finds the optimal irreducible error boundary.

### Question 5: What form of data leakage is most frequently introduced when implementing "ROC-AUC vs PR-AUC in Imbalanced Data"?
- **Correct Answer**: `Calculating feature statistics (mean, scaling, target encoding) across the entire dataset before train-test splitting`
- **Key Takeaway**: Leakage occurs whenever information from the validation or test fold contaminates training feature engineering. Transformations must be strictly fit on training folds only.

### Question 6: In production pipelines, how can data drift degrade "ROC-AUC vs PR-AUC in Imbalanced Data" post-deployment?
- **Correct Answer**: `Covariate shift: the underlying distribution of input features P(X) changes over time while the true relationship P(Y|X) may shift (concept drift)`
- **Key Takeaway**: Real-world consumer behavior shifts over time. Monitoring Population Stability Index (PSI) or Kolmogorov-Smirnov statistics detects drift before performance collapses.

### Question 7: According to The Relationship Between Precision-Recall and ROC Curves (Davis & Goadrich, ICML 2006), what mathematical objective does this method optimize?
- **Correct Answer**: `A convex or surrogate loss function (e.g. log-loss, squared error) that approximates true empirical risk`
- **Key Takeaway**: Because zero-one loss is non-differentiable and NP-hard, machine learning algorithms optimize smooth surrogate loss functions using gradient descent.

### Question 8: How should you explain the trade-offs of "ROC-AUC vs PR-AUC in Imbalanced Data" to non-technical business stakeholders?
- **Correct Answer**: `Frame the trade-off in terms of false positives vs false negatives: cost of lost customers vs cost of fraudulent transactions`
- **Key Takeaway**: Executive communication requires mapping statistical precision/recall trade-offs directly into financial P&L impact and customer experience friction.

---

## Deep Research & Reading
- **Resource**: [The Relationship Between Precision-Recall and ROC Curves (Davis & Goadrich, ICML 2006)](https://ftp.cs.wisc.edu/machine-learning/shavlik-group/davis.icml06.pdf)
- **Authority**: `ICML Proceedings`

---
*Generated with DS Roulette | Practice daily to build mastery.*
