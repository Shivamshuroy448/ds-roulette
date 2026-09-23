# ML System Design Drills

Production architectures, latency budgets, and real-time inference topologies.

## 1. Two-Stage Recommendation Architecture
1. **Candidate Retrieval (Recall)**: ANN search over millions of items with sub-10ms latency using ScaNN or HNSW embeddings.
2. **Heavy Ranking**: Deep ranking network (e.g., DLRM) evaluating top 500 candidates with cross-features, context, and diversity constraints.
