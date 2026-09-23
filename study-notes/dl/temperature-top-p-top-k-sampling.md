# Temperature, Top-P & Top-K Sampling
> **Discipline**: DL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Temperature flattens or sharpens token probability distribution: T=0 is deterministic greedy search, while high T makes rare words more probable. Top-K restricts selection to the K highest-probability tokens. Top-P (nucleus sampling) dynamically selects the smallest set of tokens whose cumulative probability reaches P (e.g. 0.9).

---

## The Interview Trap & Senior Insight
Candidates think Temperature=0 guarantees 100% exact reproducible outputs across all API providers. In production, batched GPU execution, non-deterministic CUDA floating-point reductions, and MoE (Mixture of Experts) routing can still cause subtle token variations unless seeds are pinned with system finger-printing.

---

## Technical Implementation
```python
import torch
import torch.nn.functional as F

def sample_tokens(logits, temperature=0.7, top_p=0.9):
    # 1. Scale logits by temperature
    scaled_logits = logits / temperature
    probs = F.softmax(scaled_logits, dim=-1)
    
    # 2. Sort probabilities for Top-P (Nucleus)
    sorted_probs, sorted_indices = torch.sort(probs, descending=True)
    cumulative_probs = torch.cumsum(sorted_probs, dim=-1)
    
    # 3. Remove tokens outside cumulative nucleus
    sorted_indices_to_remove = cumulative_probs > top_p
    # Shift right to keep at least the first token
    sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
    sorted_indices_to_remove[..., 0] = 0
    
    # Re-normalize & sample
    sorted_probs[sorted_indices_to_remove] = 0
    return torch.multinomial(sorted_probs, num_samples=1)
```

## Interview Drill Check (8 Questions)

### Question 1: Why is Top-P (Nucleus Sampling) usually preferred over fixed Top-K in open-ended text generation?
- **Correct Answer**: `Top-P dynamically expands or contracts candidate size based on how confident the model is at each step`
- **Key Takeaway**: When probability is concentrated on one obvious word, Top-P selects only 1-2 tokens. When probability is flat, Top-P dynamically considers 50+ candidates.

### Question 2: What critical interview trap should candidates watch out for when discussing "Temperature, Top-P & Top-K Sampling"?
- **Correct Answer**: `Candidates think Temperature=0 guarantees 100% exact reproducible outputs across all API providers. ...`
- **Key Takeaway**: Senior insight: Candidates think Temperature=0 guarantees 100% exact reproducible outputs across all API providers. In production, batched GPU execution, non-deterministic CUDA... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "Temperature, Top-P & Top-K Sampling" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "Temperature, Top-P & Top-K Sampling", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "Temperature, Top-P & Top-K Sampling", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to The Curious Case of Neural Text Degeneration: Nucleus Sampling (Holtzman et al., ICLR 2020), what architectural design makes "Temperature, Top-P & Top-K Sampling" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "Temperature, Top-P & Top-K Sampling", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "Temperature, Top-P & Top-K Sampling"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [The Curious Case of Neural Text Degeneration: Nucleus Sampling (Holtzman et al., ICLR 2020)](https://arxiv.org/abs/1904.09751)
- **Authority**: `arXiv:1904.09751`

---
*Generated with DS Roulette | Practice daily to build mastery.*
