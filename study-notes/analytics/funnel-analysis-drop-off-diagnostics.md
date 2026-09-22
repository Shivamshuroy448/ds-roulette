# Funnel Analysis & Drop-off Diagnostics
> **Discipline**: ANALYTICS  
> **Difficulty**: Intermediate | **Estimated Time**: 3 min  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## Intuitive Mental Model
A funnel tracks users step-by-step through a multi-stage flow: Landing Page → Sign Up → Onboarding Completed → First Purchase. The biggest percentage drop-off identifies the primary friction bottleneck. Diagnosing it requires segmenting the drop-off by browser, country, platform (iOS vs Android), and acquisition source.

---

## The Interview Trap & Senior Insight
Don't just calculate step-to-step drop-offs. Always check whether the funnel is 'Strict Sequential' (must do steps in order 1→2→3) or 'Loose' (can do steps in any order), and define a strict conversion time window (e.g. within 24 hours).

---

## Technical Implementation
```sql
-- Funnel Conversion Analysis in SQL
WITH FunnelSteps AS (
  SELECT 
    user_id,
    MAX(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) AS step_1_view,
    MAX(CASE WHEN event_name = 'add_to_cart' THEN 1 ELSE 0 END) AS step_2_cart,
    MAX(CASE WHEN event_name = 'checkout_start' THEN 1 ELSE 0 END) AS step_3_checkout,
    MAX(CASE WHEN event_name = 'order_completed' THEN 1 ELSE 0 END) AS step_4_purchased
  FROM product_events
  WHERE event_timestamp >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT 
  COUNT(CASE WHEN step_1_view = 1 THEN 1 END) AS total_viewers,
  COUNT(CASE WHEN step_2_cart = 1 THEN 1 END) AS total_cart,
  COUNT(CASE WHEN step_3_checkout = 1 THEN 1 END) AS total_checkout,
  COUNT(CASE WHEN step_4_purchased = 1 THEN 1 END) AS total_buyers
FROM FunnelSteps;
```

## Interview Drill Check (8 Questions)

### Question 1: If a funnel conversion from Step 2 to Step 3 suddenly drops by 35% on mobile devices only, what is the first diagnostic step?
- **Correct Answer**: `Segment by mobile OS (iOS vs Android) and browser versions to isolate potential UI bugs or payment SDK crashes`
- **Key Takeaway**: Platform-specific conversion drops are classic symptoms of client-side software regressions, OS incompatibility, or broken payment gateway SDKs.

### Question 2: What critical interview trap should candidates watch out for when discussing "Funnel Analysis & Drop-off Diagnostics"?
- **Correct Answer**: `Don't just calculate step-to-step drop-offs. Always check whether the funnel is 'Strict Sequential' ...`
- **Key Takeaway**: Senior insight: Don't just calculate step-to-step drop-offs. Always check whether the funnel is 'Strict Sequential' (must do steps in order 1→2→3) or 'Loose' (can do steps in a... Always call out this failure mode proactively in interviews.

### Question 3: When defining metrics related to "Funnel Analysis & Drop-off Diagnostics", what is the danger of optimizing for a 'Vanity Metric'?
- **Correct Answer**: `A metric like total registered users or pageviews can climb steadily while active engagement, retention, and monetization are dying`
- **Key Takeaway**: Vanity metrics only go up and give a false sense of progress. Actionable metrics (retention cohorts, conversion rates, LTV:CAC) directly inform operational decisions.

### Question 4: How do you distinguish between correlation and causation when analyzing "Funnel Analysis & Drop-off Diagnostics"?
- **Correct Answer**: `By running a randomized controlled trial (A/B experiment) or employing quasi-experimental methods like Difference-in-Differences and Instrumental Variables`
- **Key Takeaway**: Observational correlation does not prove causation due to confounders. Controlled experimentation or econometric causal inference methods are mandatory.

### Question 5: What does cohort analysis reveal about "Funnel Analysis & Drop-off Diagnostics" that aggregate metrics obscure?
- **Correct Answer**: `Aggregate numbers blend old and new user behavior, hiding whether recent product releases are improving or worsening user retention`
- **Key Takeaway**: If you acquire 100k users with high churn, aggregate active user numbers look healthy. Cohort retention curves isolate specific vintage cohorts to measure genuine product improvements.

### Question 6: According to Designing Conversion Funnel Analysis & Micro-Conversions, what is the hallmark of a world-class growth strategy?
- **Correct Answer**: `High Day 30+ retention curve that flattens horizontally, creating compounding compounding lifetime customer value`
- **Key Takeaway**: Without a flat retention baseline, pouring users into the top of the funnel is a 'leaky bucket'. Long-term cohort retention is the foundation of sustainable growth.

### Question 7: How should you structure an executive dashboard tracking "Funnel Analysis & Drop-off Diagnostics"?
- **Correct Answer**: `Display a top-level North Star metric with key input drivers, conversion funnels, and drill-downs by user segment`
- **Key Takeaway**: Executive dashboards must provide hierarchical clarity: the primary outcome metric at a glance, followed by actionable leading indicator drivers.

### Question 8: If an interviewer asks: 'Our metric for Funnel Analysis & Drop-off Diagnostics dropped 12% yesterday. How do you investigate?', what is your structured approach?
- **Correct Answer**: `Verify tracking integrity and data pipeline latency, check seasonality/holidays, segment by platform/geography/version, and check recent product deployments`
- **Key Takeaway**: A top-tier analytics diagnostic framework always begins with data integrity validation, followed by external seasonality checks, platform segmentation, and recent code releases.

---

## Deep Research & Reading
- **Resource**: [Designing Conversion Funnel Analysis & Micro-Conversions](https://www.reforge.com/blog/conversion-funnel-analysis)
- **Authority**: `Reforge Growth Series`

---
*Generated with DS Roulette | Practice daily to build mastery.*
