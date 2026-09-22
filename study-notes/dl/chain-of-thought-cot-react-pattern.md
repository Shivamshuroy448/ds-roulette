# Chain-of-Thought (CoT) & ReAct Pattern
> **Discipline**: DL  
> **Difficulty**: Beginner | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Transformers generate text left-to-right without 'thinking before speaking'. Chain-of-Thought prompts ('Let\'s think step by step') force the model to output intermediate reasoning tokens, giving the attention heads scratchpad space to compute complex logic. ReAct extends this by interleaving Reasoning and Tool Actions.

---

## The Interview Trap & Senior Insight
If you ask an LLM directly for the final numerical answer, it has to predict the final token in a single forward pass. Giving it scratchpad tokens gives subsequent layers access to intermediate calculations in their causal attention window.

---

## Technical Implementation
```python
# ReAct Pattern Loop:
# Thought: What do I need to know?
# Action: Search[query]
# Observation: [Tool output returned]
# Thought: How does this help answer?
# Final Answer: Conclusion

prompt = """
Question: What is the current stock price of Apple divided by its PE ratio?
Thought: I need to first retrieve the current stock price and PE ratio of AAPL.
Action: get_financial_metrics("AAPL")
Observation: price=$225.50, pe_ratio=34.2
Thought: Now I calculate 225.50 / 34.2 = 6.59
Final Answer: 6.59
"""
```

## Interview Drill Check (8 Questions)

### Question 1: Why does Chain-of-Thought (CoT) prompting mathematically improve performance on math and multi-step reasoning tasks?
- **Correct Answer**: `It generates intermediate tokens that subsequent tokens can attend to, distributing computation across multiple forward passes`
- **Key Takeaway**: Autoregressive generation can only spend a fixed amount of computation per token. Outputting intermediate steps allows the model to chain multiple forward passes together.

### Question 2: What critical interview trap should candidates watch out for when discussing "Chain-of-Thought (CoT) & ReAct Pattern"?
- **Correct Answer**: `If you ask an LLM directly for the final numerical answer, it has to predict the final token in a si...`
- **Key Takeaway**: Senior insight: If you ask an LLM directly for the final numerical answer, it has to predict the final token in a single forward pass. Giving it scratchpad tokens gives subsequ... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "Chain-of-Thought (CoT) & ReAct Pattern" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "Chain-of-Thought (CoT) & ReAct Pattern", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "Chain-of-Thought (CoT) & ReAct Pattern", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (Wei et al., NeurIPS 2022), what architectural design makes "Chain-of-Thought (CoT) & ReAct Pattern" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "Chain-of-Thought (CoT) & ReAct Pattern", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "Chain-of-Thought (CoT) & ReAct Pattern"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (Wei et al., NeurIPS 2022)](https://arxiv.org/abs/2201.11903)
- **Authority**: `arXiv:2201.11903`

---
*Generated with DS Roulette | Practice daily to build mastery.*
