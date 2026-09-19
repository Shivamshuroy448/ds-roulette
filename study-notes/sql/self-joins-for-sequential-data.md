# Self Joins for Sequential Data
> **Discipline**: SQL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
When comparing an event to a previous event in the same table (e.g. today's price vs yesterday's price, or employee vs their manager), join two alias instances (A and B) of the exact same table.

---

## The Interview Trap & Senior Insight
Junior candidates write complicated loops or subqueries. Senior interviewers look for clean self-joins on date offsets or modern LAG() window functions.

---

## Technical Implementation
```sql
-- Identify days where stock price increased compared to previous day
SELECT 
  curr.trade_date,
  curr.price AS today_price,
  prev.price AS yesterday_price
FROM stock_prices curr
JOIN stock_prices prev 
  ON curr.stock_id = prev.stock_id
 AND curr.trade_date = DATE_ADD(prev.trade_date, INTERVAL 1 DAY)
WHERE curr.price > prev.price;
```

## Interview Drill Check (8 Questions)

### Question 1: Which modern window function accomplishes consecutive record lookups without self-joining?
- **Correct Answer**: `LAG()`
- **Key Takeaway**: LAG(column, 1) accesses values from the previous row within the partition without requiring a self-join.

### Question 2: What critical interview trap should candidates watch out for when discussing "Self Joins for Sequential Data"?
- **Correct Answer**: `Junior candidates write complicated loops or subqueries. Senior interviewers look for clean self-joi...`
- **Key Takeaway**: Senior insight: Junior candidates write complicated loops or subqueries. Senior interviewers look for clean self-joins on date offsets or modern LAG() window functions.... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "Self Joins for Sequential Data" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "Self Joins for Sequential Data"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "Self Joins for Sequential Data" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "Self Joins for Sequential Data" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to Relational Database Design & Self-Referential Joins (Codd & Date), what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "Self Joins for Sequential Data" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [PostgreSQL 16 Official Manual: Table Joins & Self-Referencing Relations](https://www.postgresql.org/docs/current/tutorial-join.html)
- **Authority**: `PostgreSQL Docs`

---
*Generated with DS Roulette | Practice daily to build mastery.*
