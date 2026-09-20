# Window Frames: ROWS vs RANGE
> **Discipline**: SQL  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
ROWS BETWEEN 1 PRECEDING AND CURRENT ROW operates on physical row counts. RANGE operates on the actual values in the ORDER BY column (e.g., all rows with the exact same date or order amount as current row).

---

## The Interview Trap & Senior Insight
In PostgreSQL and MySQL, the default window frame when you use ORDER BY is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. If your column has duplicate values, all duplicate rows are bunched together and included, producing unexpected sums! Always explicitly write ROWS BETWEEN when calculating rolling moving averages.

---

## Technical Implementation
```sql
-- 7-day rolling revenue average:
SELECT 
  event_date,
  daily_revenue,
  AVG(daily_revenue) OVER (
    ORDER BY event_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW -- Physical 7 rows
  ) AS rolling_7d_avg
FROM daily_metrics;
```

## Interview Drill Check (8 Questions)

### Question 1: If two rows have the exact same date '2026-05-01' in an ORDER BY date clause, how does default RANGE treat them?
- **Correct Answer**: `Both rows are evaluated together as peers in the same window frame`
- **Key Takeaway**: RANGE treats duplicate values as ties/peers and evaluates them simultaneously in the same frame rather than row-by-row.

### Question 2: What critical interview trap should candidates watch out for when discussing "Window Frames: ROWS vs RANGE"?
- **Correct Answer**: `In PostgreSQL and MySQL, the default window frame when you use ORDER BY is RANGE BETWEEN UNBOUNDED P...`
- **Key Takeaway**: Senior insight: In PostgreSQL and MySQL, the default window frame when you use ORDER BY is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. If your column has duplicate value... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "Window Frames: ROWS vs RANGE" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "Window Frames: ROWS vs RANGE"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "Window Frames: ROWS vs RANGE" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "Window Frames: ROWS vs RANGE" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to PostgreSQL Window Frame Clause: ROWS vs RANGE vs GROUPS, what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "Window Frames: ROWS vs RANGE" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [PostgreSQL Window Frame Clause: ROWS vs RANGE vs GROUPS](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-WINDOW)
- **Authority**: `PostgreSQL 16 Manual`

---
*Generated with DS Roulette | Practice daily to build mastery.*
