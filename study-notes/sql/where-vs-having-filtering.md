# WHERE vs HAVING Filtering
> **Discipline**: SQL  
> **Difficulty**: Beginner | **Estimated Time**: 2 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
WHERE filters raw individual records before any grouping happens. HAVING filters the aggregated summary groups after GROUP BY finishes doing the math.

---

## The Interview Trap & Senior Insight
Candidates try writing WHERE COUNT(order_id) > 5. SQL execution order runs WHERE first before aggregations exist, producing a syntax error. Always aggregate before HAVING.

---

## Technical Implementation
```sql
-- Correct usage: WHERE on rows, HAVING on groups
SELECT 
  customer_id, 
  COUNT(order_id) AS total_orders,
  SUM(order_amount) AS total_spent
FROM orders
WHERE order_status = 'completed' -- Filter rows before grouping
GROUP BY customer_id
HAVING COUNT(order_id) >= 5;     -- Filter aggregated groups
```

## Interview Drill Check (8 Questions)

### Question 1: In the SQL query execution lifecycle, which clause executes first?
- **Correct Answer**: `WHERE`
- **Key Takeaway**: SQL logical order executes: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.

### Question 2: What critical interview trap should candidates watch out for when discussing "WHERE vs HAVING Filtering"?
- **Correct Answer**: `Candidates try writing WHERE COUNT(order_id) > 5. SQL execution order runs WHERE first before aggreg...`
- **Key Takeaway**: Senior insight: Candidates try writing WHERE COUNT(order_id) > 5. SQL execution order runs WHERE first before aggregations exist, producing a syntax error. Always aggregate bef... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "WHERE vs HAVING Filtering" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "WHERE vs HAVING Filtering"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "WHERE vs HAVING Filtering" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "WHERE vs HAVING Filtering" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to SQL Query Processing Order & Execution Phases, what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "WHERE vs HAVING Filtering" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [SQL Query Processing Order & Execution Phases](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql)
- **Authority**: `Microsoft Learn / T-SQL Docs`

---
*Generated with DS Roulette | Practice daily to build mastery.*
