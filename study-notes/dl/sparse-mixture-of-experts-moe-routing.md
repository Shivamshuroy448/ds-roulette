# Sparse Mixture of Experts (MoE) & Routing
> **Discipline**: DL  
> **Difficulty**: Advanced | **Estimated Time**: 4 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Instead of passing every token through one massive Feed-Forward Network (FFN), an MoE layer contains multiple specialized 'experts' (e.g. 8 independent FFNs). A lightweight gating router dynamically computes softmax weights and directs each token to only top-k (typically top-2) experts. A model can have 47B total parameters while only activating 13B per token.

---

## The Interview Trap & Senior Insight
Watch out for 'Expert Collapse' (routing imbalance)! Without an auxiliary load-balancing loss, the router will send 90% of tokens to the same 2 experts, leaving the others untrained. Interviewers test whether you know how auxiliary entropy losses maintain equal expert load.

---

## Technical Implementation
```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class Top2MoERouter(nn.Module):
    def __init__(self, d_model, num_experts=8):
        super().__init__()
        self.gate = nn.Linear(d_model, num_experts, bias=False)
        
    def forward(self, x):
        # x: [batch, seq_len, d_model]
        logits = self.gate(x)
        top2_weights, top2_indices = torch.topk(logits, k=2, dim=-1)
        # Normalize routing weights across the chosen top-2 experts
        top2_probs = F.softmax(top2_weights, dim=-1)
        return top2_probs, top2_indices

router = Top2MoERouter(d_model=512, num_experts=8)
x_tokens = torch.randn(1, 4, 512)
probs, indices = router(x_tokens)
print("Chosen expert indices per token:\n", indices[0])
```

## Interview Drill Check (8 Questions)

### Question 1: What is the primary operational trade-off of a Sparse Mixture of Experts (MoE) model compared to a dense model with equal active parameters?
- **Correct Answer**: `MoE models require far more total VRAM to store all expert weights in memory, even though per-token FLOPs are low`
- **Key Takeaway**: While inference compute (FLOPs) is determined by active parameters (e.g. 13B), GPU VRAM must host all 47B parameters across all experts simultaneously.

### Question 2: What critical interview trap should candidates watch out for when discussing "Sparse Mixture of Experts (MoE) & Routing"?
- **Correct Answer**: `Watch out for 'Expert Collapse' (routing imbalance)! Without an auxiliary load-balancing loss, the r...`
- **Key Takeaway**: Senior insight: Watch out for 'Expert Collapse' (routing imbalance)! Without an auxiliary load-balancing loss, the router will send 90% of tokens to the same 2 experts, leaving... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "Sparse Mixture of Experts (MoE) & Routing" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "Sparse Mixture of Experts (MoE) & Routing", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "Sparse Mixture of Experts (MoE) & Routing", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer (Shazeer et al., ICLR 2017), what architectural design makes "Sparse Mixture of Experts (MoE) & Routing" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "Sparse Mixture of Experts (MoE) & Routing", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "Sparse Mixture of Experts (MoE) & Routing"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer (Shazeer et al., ICLR 2017)](https://arxiv.org/abs/1701.06538)
- **Authority**: `arXiv:1701.06538`

---
*Generated with DS Roulette | Practice daily to build mastery.*
