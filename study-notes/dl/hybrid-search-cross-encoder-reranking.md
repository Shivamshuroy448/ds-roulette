# Hybrid Search & Cross-Encoder Reranking
> **Discipline**: DL  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Vector search (dense embeddings) understands conceptual meaning but frequently misses exact part numbers, acronyms, or error codes. Hybrid Search combines Dense Vector similarity + Sparse Keyword Search (BM25) via Reciprocal Rank Fusion (RRF), then passes top-50 candidates through a Cross-Encoder to re-score precise relevance.

---

## The Interview Trap & Senior Insight
Bi-encoders (embedding models) compare query and document as separate isolated vectors. Cross-encoders pass query + document simultaneously through all transformer layers with full cross-attention. Cross-encoders are 10x more accurate but too slow to search a million docs - hence why we only use them as a second-stage reranker on the top 20-50 retrieved chunks.

---

## Technical Implementation
```python
from sentence_transformers import CrossEncoder

# Step 1: Hybrid retrieve top 30 chunks using BM25 + Vector DB
# Step 2: Cross-Encoder scores full query-document interaction
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

query = "How to configure DENSE_RANK partition in PostgreSQL?"
candidate_chunks = ["Doc A...", "Doc B...", "Doc C..."]

# Computes joint cross-attention scores
pairs = [[query, doc] for doc in candidate_chunks]
scores = reranker.predict(pairs)

# Sort by cross-encoder score:
ranked_results = sorted(zip(scores, candidate_chunks), reverse=True)
```

## Interview Drill Check (8 Questions)

### Question 1: Why cannot Cross-Encoders be used directly across an entire database of 10 million documents without a vector/BM25 first stage?
- **Correct Answer**: `Cross-encoders require joint quadratic attention over every query-doc pair at inference time, which cannot be pre-indexed into an approximate nearest neighbor (ANN) tree`
- **Key Takeaway**: Because cross-encoders require computing attention between query tokens and document tokens together, they cannot pre-compute offline document embeddings.

### Question 2: What critical interview trap should candidates watch out for when discussing "Hybrid Search & Cross-Encoder Reranking"?
- **Correct Answer**: `Bi-encoders (embedding models) compare query and document as separate isolated vectors. Cross-encode...`
- **Key Takeaway**: Senior insight: Bi-encoders (embedding models) compare query and document as separate isolated vectors. Cross-encoders pass query + document simultaneously through all transfor... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "Hybrid Search & Cross-Encoder Reranking" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "Hybrid Search & Cross-Encoder Reranking", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "Hybrid Search & Cross-Encoder Reranking", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to Lost in the Middle: How Language Models Use Long Contexts (Liu et al., TACL 2024), what architectural design makes "Hybrid Search & Cross-Encoder Reranking" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "Hybrid Search & Cross-Encoder Reranking", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "Hybrid Search & Cross-Encoder Reranking"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [Lost in the Middle: How Language Models Use Long Contexts (Liu et al., TACL 2024)](https://arxiv.org/abs/2307.03172)
- **Authority**: `arXiv:2307.03172`

---
*Generated with DS Roulette | Practice daily to build mastery.*
