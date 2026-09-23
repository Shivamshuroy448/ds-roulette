# Detecting Silent Data Leakage
> **Discipline**: SYSTEM  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Data leakage happens when information from the future (or target variable) accidentally leaks into training features. For example, scaling features using the entire dataset's mean before splitting into train/test, or including a customer's 'account cancellation timestamp' when predicting churn.

---

## The Interview Trap & Senior Insight
If your model achieves 99.8% accuracy on the first epoch, don't celebrate - suspect data leakage. Always fit transformers/scalers ONLY on training data, and transform validation data.

---

## Technical Implementation
```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

# PROPER PIPELINE: Scaler is fit ONLY on training folds during cross-validation
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier())
])

# Never do this:
# X_scaled = StandardScaler().fit_transform(X) # <-- LEAKAGE: test distribution leaked into scaler!
# X_train, X_test = train_test_split(X_scaled)
```

## Interview Drill Check (8 Questions)

### Question 1: Which of the following is a classic example of target leakage in customer churn prediction?
- **Correct Answer**: `Including 'Reason for Refund' as an input feature`
- **Key Takeaway**: A 'Reason for Refund' only exists after a user decides to leave/complain, leaking post-outcome information into predictive inputs.

### Question 2: What critical interview trap should candidates watch out for when discussing "Detecting Silent Data Leakage"?
- **Correct Answer**: `If your model achieves 99.8% accuracy on the first epoch, don't celebrate - suspect data leakage. Alwa...`
- **Key Takeaway**: Senior insight: If your model achieves 99.8% accuracy on the first epoch, don't celebrate - suspect data leakage. Always fit transformers/scalers ONLY on training data, and trans... Always call out this failure mode proactively in interviews.

### Question 3: When deploying "Detecting Silent Data Leakage" to production, how do you handle online-offline feature consistency?
- **Correct Answer**: `Use a centralized Feature Store (e.g. Feast) with unified feature definitions for both batch training and real-time inference`
- **Key Takeaway**: Feature stores maintain a single source of feature transformation truth, serving low-latency key-value lookups online while maintaining point-in-time joins offline.

### Question 4: What latency SLA is typically required for real-time inference involving "Detecting Silent Data Leakage" in production recommender and fraud systems?
- **Correct Answer**: `p99 < 50 milliseconds to avoid degrading user experience and timeouts`
- **Key Takeaway**: In consumer applications (search, feeds, checkout), end-to-end latency SLAs require model scoring and feature retrieval to complete well under 50-100ms at the 99th percentile.

### Question 5: How should you design the fallback strategy for "Detecting Silent Data Leakage" if the primary machine learning service experiences an outage?
- **Correct Answer**: `Gracefully degrade to a high-speed cached heuristic, rule-based logic, or popular/trending items fallback`
- **Key Takeaway**: Production system design mandates graceful degradation. If an embedding model or ranker times out, the system should serve popularity or editorial fallbacks instantly.

### Question 6: According to Advances in Financial Machine Learning: Cross-Validation & Leakage (Marcos Lopez de Prado), what is the primary cause of silent degradation in ML systems?
- **Correct Answer**: `Concept drift and data distribution shift where the model continues running without throwing errors while predictions lose real-world validity`
- **Key Takeaway**: Silent degradation is deadly because no alert or 500 status code triggers. Continuous metric evaluation and input distribution monitoring are essential.

### Question 7: In a technical system design interview, how should you size the hardware infrastructure for "Detecting Silent Data Leakage"?
- **Correct Answer**: `Start with peak QPS, compute required FLOPS and memory bandwidth per query, and estimate cluster node count with a 2x redundancy buffer`
- **Key Takeaway**: Interviewers look for back-of-the-envelope calculations: QPS * latency = concurrent workers, translated into memory footprint and GPU/CPU sizing.

### Question 8: How do shadow deployments (dark launches) protect production systems implementing "Detecting Silent Data Leakage"?
- **Correct Answer**: `They route duplicate live production traffic to the new model to verify latency and stability without returning its predictions to users`
- **Key Takeaway**: Shadow deployments mirror real production traffic to stress-test throughput, resource saturation, and inference accuracy before exposing real users to the new model.

---

## Deep Research & Reading
- **Resource**: [Common Pitfalls & Data Leakage Prevention in Machine Learning Pipelines](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
- **Authority**: `Scikit-Learn Official User Guide`

---
*Generated with DS Roulette | Practice daily to build mastery.*
