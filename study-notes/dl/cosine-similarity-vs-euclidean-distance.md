# Cosine Similarity vs Euclidean Distance
> **Discipline**: DL  
> **Difficulty**: Intermediate | **Estimated Time**: 2 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Cosine similarity measures the angle between two vectors regardless of their length (direction only). Euclidean distance measures straight-line distance (length matters). In text embeddings, Cosine similarity ensures a 10-word document and a 1000-word document discussing the exact same topic score as nearly identical.

---

## The Interview Trap & Senior Insight
When building RAG (Retrieval-Augmented Generation) systems, if your vector database normalizes embeddings to unit length (L2 norm = 1), Cosine Similarity and Euclidean Distance produce the exact same rankings!

---

## Technical Implementation
```python
import numpy as np

def cosine_similarity(a, b):
    # Dot product divided by magnitudes
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# If vectors are pre-normalized:
norm_a = a / np.linalg.norm(a)
norm_b = b / np.linalg.norm(b)
dot_score = np.dot(norm_a, norm_b) # Instant cosine similarity!
```

## Interview Drill Check (8 Questions)

### Question 1: If two vectors point in exactly the same direction but vector B is 10x longer than vector A, their Cosine Similarity is:
- **Correct Answer**: `1.0`
- **Key Takeaway**: Cosine similarity only evaluates the angle between vectors (cos(0°) = 1.0), completely ignoring differences in magnitude.

### Question 2: What critical interview trap should candidates watch out for when discussing "Cosine Similarity vs Euclidean Distance"?
- **Correct Answer**: `When building RAG (Retrieval-Augmented Generation) systems, if your vector database normalizes embed...`
- **Key Takeaway**: Senior insight: When building RAG (Retrieval-Augmented Generation) systems, if your vector database normalizes embeddings to unit length (L2 norm = 1), Cosine Similarity and Eu... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "Cosine Similarity vs Euclidean Distance" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "Cosine Similarity vs Euclidean Distance", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "Cosine Similarity vs Euclidean Distance", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to Billion-Scale Similarity Search with GPUs (Johnson, Douze, Jégou / FAISS), what architectural design makes "Cosine Similarity vs Euclidean Distance" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "Cosine Similarity vs Euclidean Distance", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "Cosine Similarity vs Euclidean Distance"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [Billion-Scale Similarity Search with GPUs (Johnson, Douze, Jégou / FAISS)](https://arxiv.org/abs/1702.08734)
- **Authority**: `IEEE / arXiv:1702.08734`

---
*Generated with DS Roulette | Practice daily to build mastery.*
