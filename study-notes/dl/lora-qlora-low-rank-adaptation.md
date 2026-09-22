# LoRA & QLoRA: Low-Rank Adaptation
> **Discipline**: DL  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Instead of updating a huge weight matrix W (d x d), LoRA freezes W and adds a low-rank decomposition: ΔW = B × A, where B is (d x r) and A is (r x d) with rank r << d (e.g. r=8 or 16). QLoRA goes further by quantizing the base model W to 4-bit NormalFloat (NF4).

---

## The Interview Trap & Senior Insight
Interviewers will ask: 'Does LoRA increase inference latency?'. The senior answer is NO: during inference in production, you can fold the low-rank delta weights ΔW directly into the frozen base weights W_merged = W + (alpha/r) * (B × A), yielding zero added latency or extra matrix multiplies.

---

## Technical Implementation
```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

# Configure Low-Rank Adaptation
lora_config = LoraConfig(
    r=16,                         # Rank: dimension of bottleneck
    lora_alpha=32,                # Scaling factor (alpha / r)
    target_modules=["q_proj", "v_proj"], # Which projection layers to adapt
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# Wraps base model: Only ~0.1% of weights are trainable!
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B")
peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()
```

## Interview Drill Check (8 Questions)

### Question 1: If base matrix W is 4096 x 4096 (~16.7M weights) and LoRA rank r=16, how many trainable weights does the LoRA adapter have?
- **Correct Answer**: `131,072 (0.78%)`
- **Key Takeaway**: B is (4096 x 16) = 65,536 and A is (16 x 4096) = 65,536. Total trainable weights = 131,072, over a 99% parameter reduction.

### Question 2: What critical interview trap should candidates watch out for when discussing "LoRA & QLoRA: Low-Rank Adaptation"?
- **Correct Answer**: `Interviewers will ask: 'Does LoRA increase inference latency?'. The senior answer is NO: during infe...`
- **Key Takeaway**: Senior insight: Interviewers will ask: 'Does LoRA increase inference latency?'. The senior answer is NO: during inference in production, you can fold the low-rank delta weights... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "LoRA & QLoRA: Low-Rank Adaptation" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "LoRA & QLoRA: Low-Rank Adaptation", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "LoRA & QLoRA: Low-Rank Adaptation", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., ICLR 2022), what architectural design makes "LoRA & QLoRA: Low-Rank Adaptation" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "LoRA & QLoRA: Low-Rank Adaptation", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "LoRA & QLoRA: Low-Rank Adaptation"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., ICLR 2022)](https://arxiv.org/abs/2106.09685)
- **Authority**: `arXiv:2106.09685`

---
*Generated with DS Roulette | Practice daily to build mastery.*
