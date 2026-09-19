# Database Indexing: B-Tree vs Hash Index
> **Discipline**: SQL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
A B-Tree (Balanced Tree) index keeps data sorted in hierarchical nodes, making equality lookups (WHERE id = 5), range scans (WHERE age BETWEEN 20 AND 30), and ordering (ORDER BY date) fast with O(log N) depth. A Hash Index maps keys directly to bucket pointers with O(1) equality lookups, but is completely incapable of range queries or sorting.

---

## The Interview Trap & Senior Insight
If you write WHERE UPPER(email) = 'USER@EXAMPLE.COM', a standard B-Tree index on 'email' is completely bypassed! The function wrap forces a full table scan unless you create a specialized Functional Index on UPPER(email).

---

## Technical Implementation
```sql
-- Standard B-Tree Index (Supports equality, ranges, ORDER BY)
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date DESC);

-- Covering Index (Index-Only Scan: query satisfied directly from index tree!)
CREATE INDEX idx_covering ON orders(customer_id) INCLUDE (order_total);

-- Functional Index (Prevents function wrap table scans)
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
```

## Interview Drill Check (8 Questions)

### Question 1: Which type of query CANNOT utilize a standard Hash Index in PostgreSQL?
- **Correct Answer**: `WHERE created_at >= '2026-01-01' AND created_at <= '2026-06-01'`
- **Key Takeaway**: Hash indexes only support equality operators (=). They do not maintain ordered sorting and cannot perform range scans (>=, <=, BETWEEN).

### Question 2: What critical interview trap should candidates watch out for when discussing "Database Indexing: B-Tree vs Hash Index"?
- **Correct Answer**: `If you write WHERE UPPER(email) = 'USER@EXAMPLE.COM', a standard B-Tree index on 'email' is complete...`
- **Key Takeaway**: Senior insight: If you write WHERE UPPER(email) = 'USER@EXAMPLE.COM', a standard B-Tree index on 'email' is completely bypassed! The function wrap forces a full table scan unle... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "Database Indexing: B-Tree vs Hash Index" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "Database Indexing: B-Tree vs Hash Index"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "Database Indexing: B-Tree vs Hash Index" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "Database Indexing: B-Tree vs Hash Index" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to PostgreSQL Index Types: B-Tree, Hash, GiST, GIN, BRIN, what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "Database Indexing: B-Tree vs Hash Index" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [PostgreSQL Index Types: B-Tree, Hash, GiST, GIN, BRIN](https://www.postgresql.org/docs/current/indexes-types.html)
- **Authority**: `PostgreSQL Official Manual`

---
*Generated with DS Roulette | Practice daily to build mastery.*
