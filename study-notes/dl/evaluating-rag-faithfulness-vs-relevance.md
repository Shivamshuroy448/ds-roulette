# Evaluating RAG: Faithfulness vs Relevance
> **Discipline**: DL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
You cannot evaluate RAG with simple BLEU scores. Modern evaluation uses the RAG Triad: (1) Context Precision (Did retrieval find the right chunks without noise?), (2) Faithfulness / Groundedness (Is the generated answer strictly derived from the retrieved context, or does it hallucinate external facts?), and (3) Answer Relevance (Did the answer actually address the user's question?).

---

## The Interview Trap & Senior Insight
A model can generate a 100% fluent, persuasive, and completely hallucinated answer. Faithfulness specifically checks if every claim in the answer can be directly inferred from the retrieved chunks.

---

## Technical Implementation
```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

# Evaluation dataset with ground context
eval_dataset = Dataset.from_dict({
    'question': ["What is DENSE_RANK?"],
    'contexts': [["DENSE_RANK assigns consecutive ranks without skipping numbers..."]],
    'answer': ["DENSE_RANK assigns sequential ranks without gaps on ties."]
})

# Run LLM-as-a-judge evaluation:
results = evaluate(
    eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
print(results)
```

## Interview Drill Check (8 Questions)

### Question 1: In RAG evaluation, what does the 'Faithfulness' metric measure?
- **Correct Answer**: `The degree to which the generated answer is strictly grounded in the retrieved context without ungrounded hallucinations`
- **Key Takeaway**: Faithfulness evaluates whether the claims in the generated response can be logically inferred from the retrieved source context chunks.

### Question 2: What critical interview trap should candidates watch out for when discussing "Evaluating RAG: Faithfulness vs Relevance"?
- **Correct Answer**: `A model can generate a 100% fluent, persuasive, and completely hallucinated answer. Faithfulness spe...`
- **Key Takeaway**: Senior insight: A model can generate a 100% fluent, persuasive, and completely hallucinated answer. Faithfulness specifically checks if every claim in the answer can be directl... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "Evaluating RAG: Faithfulness vs Relevance" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "Evaluating RAG: Faithfulness vs Relevance", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "Evaluating RAG: Faithfulness vs Relevance", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to Ragas: Automated Evaluation of Retrieval Augmented Generation (Es et al., 2023), what architectural design makes "Evaluating RAG: Faithfulness vs Relevance" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "Evaluating RAG: Faithfulness vs Relevance", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "Evaluating RAG: Faithfulness vs Relevance"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [Ragas: Automated Evaluation of Retrieval Augmented Generation (Es et al., 2023)](https://arxiv.org/abs/2309.15217)
- **Authority**: `arXiv:2309.15217`

---
*Generated with DS Roulette | Practice daily to build mastery.*
