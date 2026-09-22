# Deep Learning Drills

Computational graphs, normalization dynamics, and attention algebra.

## 1. Scaled Dot-Product Attention Mechanics
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
* Why scale by $\sqrt{d_k}$? Without scaling, large inner products push softmax into regions with near-zero gradients.
