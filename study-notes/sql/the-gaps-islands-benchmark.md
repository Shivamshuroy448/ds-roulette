# The Gaps & Islands Benchmark
> **Discipline**: SQL  
> **Difficulty**: Advanced | **Estimated Time**: 4 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Imagine a daily login calendar. If you subtract a dense row number from each login date (login_date - ROW_NUMBER()), every consecutive day in a streak produces the exact same baseline anchor date! All dates sharing that anchor belong to the exact same continuous 'island'.

---

## The Interview Trap & Senior Insight
Interviewers ask for 'longest continuous streak of daily active usage'. Junior candidates try complex iterative self-joins. Senior candidates immediately write the ROW_NUMBER() difference technique (Date - DENSE_RANK()).

---

## Technical Implementation
```sql
-- Find consecutive login streaks per user
WITH NumberedLogins AS (
  SELECT 
    user_id,
    login_date,
    -- Date difference trick: (date - row_number) creates a constant island ID
    login_date - INTERVAL (ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY login_date)) DAY AS island_id
  FROM user_logins
  GROUP BY user_id, login_date -- Ensure distinct daily logins
)
SELECT 
  user_id,
  MIN(login_date) AS streak_start,
  MAX(login_date) AS streak_end,
  COUNT(*) AS streak_length_days
FROM NumberedLogins
GROUP BY user_id, island_id
ORDER BY streak_length_days DESC;
```

## Interview Drill Check (8 Questions)

### Question 1: In the classic Gaps & Islands problem, why does subtracting a ROW_NUMBER() from sequential dates group consecutive dates together?
- **Correct Answer**: `Because both the date and the row index increment by 1 each day, making their difference constant across a streak`
- **Key Takeaway**: When you have consecutive days (Day 1, Day 2, Day 3) and incrementing indices (1, 2, 3), subtracting them gives (Day 1 - 1 = Day 0), (Day 2 - 2 = Day 0), (Day 3 - 3 = Day 0). A gap jumps the date ahead while the row index only increments by 1, shifting the group identifier.

### Question 2: What critical interview trap should candidates watch out for when discussing "The Gaps & Islands Benchmark"?
- **Correct Answer**: `Interviewers ask for 'longest continuous streak of daily active usage'. Junior candidates try comple...`
- **Key Takeaway**: Senior insight: Interviewers ask for 'longest continuous streak of daily active usage'. Junior candidates try complex iterative self-joins. Senior candidates immediately write ... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "The Gaps & Islands Benchmark" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "The Gaps & Islands Benchmark"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "The Gaps & Islands Benchmark" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "The Gaps & Islands Benchmark" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to SQL Server & PostgreSQL Gaps and Islands Solutions (Itzik Ben-Gan), what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "The Gaps & Islands Benchmark" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [The SQL of Gaps and Islands in Sequences (Redgate Architecture Guide)](https://www.red-gate.com/simple-talk/databases/sql-server/t-sql-programming-sql-server/the-sql-of-gaps-and-islands-in-sequences/)
- **Authority**: `Redgate Simple Talk`

---
*Generated with DS Roulette | Practice daily to build mastery.*
