# Machine Learning Drills

Key mathematical derivations, decision boundary edge cases, and algorithm trade-offs.

## 1. Logistic Regression Odds and Logits
Derive the relationship between probability and log-odds:
$$\text{logit}(p) = \ln\left(\frac{p}{1-p}\right) = w^T x + b$$
$$p = \sigma(z) = \frac{1}{1 + e^{-z}}$$

## 2. Decision Tree Split Criterion Comparison
* **Gini Impurity**: $I_G = 1 - \sum_{i=1}^C p_i^2$ (faster, bounded in $[0, 0.5]$ for binary).
* **Entropy**: $H(S) = -\sum_{i=1}^C p_i \log_2(p_i)$ (penalizes mixed distributions more steeply).
