# DENSE_RANK vs RANK vs ROW_NUMBER
> **Discipline**: SQL  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
Imagine runners in a race where two people tie for 2nd place. ROW_NUMBER assigns distinct arbitrary numbers (1, 2, 3). RANK acknowledges the tie but skips the next rank (1, 2, 2, 4). DENSE_RANK acknowledges the tie without skipping any numbers (1, 2, 2, 3).

---

## The Interview Trap & Senior Insight
Interviewers frequently ask for 'the 2nd highest salary per department'. If you use ROW_NUMBER() without tie-breaking, you get arbitrary results on ties. If you use RANK() and two employees share #1, there will be no rank 2! DENSE_RANK() is almost always the correct answer.

---

## Technical Implementation
```sql
-- Find the 2nd highest salary in each department
WITH RankedSalaries AS (
  SELECT 
    department_id,
    employee_name,
    salary,
    DENSE_RANK() OVER(
      PARTITION BY department_id 
      ORDER BY salary DESC
    ) AS salary_rank
  FROM employees
)
SELECT department_id, employee_name, salary
FROM RankedSalaries
WHERE salary_rank = 2;
```

## Interview Drill Check (8 Questions)

### Question 1: If three employees tie for highest salary ($100k), what rank does the fourth employee ($90k) receive using DENSE_RANK()?
- **Correct Answer**: `Rank 2`
- **Key Takeaway**: DENSE_RANK never skips ranks after ties. The first three get 1, 1, 1, and the very next value is 2.

### Question 2: What critical interview trap should candidates watch out for when discussing "DENSE_RANK vs RANK vs ROW_NUMBER"?
- **Correct Answer**: `Interviewers frequently ask for 'the 2nd highest salary per department'. If you use ROW_NUMBER() wit...`
- **Key Takeaway**: Senior insight: Interviewers frequently ask for 'the 2nd highest salary per department'. If you use ROW_NUMBER() without tie-breaking, you get arbitrary results on ties. If you... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "DENSE_RANK vs RANK vs ROW_NUMBER" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "DENSE_RANK vs RANK vs ROW_NUMBER"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "DENSE_RANK vs RANK vs ROW_NUMBER" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "DENSE_RANK vs RANK vs ROW_NUMBER" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to PostgreSQL 16 Documentation: Window Function Syntax & Semantics, what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "DENSE_RANK vs RANK vs ROW_NUMBER" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [PostgreSQL 16 Documentation: Window Function Syntax & Semantics](https://www.postgresql.org/docs/current/tutorial-window.html)
- **Authority**: `PostgreSQL Official Docs`

---
*Generated with DS Roulette | Practice daily to build mastery.*
