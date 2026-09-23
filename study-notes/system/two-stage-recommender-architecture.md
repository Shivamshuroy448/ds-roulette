# Two-Stage Recommender Architecture
> **Discipline**: SYSTEM  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
You have 100 million items on TikTok or Netflix. You cannot run a billion-parameter neural network on 100M items within 20 milliseconds! Solution: Stage 1 (Candidate Retrieval) uses fast approximate vector search or matrix factorization to slash 100M down to 500 items in 5ms. Stage 2 (Heavy Ranker) runs a deep cross-feature model on only those 500 items.

---

## The Interview Trap & Senior Insight
Junior candidates propose running a Transformer over all products in the catalog. Senior candidates explain the computational latency budget: 'Stage 1 prioritizes Recall over millions of candidates; Stage 2 optimizes Precision/NDCG over hundreds of candidates.'

---

## Technical Implementation
```python
# Recommender Pipeline Topology:
# 10,000,000 Catalog Items
#      ↓  [Stage 1: Retrieval (Vector ANN / Two-Tower / Graph)] (Recall: 95%, Latency: 5ms)
#   500 Candidates
#      ↓  [Stage 2: Ranking (DLRM / DeepFM / CatBoost)] (Latency: 15ms)
#    50 Ranked Candidates
#      ↓  [Stage 3: Re-ranking (Diversity / Deduplication / Freshness)] (Latency: 2ms)
#    10 Served to User
```

## Interview Drill Check (8 Questions)

### Question 1: What is the primary evaluation metric optimized during Stage 1 (Candidate Generation)?
- **Correct Answer**: `High Recall@500 (ensuring the true relevant items are not filtered out)`
- **Key Takeaway**: If an item isn't captured in the top 500 retrieval stage, the ranker will never even see it. High Recall is paramount in Stage 1.

### Question 2: What critical interview trap should candidates watch out for when discussing "Two-Stage Recommender Architecture"?
- **Correct Answer**: `Junior candidates propose running a Transformer over all products in the catalog. Senior candidates ...`
- **Key Takeaway**: Senior insight: Junior candidates propose running a Transformer over all products in the catalog. Senior candidates explain the computational latency budget: 'Stage 1 prioritiz... Always call out this failure mode proactively in interviews.

### Question 3: When deploying "Two-Stage Recommender Architecture" to production, how do you handle online-offline feature consistency?
- **Correct Answer**: `Use a centralized Feature Store (e.g. Feast) with unified feature definitions for both batch training and real-time inference`
- **Key Takeaway**: Feature stores maintain a single source of feature transformation truth, serving low-latency key-value lookups online while maintaining point-in-time joins offline.

### Question 4: What latency SLA is typically required for real-time inference involving "Two-Stage Recommender Architecture" in production recommender and fraud systems?
- **Correct Answer**: `p99 < 50 milliseconds to avoid degrading user experience and timeouts`
- **Key Takeaway**: In consumer applications (search, feeds, checkout), end-to-end latency SLAs require model scoring and feature retrieval to complete well under 50-100ms at the 99th percentile.

### Question 5: How should you design the fallback strategy for "Two-Stage Recommender Architecture" if the primary machine learning service experiences an outage?
- **Correct Answer**: `Gracefully degrade to a high-speed cached heuristic, rule-based logic, or popular/trending items fallback`
- **Key Takeaway**: Production system design mandates graceful degradation. If an embedding model or ranker times out, the system should serve popularity or editorial fallbacks instantly.

### Question 6: According to Deep Neural Networks for YouTube Recommendations (Covington et al., ACM RecSys 2016), what is the primary cause of silent degradation in ML systems?
- **Correct Answer**: `Concept drift and data distribution shift where the model continues running without throwing errors while predictions lose real-world validity`
- **Key Takeaway**: Silent degradation is deadly because no alert or 500 status code triggers. Continuous metric evaluation and input distribution monitoring are essential.

### Question 7: In a technical system design interview, how should you size the hardware infrastructure for "Two-Stage Recommender Architecture"?
- **Correct Answer**: `Start with peak QPS, compute required FLOPS and memory bandwidth per query, and estimate cluster node count with a 2x redundancy buffer`
- **Key Takeaway**: Interviewers look for back-of-the-envelope calculations: QPS * latency = concurrent workers, translated into memory footprint and GPU/CPU sizing.

### Question 8: How do shadow deployments (dark launches) protect production systems implementing "Two-Stage Recommender Architecture"?
- **Correct Answer**: `They route duplicate live production traffic to the new model to verify latency and stability without returning its predictions to users`
- **Key Takeaway**: Shadow deployments mirror real production traffic to stress-test throughput, resource saturation, and inference accuracy before exposing real users to the new model.

---

## Deep Research & Reading
- **Resource**: [Deep Neural Networks for YouTube Recommendations (Covington et al., ACM RecSys 2016)](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/)
- **Authority**: `Google Research`

---
*Generated with DS Roulette | Practice daily to build mastery.*
