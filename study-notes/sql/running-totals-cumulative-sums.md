# Running Totals & Cumulative Sums
> **Discipline**: SQL  
> **Difficulty**: Beginner | **Estimated Time**: 2 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
A running total adds each new day's sales to the cumulative total of all previous days. Using SUM(sales) OVER (ORDER BY date) computes this seamlessly row by row.

---

## The Interview Trap & Senior Insight
If you omit ORDER BY in SUM(...) OVER(), it sums the ENTIRE partition as a single static total rather than calculating a running cumulative sum. Conversely, beware of duplicate timestamps without secondary sorting, which can bunch sums together.

---

## Technical Implementation
```sql
-- Calculate cumulative running signups over time
SELECT 
  signup_date,
  daily_signups,
  SUM(daily_signups) OVER (
    ORDER BY signup_date 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_total_users
FROM daily_user_signups;
```

## Interview Drill Check (8 Questions)

### Question 1: What happens if you write SUM(sales) OVER () without an ORDER BY clause?
- **Correct Answer**: `It returns the grand total of the entire dataset on every single row`
- **Key Takeaway**: Without an ORDER BY inside the window specification, the frame encompasses the entire partition, returning the grand total on every row.

### Question 2: What critical interview trap should candidates watch out for when discussing "Running Totals & Cumulative Sums"?
- **Correct Answer**: `If you omit ORDER BY in SUM(...) OVER(), it sums the ENTIRE partition as a single static total rathe...`
- **Key Takeaway**: Senior insight: If you omit ORDER BY in SUM(...) OVER(), it sums the ENTIRE partition as a single static total rather than calculating a running cumulative sum. Conversely, bew... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "Running Totals & Cumulative Sums" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "Running Totals & Cumulative Sums"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "Running Totals & Cumulative Sums" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "Running Totals & Cumulative Sums" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to SQL Window Frames: ROWS vs RANGE Specification, what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "Running Totals & Cumulative Sums" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [PostgreSQL 16 Official Documentation: Window Functions Tutorial](https://www.postgresql.org/docs/current/tutorial-window.html)
- **Authority**: `PostgreSQL Docs`

---
*Generated with DS Roulette | Practice daily to build mastery.*
