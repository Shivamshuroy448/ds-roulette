# SQL Interview Drills

Curated multi-part SQL drills covering core query patterns asked in top-tier technical interviews.

## 1. Gaps and Islands Detection
Identify contiguous blocks of activity and isolate inactive gaps using window difference techniques.

```sql
WITH flagged_events AS (
  SELECT
    user_id,
    event_date,
    event_date - INTERVAL (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_date)) DAY AS island_group
  FROM user_activity
)
SELECT
  user_id,
  island_group,
  MIN(event_date) AS streak_start,
  MAX(event_date) AS streak_end,
  COUNT(*) AS streak_length
FROM flagged_events
GROUP BY user_id, island_group
HAVING COUNT(*) >= 3;
```

## 2. Retention Cohort Matrix
Track month-over-month active retention using window functions and conditional counting.

```sql
WITH user_cohorts AS (
  SELECT user_id, DATE_TRUNC('month', MIN(signup_date)) AS cohort_month
  FROM users GROUP BY 1
),
activities AS (
  SELECT user_id, DATE_TRUNC('month', activity_date) AS activity_month
  FROM activity_log GROUP BY 1, 2
)
SELECT
  c.cohort_month,
  COUNT(DISTINCT c.user_id) AS total_users,
  COUNT(DISTINCT CASE WHEN a.activity_month = c.cohort_month + INTERVAL '1 month' THEN a.user_id END) * 100.0 / COUNT(DISTINCT c.user_id) AS m1_retention
FROM user_cohorts c
LEFT JOIN activities a ON c.user_id = a.user_id
GROUP BY 1 ORDER BY 1;
```
