# Recursive CTEs for Hierarchies
> **Discipline**: SQL  
> **Difficulty**: Advanced | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
A Recursive CTE has two parts united by UNION ALL: (1) Anchor Member (the root node, e.g. CEO where manager_id IS NULL), and (2) Recursive Member (joining the CTE back to itself to step down reporting levels until no children remain).

---

## The Interview Trap & Senior Insight
Interviewers will test for infinite loop prevention. If cyclic data exists (A manages B, B manages A), a recursive CTE will hang forever unless you track visited nodes in an array or enforce a maximum recursion depth.

---

## Technical Implementation
```sql
-- Find all subordinates under Manager #101
WITH RECURSIVE OrgChart AS (
  -- 1. Anchor Member (Top-level manager)
  SELECT employee_id, employee_name, manager_id, 1 AS depth
  FROM employees
  WHERE employee_id = 101
  
  UNION ALL
  
  -- 2. Recursive Member (Direct reports)
  SELECT e.employee_id, e.employee_name, e.manager_id, o.depth + 1
  FROM employees e
  INNER JOIN OrgChart o ON e.manager_id = o.employee_id
)
SELECT * FROM OrgChart;
```

## Interview Drill Check (8 Questions)

### Question 1: What clause combines the Anchor and Recursive member in a Recursive Common Table Expression?
- **Correct Answer**: `UNION ALL`
- **Key Takeaway**: UNION ALL appends intermediate iteration rows from the recursive query until the query produces an empty result set.

### Question 2: What critical interview trap should candidates watch out for when discussing "Recursive CTEs for Hierarchies"?
- **Correct Answer**: `Interviewers will test for infinite loop prevention. If cyclic data exists (A manages B, B manages A...`
- **Key Takeaway**: Senior insight: Interviewers will test for infinite loop prevention. If cyclic data exists (A manages B, B manages A), a recursive CTE will hang forever unless you track visite... Always call out this failure mode proactively in interviews.

### Question 3: How does the SQL query planner handle execution when "Recursive CTEs for Hierarchies" is used on large tables without proper indexes?
- **Correct Answer**: `It is forced to perform expensive full-table sequential scans or external disk sorts`
- **Key Takeaway**: Without indexes matching the PARTITION BY / ORDER BY / WHERE clauses, the database engine must spill sort operations to disk (work_mem exhaustion), causing severe latency spikes.

### Question 4: What happens when NULL values are encountered in the key ordering column for "Recursive CTEs for Hierarchies"?
- **Correct Answer**: `In SQL standard, NULLs are treated as either highest (NULLS FIRST) or lowest (NULLS LAST) depending on engine defaults, requiring explicit NULLS LAST handling`
- **Key Takeaway**: PostgreSQL orders NULLs highest (appearing first on DESC), whereas MySQL orders them lowest. Always specify NULLS LAST explicitly to prevent unexpected top ranks.

### Question 5: In terms of relational algebra and ACID guarantees, what scope do window calculations in "Recursive CTEs for Hierarchies" operate on?
- **Correct Answer**: `They operate purely on the filtered intermediate result set after WHERE and GROUP BY processing`
- **Key Takeaway**: Window functions execute in the SELECT phase, computing metrics across partitioned frames of the post-WHERE/GROUP BY result set without altering underlying stored data.

### Question 6: When optimizing queries featuring "Recursive CTEs for Hierarchies" in production data warehouses (Snowflake, BigQuery), what is the best practice?
- **Correct Answer**: `Ensure partition keys align with table clustering or distribution keys to prevent expensive cross-node data shuffling`
- **Key Takeaway**: Cross-node shuffling during PARTITION BY is the #1 cost driver in distributed SQL. Aligning partition keys with clustering keys minimizes network I/O.

### Question 7: According to PostgreSQL Queries with WITH RECURSIVE (Hierarchical Tree Traversal), what is the standard algorithmic complexity of sort-based window operations?
- **Correct Answer**: `O(N log N) dominated by sorting the partitioned window frames`
- **Key Takeaway**: Window aggregations require ordering rows within each partition, which incurs an O(K * M log M) sorting complexity where M is partition size.

### Question 8: If an interviewer asks you to rewrite "Recursive CTEs for Hierarchies" without using window functions, what construct would you use?
- **Correct Answer**: `Correlated subqueries or self-joins with aggregation`
- **Key Takeaway**: Before SQL:2003 window functions, ranked and rolling analytics were achieved via correlated scalar subqueries or self-joins, which run in O(N^2) time.

---

## Deep Research & Reading
- **Resource**: [PostgreSQL Queries with WITH RECURSIVE (Hierarchical Tree Traversal)](https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-RECURSIVE)
- **Authority**: `PostgreSQL Official Docs`

---
*Generated with DS Roulette | Practice daily to build mastery.*
