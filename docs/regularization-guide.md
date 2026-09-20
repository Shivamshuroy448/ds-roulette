# L1 and L2 Regularization Guide

Geometric and probabilistic interpretations of Lasso (L1) and Ridge (L2) penalties.

* **L1 (Lasso)**: Adds $\lambda \sum |w_i|$ penalty. Produces sparse weight vectors due to diamond-shaped constraint boundaries intersecting along axes.
* **L2 (Ridge)**: Adds $\lambda \sum w_i^2$ penalty. Shrinks weights toward zero proportionally without setting them strictly to zero.
