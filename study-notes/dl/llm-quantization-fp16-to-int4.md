# LLM Quantization: FP16 to INT4
> **Discipline**: DL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Standard model weights use 16-bit floating point (FP16), taking 2 bytes per parameter (70B params = ~140GB VRAM). Quantization maps continuous floats to discrete integers (INT8 = 1 byte, INT4 = 0.5 bytes), compressing a 70B model down to ~35GB VRAM with near-zero perplexity loss.

---

## The Interview Trap & Senior Insight
Don't say 'Quantization makes training faster'. Post-training quantization (AWQ, GPTQ, GGUF) is used primarily to reduce inference VRAM footprint and memory-bandwidth bottlenecks (since LLM text generation is memory-bandwidth bound, not compute bound).

---

## Technical Implementation
```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

# 4-bit NormalFloat (NF4) quantization configuration
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True # Quantizes quantization constants to save 0.4 bits/param!
)

# Loads 8B model in only ~5.5 GB VRAM instead of 16 GB
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3-8B",
    quantization_config=bnb_config,
    device_map="auto"
)
```

## Interview Drill Check (8 Questions)

### Question 1: In standard autoregressive token-by-token generation (batch size = 1), what is the primary hardware bottleneck for LLMs?
- **Correct Answer**: `Memory bandwidth (transferring billions of weights from VRAM to compute cores on every token)`
- **Key Takeaway**: Generating tokens sequentially requires streaming all model weights through memory for each single token generated, making memory bandwidth the critical bottleneck.

### Question 2: What critical interview trap should candidates watch out for when discussing "LLM Quantization: FP16 to INT4"?
- **Correct Answer**: `Don't say 'Quantization makes training faster'. Post-training quantization (AWQ, GPTQ, GGUF) is used...`
- **Key Takeaway**: Senior insight: Don't say 'Quantization makes training faster'. Post-training quantization (AWQ, GPTQ, GGUF) is used primarily to reduce inference VRAM footprint and memory-ban... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "LLM Quantization: FP16 to INT4" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "LLM Quantization: FP16 to INT4", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "LLM Quantization: FP16 to INT4", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to QLoRA: Efficient Finetuning of Quantized LLMs (Dettmers et al., NeurIPS 2023), what architectural design makes "LLM Quantization: FP16 to INT4" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "LLM Quantization: FP16 to INT4", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "LLM Quantization: FP16 to INT4"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [QLoRA: Efficient Finetuning of Quantized LLMs (Dettmers et al., NeurIPS 2023)](https://arxiv.org/abs/2305.14314)
- **Authority**: `arXiv:2305.14314`

---
*Generated with DS Roulette | Practice daily to build mastery.*
