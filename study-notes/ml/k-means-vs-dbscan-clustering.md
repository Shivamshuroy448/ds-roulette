# K-Means vs DBSCAN Clustering
> **Discipline**: ML  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
K-Means assigns points to the nearest of K pre-defined cluster centroids (assumes clusters are circular/spherical blobs of similar size). DBSCAN looks for regions of high density: points with at least MinPts within radius eps, automatically discovering clusters of arbitrary non-linear shapes while labeling noise as outliers.

---

## The Interview Trap & Senior Insight
K-Means forces every single point - including extreme outliers - into a cluster, which drags centroids away from true centers. DBSCAN naturally identifies outliers by labeling sparse points as noise (-1). However, DBSCAN struggles when clusters have varying densities.

---

## Technical Implementation
```python
from sklearn.cluster import KMeans, DBSCAN

# K-Means: Requires K upfront, sensitive to scale & outliers
kmeans = KMeans(n_clusters=3, random_state=42)
labels_km = kmeans.fit_predict(X_scaled)

# DBSCAN: Discovers cluster count, finds noise points (-1)
dbscan = DBSCAN(eps=0.5, min_samples=5)
labels_db = dbscan.fit_predict(X_scaled)
n_noise = list(labels_db).count(-1)
print(f"DBSCAN flagged {n_noise} anomaly outliers.")
```

## Interview Drill Check (8 Questions)

### Question 1: Which clustering algorithm can successfully separate two concentric rings of data (inner circle and outer circle)?
- **Correct Answer**: `DBSCAN`
- **Key Takeaway**: DBSCAN clusters by spatial density connectivity, easily discovering non-convex shapes like concentric rings that centroid-based K-Means fails to split.

### Question 2: What critical interview trap should candidates watch out for when discussing "K-Means vs DBSCAN Clustering"?
- **Correct Answer**: `K-Means forces every single point - including extreme outliers - into a cluster, which drags centroids a...`
- **Key Takeaway**: Senior insight: K-Means forces every single point - including extreme outliers - into a cluster, which drags centroids away from true centers. DBSCAN naturally identifies outliers ... Always call out this failure mode proactively in interviews.

### Question 3: When evaluating "K-Means vs DBSCAN Clustering" under heavy class imbalance (e.g., 99.5% negative class), which metric is most deceptive?
- **Correct Answer**: `Raw Accuracy (which can be 99.5% simply by predicting the majority class for every sample)`
- **Key Takeaway**: A naive classifier predicting 'No Fraud' 100% of the time achieves 99.5% accuracy. Never evaluate imbalanced models with accuracy; use PR-AUC or F-beta.

### Question 4: How does "K-Means vs DBSCAN Clustering" impact the Bias-Variance tradeoff?
- **Correct Answer**: `Increasing model capacity reduces training bias but increases variance on unseen validation splits`
- **Key Takeaway**: Underfitting exhibits high bias; overfitting exhibits high variance. Calibrating regularization or depth finds the optimal irreducible error boundary.

### Question 5: What form of data leakage is most frequently introduced when implementing "K-Means vs DBSCAN Clustering"?
- **Correct Answer**: `Calculating feature statistics (mean, scaling, target encoding) across the entire dataset before train-test splitting`
- **Key Takeaway**: Leakage occurs whenever information from the validation or test fold contaminates training feature engineering. Transformations must be strictly fit on training folds only.

### Question 6: In production pipelines, how can data drift degrade "K-Means vs DBSCAN Clustering" post-deployment?
- **Correct Answer**: `Covariate shift: the underlying distribution of input features P(X) changes over time while the true relationship P(Y|X) may shift (concept drift)`
- **Key Takeaway**: Real-world consumer behavior shifts over time. Monitoring Population Stability Index (PSI) or Kolmogorov-Smirnov statistics detects drift before performance collapses.

### Question 7: According to A Density-Based Algorithm for Discovering Clusters (Ester et al., KDD 1996), what mathematical objective does this method optimize?
- **Correct Answer**: `A convex or surrogate loss function (e.g. log-loss, squared error) that approximates true empirical risk`
- **Key Takeaway**: Because zero-one loss is non-differentiable and NP-hard, machine learning algorithms optimize smooth surrogate loss functions using gradient descent.

### Question 8: How should you explain the trade-offs of "K-Means vs DBSCAN Clustering" to non-technical business stakeholders?
- **Correct Answer**: `Frame the trade-off in terms of false positives vs false negatives: cost of lost customers vs cost of fraudulent transactions`
- **Key Takeaway**: Executive communication requires mapping statistical precision/recall trade-offs directly into financial P&L impact and customer experience friction.

---

## Deep Research & Reading
- **Resource**: [A Density-Based Algorithm for Discovering Clusters (Ester et al., KDD 1996)](https://www.aaai.org/Papers/KDD/1996/KDD96-037.pdf)
- **Authority**: `AAAI Proceedings`

---
*Generated with DS Roulette | Practice daily to build mastery.*
