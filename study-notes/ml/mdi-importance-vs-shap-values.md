# MDI Importance vs SHAP Values
> **Discipline**: ML  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Mean Decrease in Impurity (MDI, standard rf.feature_importances_) artificially inflates the importance of high-cardinality numerical features (like user IDs or continuous timestamps). SHAP (SHapley Additive exPlanations) uses game theory to calculate the marginal contribution of each feature across all possible feature subsets, providing consistent global and local explanations.

---

## The Interview Trap & Senior Insight
If you add a completely random column of continuous numbers to a Random Forest, default MDI will rank it among the top most important features! Always use Permutation Importance or TreeSHAP for unbiased feature importance.

---

## Technical Implementation
```python
import shap
import xgboost as xgb

model = xgb.XGBClassifier().fit(X_train, y_train)

# TreeSHAP: Exact Shapley values calculated in polynomial time
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Summary plot shows magnitude and direction of feature impact
shap.summary_plot(shap_values, X_test)
```

## Interview Drill Check (8 Questions)

### Question 1: What major flaw does Mean Decrease in Impurity (MDI) suffer from in tree-based models?
- **Correct Answer**: `It severely biases towards features with high cardinality (many unique values) even if they are pure noise`
- **Key Takeaway**: Features with many unique values have more opportunities to split nodes and reduce impurity purely by chance, causing MDI to artificially inflate their importance.

### Question 2: What critical interview trap should candidates watch out for when discussing "MDI Importance vs SHAP Values"?
- **Correct Answer**: `If you add a completely random column of continuous numbers to a Random Forest, default MDI will ran...`
- **Key Takeaway**: Senior insight: If you add a completely random column of continuous numbers to a Random Forest, default MDI will rank it among the top most important features! Always use Permu... Always call out this failure mode proactively in interviews.

### Question 3: When evaluating "MDI Importance vs SHAP Values" under heavy class imbalance (e.g., 99.5% negative class), which metric is most deceptive?
- **Correct Answer**: `Raw Accuracy (which can be 99.5% simply by predicting the majority class for every sample)`
- **Key Takeaway**: A naive classifier predicting 'No Fraud' 100% of the time achieves 99.5% accuracy. Never evaluate imbalanced models with accuracy; use PR-AUC or F-beta.

### Question 4: How does "MDI Importance vs SHAP Values" impact the Bias-Variance tradeoff?
- **Correct Answer**: `Increasing model capacity reduces training bias but increases variance on unseen validation splits`
- **Key Takeaway**: Underfitting exhibits high bias; overfitting exhibits high variance. Calibrating regularization or depth finds the optimal irreducible error boundary.

### Question 5: What form of data leakage is most frequently introduced when implementing "MDI Importance vs SHAP Values"?
- **Correct Answer**: `Calculating feature statistics (mean, scaling, target encoding) across the entire dataset before train-test splitting`
- **Key Takeaway**: Leakage occurs whenever information from the validation or test fold contaminates training feature engineering. Transformations must be strictly fit on training folds only.

### Question 6: In production pipelines, how can data drift degrade "MDI Importance vs SHAP Values" post-deployment?
- **Correct Answer**: `Covariate shift: the underlying distribution of input features P(X) changes over time while the true relationship P(Y|X) may shift (concept drift)`
- **Key Takeaway**: Real-world consumer behavior shifts over time. Monitoring Population Stability Index (PSI) or Kolmogorov-Smirnov statistics detects drift before performance collapses.

### Question 7: According to A Unified Approach to Interpreting Model Predictions (Lundberg & Lee, NeurIPS 2017), what mathematical objective does this method optimize?
- **Correct Answer**: `A convex or surrogate loss function (e.g. log-loss, squared error) that approximates true empirical risk`
- **Key Takeaway**: Because zero-one loss is non-differentiable and NP-hard, machine learning algorithms optimize smooth surrogate loss functions using gradient descent.

### Question 8: How should you explain the trade-offs of "MDI Importance vs SHAP Values" to non-technical business stakeholders?
- **Correct Answer**: `Frame the trade-off in terms of false positives vs false negatives: cost of lost customers vs cost of fraudulent transactions`
- **Key Takeaway**: Executive communication requires mapping statistical precision/recall trade-offs directly into financial P&L impact and customer experience friction.

---

## Deep Research & Reading
- **Resource**: [A Unified Approach to Interpreting Model Predictions (Lundberg & Lee, NeurIPS 2017)](https://arxiv.org/abs/1705.07874)
- **Authority**: `arXiv:1705.07874`

---
*Generated with DS Roulette | Practice daily to build mastery.*
