# AI Agent Architecture & Tool Calling
> **Discipline**: DL  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
An LLM is a reasoning engine, not an execution engine. An AI Agent connects the reasoning core to: (1) Planning (breaking complex tasks into DAG sub-goals), (2) Memory (short-term conversation state + long-term vector memory), and (3) Tools (calling REST APIs, executing Python code in sandboxes, querying databases) via JSON function schemas.

---

## The Interview Trap & Senior Insight
When an LLM calls a tool, the model itself does NOT execute the code. It outputs structured JSON with the function name and arguments. The host framework parses this JSON, executes the actual code on the host machine, and appends the result back into the prompt for the model's next turn.

---

## Technical Implementation
```python
# Tool Schema Definition for LLM Function Calling:
tools = [{
    "type": "function",
    "function": {
        "name": "execute_sql_query",
        "description": "Executes read-only SQL query against Snowflake warehouse",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Valid SQL query"}
            },
            "required": ["query"]
        }
    }
}]

# Host intercepts tool_calls, runs DB query, and returns role="tool" message
```

## Interview Drill Check (8 Questions)

### Question 1: In standard OpenAI / Anthropic / Gemini function calling, where is the external tool code physically executed?
- **Correct Answer**: `In the developer's client/host application environment`
- **Key Takeaway**: The LLM only generates the text/JSON specifying which tool to invoke with what parameters; the developer's application code executes the tool and passes results back.

### Question 2: What critical interview trap should candidates watch out for when discussing "AI Agent Architecture & Tool Calling"?
- **Correct Answer**: `When an LLM calls a tool, the model itself does NOT execute the code. It outputs structured JSON wit...`
- **Key Takeaway**: Senior insight: When an LLM calls a tool, the model itself does NOT execute the code. It outputs structured JSON with the function name and arguments. The host framework parses... Always call out this failure mode proactively in interviews.

### Question 3: What is the computational and memory bottleneck of "AI Agent Architecture & Tool Calling" during training and inference?
- **Correct Answer**: `GPU High-Bandwidth Memory (HBM) bandwidth transfer rate and quadratic activation memory scaling`
- **Key Takeaway**: Modern deep learning workloads are bottlenecked by GPU memory bandwidth (moving tensor bytes between HBM and SRAM) rather than raw FLOPS computation.

### Question 4: When scaling "AI Agent Architecture & Tool Calling", what is the role of Layer Normalization or RMSNorm?
- **Correct Answer**: `To stabilize internal covariate shift and maintain activation gradients within a healthy variance range across deep layers`
- **Key Takeaway**: Without normalization, activations either explode exponentially or vanish toward zero as layer depth increases, causing training divergence.

### Question 5: In autoregressive generation with "AI Agent Architecture & Tool Calling", what is the difference between greedy decoding and nucleus (top-p) sampling?
- **Correct Answer**: `Greedy always picks argmax probability token, risking repetitive loops; top-p samples from the smallest set of tokens whose cumulative probability exceeds p`
- **Key Takeaway**: Greedy decoding is deterministic and often produces repetitive text. Top-p dynamically truncates the probability distribution, maintaining creativity while pruning low-probability gibberish.

### Question 6: According to ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., ICLR 2023), what architectural design makes "AI Agent Architecture & Tool Calling" so effective?
- **Correct Answer**: `Its ability to model complex dependencies and parallelize computation across all tokens simultaneously`
- **Key Takeaway**: Unlike sequential recurrent networks (RNNs/LSTMs), modern Transformer architectures process full sequences concurrently, enabling massive scale across GPU clusters.

### Question 7: When fine-tuning models featuring "AI Agent Architecture & Tool Calling", why is parameter-efficient fine-tuning (PEFT/LoRA) preferred over full weight fine-tuning?
- **Correct Answer**: `It freezes the base model and only trains low-rank adapter matrices, reducing trainable parameters by 99% and preventing catastrophic forgetting`
- **Key Takeaway**: LoRA decomposes weight updates delta_W into B * A with small rank r. This drops GPU VRAM requirements by over 70% and enables hosting multiple specialized adapters on one base model.

### Question 8: How does context window length impact the inference latency of "AI Agent Architecture & Tool Calling"?
- **Correct Answer**: `Prefill time scales quadratically O(N^2) with prompt length, while decode time scales with cumulative sequence length and KV-cache transfer volume`
- **Key Takeaway**: Standard self-attention computes pairwise token scores, creating quadratic O(N^2) compute during prompt prefill and growing KV-cache memory during decoding.

---

## Deep Research & Reading
- **Resource**: [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., ICLR 2023)](https://arxiv.org/abs/2210.03629)
- **Authority**: `arXiv:2210.03629`

---
*Generated with DS Roulette | Practice daily to build mastery.*
