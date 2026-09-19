# LEAD & LAG for MoM Growth
> **Discipline**: SQL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
LAG looks backward into previous rows (e.g., last month's revenue), while LEAD looks ahead to future rows. This lets you calculate differences and percentage changes in a single SQL scan without self-joining the table on date = date - 1.

---

## The Interview Trap & Senior Insight
Candidates often forget the default fallback value in LAG(val, 1, 0). If it's the user's first month, LAG returns NULL, causing (curr - prev) / prev to evaluate to NULL or divide by zero. Always provide a fallback or handle NULLs in division.

---

## Technical Implementation
```sql
-- Month-over-Month (MoM) revenue growth
WITH MonthlySales AS (
  SELECT 
    DATE_TRUNC('month', order_date) AS sales_month,
    SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT 
  sales_month,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY sales_month) AS prev_revenue,
  ROUND(100.0 * (revenue - LAG(revenue, 1) OVER (ORDER BY sales_month)) 
    / NULLIF(LAG(revenue, 1) OVER (ORDER BY sales_month), 0), 2) AS mom_growth_pct
FROM MonthlySales;
```

## Interview Drill Check (8 Questions)

### Question 1: What is the third optional argument in LAG(column, offset, default_value)?
- **Correct Answer**: `The default value returned when no previous row exists (instead of NULL)`
- **Key Takeaway**: The third argument defines the value returned if offset points outside the partition, defaulting to NULL if unspecified.

### Question 2: What critical interview trap should candidates watch out for when discussing "LEAD & LAG for MoM Growth"?
- **Correct Answer**: `Candidates often forget the default fallback value in LAG(val, 1, 0). If it's the user's first month...`
- **Key Takeaway**: Senior insight: Candidates often forget the default fallback value in LAG(val, 1, 0). If it's the user's first month, LAG returns NULL, causing (curr - prev) / prev to evaluate... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "LEAD & LAG for MoM Growth" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "LEAD & LAG for MoM Growth"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "LEAD & LAG for MoM Growth" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "LEAD & LAG for MoM Growth" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to PostgreSQL Lead/Lag Value Window Functions, what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "LEAD & LAG for MoM Growth" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [PostgreSQL Lead/Lag Value Window Functions](https://www.postgresql.org/docs/current/functions-window.html)
- **Authority**: `PostgreSQL Official Manual`

---
*Generated with DS Roulette | Practice daily to build mastery.*
