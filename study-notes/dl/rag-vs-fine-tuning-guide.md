# RAG vs Fine-Tuning Guide
> **Discipline**: DL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
RAG is like giving the student an open textbook during an exam (retrieving dynamic, up-to-date factual documents at query time). Fine-Tuning is like enrolling the student in med school for 2 years (baking domain jargon, tone, format, and behavior directly into neural network weights).

---

## The Interview Trap & Senior Insight
Candidates reflexively say 'Fine-tune an LLM on our company wiki'. Fine-tuning is terrible for facts - models still hallucinate and retraining every time a wiki page updates is impossible. Use RAG for external dynamic knowledge; use Fine-tuning for style, structure, or tiny specialized models.

---

## Technical Implementation
```python
# Rule of Thumb Architecture Decision:
# 1. Need fresh/private data? -> RAG (Vector DB: Pinecone, Qdrant, Chroma)
# 2. Need strict JSON formatting / unique persona? -> Fine-tuning (LoRA / QLoRA)
# 3. Best production practice: Hybrid (RAG retrieval + Fine-tuned small model)

def select_architecture(need_realtime_data, need_specialized_format):
    if need_realtime_data:
        return "RAG with Vector Search"
    elif need_specialized_format:
        return "LoRA Fine-Tuning on 1K curated examples"
    return "Prompt Engineering (Few-Shot)"
```

## Interview Drill Check (8 Questions)

### Question 1: Why is Fine-Tuning generally ill-suited as a solution for keeping an LLM updated with daily company documents?
- **Correct Answer**: `Fine-tuned weights can still hallucinate facts and continuous retraining is expensive and slow compared to vector retrieval`
- **Key Takeaway**: Fine-tuning modifies parametric memory, which is prone to hallucinations and slow/costly to update, whereas RAG dynamically fetches ground truth directly into the prompt context.

### Question 2: What critical interview trap should candidates watch out for when discussing "RAG vs Fine-Tuning Guide"?
- **Correct Answer**: `Candidates reflexively say 'Fine-tune an LLM on our company wiki'. Fine-tuning is terrible for facts...`
- **Key Takeaway**: Senior insight: Candidates reflexively say 'Fine-tune an LLM on our company wiki'. Fine-tuning is terrible for facts - models still hallucinate and retraining every time a wiki p... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "RAG vs Fine-Tuning Guide" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "RAG vs Fine-Tuning Guide", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "RAG vs Fine-Tuning Guide", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., NeurIPS 2020), what architectural design makes "RAG vs Fine-Tuning Guide" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "RAG vs Fine-Tuning Guide", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "RAG vs Fine-Tuning Guide"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., NeurIPS 2020)](https://arxiv.org/abs/2005.11401)
- **Authority**: `arXiv:2005.11401`

---
*Generated with DS Roulette | Practice daily to build mastery.*
