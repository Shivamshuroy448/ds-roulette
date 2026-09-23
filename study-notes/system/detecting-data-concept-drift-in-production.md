# Detecting Data & Concept Drift in Production
> **Discipline**: SYSTEM  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Data Drift (Covariate Shift): Input features change distribution (e.g., users get younger after a marketing campaign). Concept Drift: The relationship between input features and target changes (e.g., buying patterns flip post-COVID). PSI (Population Stability Index) compares training distribution bins against production inference bins.

---

## The Interview Trap & Senior Insight
Interviewers ask: 'How do you know if your model is failing if ground truth labels take 60 days to arrive (e.g. loan defaults)?'. You cannot compute accuracy or ROC-AUC without ground truth! The senior answer is monitoring input feature distribution drift (PSI, KS-statistic, embedding drift) as an early warning proxy.

---

## Technical Implementation
```python
import numpy as np

def calculate_psi(expected, actual, num_buckets=10):
    # Quantile bins based on baseline training data
    percentiles = np.linspace(0, 100, num_buckets + 1)
    bins = np.percentile(expected, percentiles)
    
    # Calculate frequency proportions in each bin
    expected_cnt = np.histogram(expected, bins)[0] / len(expected)
    actual_cnt = np.histogram(actual, bins)[0] / len(actual)
    
    # Avoid zero division
    actual_cnt = np.where(actual_cnt == 0, 0.0001, actual_cnt)
    
    # PSI Formula: sum((actual - expected) * ln(actual / expected))
    psi = np.sum((actual_cnt - expected_cnt) * np.log(actual_cnt / expected_cnt))
    return psi
# PSI < 0.1: Stable. PSI > 0.25: Action required (retrain model)!
```

## Interview Drill Check (8 Questions)

### Question 1: A PSI (Population Stability Index) value greater than 0.25 between training and production inference typically indicates:
- **Correct Answer**: `Significant population distribution shift requiring model retraining or feature investigation`
- **Key Takeaway**: Industry standard benchmarks: PSI < 0.1 indicates no significant shift, 0.1-0.25 moderate shift, and > 0.25 significant shift requiring intervention.

### Question 2: What critical interview trap should candidates watch out for when discussing "Detecting Data & Concept Drift in Production"?
- **Correct Answer**: `Interviewers ask: 'How do you know if your model is failing if ground truth labels take 60 days to a...`
- **Key Takeaway**: Senior insight: Interviewers ask: 'How do you know if your model is failing if ground truth labels take 60 days to arrive (e.g. loan defaults)?'. You cannot compute accuracy or... Always call out this failure mode proactively in interviews.

### Question 3: When deploying "Detecting Data & Concept Drift in Production" to production, how do you handle online-offline feature consistency?
- **Correct Answer**: `Use a centralized Feature Store (e.g. Feast) with unified feature definitions for both batch training and real-time inference`
- **Key Takeaway**: Feature stores maintain a single source of feature transformation truth, serving low-latency key-value lookups online while maintaining point-in-time joins offline.

### Question 4: What latency SLA is typically required for real-time inference involving "Detecting Data & Concept Drift in Production" in production recommender and fraud systems?
- **Correct Answer**: `p99 < 50 milliseconds to avoid degrading user experience and timeouts`
- **Key Takeaway**: In consumer applications (search, feeds, checkout), end-to-end latency SLAs require model scoring and feature retrieval to complete well under 50-100ms at the 99th percentile.

### Question 5: How should you design the fallback strategy for "Detecting Data & Concept Drift in Production" if the primary machine learning service experiences an outage?
- **Correct Answer**: `Gracefully degrade to a high-speed cached heuristic, rule-based logic, or popular/trending items fallback`
- **Key Takeaway**: Production system design mandates graceful degradation. If an embedding model or ranker times out, the system should serve popularity or editorial fallbacks instantly.

### Question 6: According to A Survey on Concept Drift Adaptation (Lu et al., IEEE TKDE 2019), what is the primary cause of silent degradation in ML systems?
- **Correct Answer**: `Concept drift and data distribution shift where the model continues running without throwing errors while predictions lose real-world validity`
- **Key Takeaway**: Silent degradation is deadly because no alert or 500 status code triggers. Continuous metric evaluation and input distribution monitoring are essential.

### Question 7: In a technical system design interview, how should you size the hardware infrastructure for "Detecting Data & Concept Drift in Production"?
- **Correct Answer**: `Start with peak QPS, compute required FLOPS and memory bandwidth per query, and estimate cluster node count with a 2x redundancy buffer`
- **Key Takeaway**: Interviewers look for back-of-the-envelope calculations: QPS * latency = concurrent workers, translated into memory footprint and GPU/CPU sizing.

### Question 8: How do shadow deployments (dark launches) protect production systems implementing "Detecting Data & Concept Drift in Production"?
- **Correct Answer**: `They route duplicate live production traffic to the new model to verify latency and stability without returning its predictions to users`
- **Key Takeaway**: Shadow deployments mirror real production traffic to stress-test throughput, resource saturation, and inference accuracy before exposing real users to the new model.

---

## Deep Research & Reading
- **Resource**: [A Survey on Concept Drift Adaptation (Lu et al., IEEE TKDE 2019)](https://arxiv.org/abs/2004.05785)
- **Authority**: `IEEE Xplore / arXiv:2004.05785`

---
*Generated with DS Roulette | Practice daily to build mastery.*
