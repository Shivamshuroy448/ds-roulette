# Bias-Variance Tradeoff Analysis

Mathematical decomposition of expected prediction error:
$$\mathbb{E}[(y - \hat{f}(x))^2] = \text{Bias}[\hat{f}(x)]^2 + \text{Var}[\hat{f}(x)] + \sigma^2$$
* **Bias**: Error due to overly simplistic model assumptions (underfitting).
* **Variance**: Error due to excessive sensitivity to training set fluctuations (overfitting).
* **Irreducible Error ($\sigma^2$)**: Inherent noise in the data generating process.
