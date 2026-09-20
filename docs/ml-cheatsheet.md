# Machine Learning Algorithm Cheat Sheet

Comparative reference matrix of common supervised and unsupervised algorithms.

| Algorithm | Assumptions | Handling Missing Data | Outlier Sensitivity | Primary Hyperparameters |
| :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | Linearity of log-odds, no multicollinearity | Requires imputation | Sensitive | Regularization (C, penalty) |
| **Random Forest** | None (non-parametric) | Native via surrogate splits | Robust | n_estimators, max_depth, min_samples_split |
| **XGBoost** | None (gradient boosting) | Native default branch handling | Moderate | learning_rate, max_depth, subsample, colsample_bytree |
| **SVM** | Separability in kernel space | Requires imputation | Highly sensitive near margin | C, kernel, gamma |
