# Support Ticket Response Scenarios

## Instructions

For each scenario below, write the reply you would send to the customer, as if via email or your ticketing system.

Real tickets rarely come with the answer attached. Most scenarios include **evidence** (data, logs, output) that you have already collected. They do not tell you the cause. It is your job to read the evidence, form hypotheses, and decide what to tell the customer and what to ask them.

**What we're evaluating:**
- Clear, professional communication
- Empathy and customer focus
- Diagnostic thinking: what you think is happening, and why
- Asking the right clarifying questions (and not asking for things you already have)
- Setting honest expectations: what you know, what you don't, and what happens next

**In each response, where it applies:**
- Say what you think may be happening, and how confident you are
- List the specific questions you need answered
- Say what you will do next and when the customer will hear from you
- Don't promise a fix or a date you can't know

**Submission Format:**
- Write your responses in `ticket_scenarios_answers.md`
- Label each response clearly (Scenario 1 ... Scenario 5)
- No strict length requirement; aim for thorough yet concise

---

## Scenario 1: Customer Reports Python Script Error

### Customer's Ticket:

**Subject:** Urgent - Data Export Script Failing

**From:** Sarah Martinez, Operations Manager at Acme Corp

**Message:**
> Hi Support Team,
>
> Our automated data export script stopped working this morning and we need this data for our weekly reports. I'm getting an error when I run it. Here's what it says:
>
> ```
> Traceback (most recent call last):
>   File "export_data.py", line 47, in <module>
>     process_records(data)
>   File "export_data.py", line 23, in process_records
>     formatted_date = record['date'].strftime('%Y-%m-%d')
> AttributeError: 'NoneType' object has no attribute 'strftime'
> ```
>
> This worked fine last week! Nothing has changed on our end. Please help ASAP as my team is waiting on this data.
>
> Thanks,
> Sarah

### Evidence you have:

Sarah attached a sample of the data the script reads (5 of roughly 800 rows):

| id | customer | date | amount |
|----|----------|------|--------|
| 7101 | Delta Fuel | 2026-10-26 | 1,240.00 |
| 7102 | Delta Fuel | 2026-10-27 | 310.50 |
| 7103 | Ridge Propane | *(blank)* | 890.00 |
| 7104 | Ridge Propane | 2026-10-28 | 455.25 |
| 7105 | Summit Energy | 2026-10-29 | 2,010.00 |

She says the data comes from a nightly export from Cargas Energy and that her team added some new accounts on Monday. She has not shared the full script.

### Your Task:

Write a response to Sarah. You do not need to produce a perfect fix, but she should leave your reply knowing what you think is wrong, what she can try right now, and what you still need from her.

---

## Scenario 2: Customer Asks "How Do I...?" Question

### Customer's Ticket:

**Subject:** Question about automating monthly reports

**From:** James Chen, Finance Analyst at TechStart Inc.

**Message:**
> Hello,
>
> I've been manually running the same report every month and exporting it to Excel, then doing some calculations and formatting before sending it to my manager. It's taking me about 2 hours each month.
>
> Someone mentioned that I might be able to use Python to automate this process, but I'm not really a programmer. Is this something your software supports? Can you help me set this up? I'd like to have it automatically email the formatted report to my manager on the first Monday of each month.
>
> Let me know what's possible.
>
> Thanks,
> James

### Your Task:

Write a response to James.

---

## Scenario 3: Data Accuracy / Report Investigation

### Customer's Ticket:

**Subject:** Report showing wrong numbers

**From:** Maria Rodriguez, Finance Director at Global Manufacturing Inc.

**Message:**
> Hi Support,
>
> Our monthly revenue report is showing $45,000 for last month, but when I manually add up all our invoices, I'm getting $52,000. This is a huge discrepancy and my CFO is asking questions.
>
> I've checked our data entry - everything looks correct on our end. The report has been working fine for the past 6 months, so I don't know what changed. Can you help me figure out why the numbers don't match?
>
> This is urgent - I need to present accurate numbers to the board next week.
>
> Thanks,
> Maria Rodriguez

### Evidence you have:

**The report's query:**

```sql
SELECT SUM(total_amount) AS revenue
FROM Orders
WHERE status = 'completed'
  AND order_date >= '2026-10-01'
  AND order_date <  '2026-11-01';
```

**All orders for the customer's account, October 2026, grouped by status:**

| status | order count | sum of total_amount |
|--------|-------------|---------------------|
| completed | 38 | 45,000.00 |
| processing | 4 | 3,100.00 |
| pending | 3 | 2,400.00 |
| cancelled | 2 | 1,500.00 |
| **all** | **47** | **52,000.00** |

**Three of the orders, as they appear in the database:**

| id | order_date | status | total_amount |
|----|------------|--------|--------------|
| 2231 | 2026-09-29 | completed | 1,800.00 |
| 2260 | 2026-10-14 | processing | 950.00 |
| 2274 | 2026-10-22 | cancelled | 700.00 |

The Orders table has no column recording when an order was completed.

### Your Task:

Write a response to Maria. Use the evidence to explain what you can already tell her, and ask the specific questions you would need answered to be sure which number is "right" for her purposes.

---

## Scenario 4: Multi-Step Issue / Integration Problem

### Customer's Ticket:

**Subject:** Data not syncing correctly

**From:** Jennifer Park, Customer Success Manager at TechSolutions LLC

**Message:**
> Hi Support Team,
>
> We're having an issue where customer data from our CRM isn't showing up in your system. We imported 200 new customers last week, but only 150 are appearing. The other 50 seem to have just disappeared.
>
> Our IT team checked the import logs and everything looks successful on our end. They say the data was sent correctly. But it's not showing up in your system.
>
> We need all our customer data to be accurate. Can you help us figure out what happened to those 50 customers?
>
> Best regards,
> Jennifer Park

### Evidence you have:

**Excerpt from the import log on our side:**

```
2026-10-27 14:02:11 INFO  Import started  batch=B-4471 records=200
2026-10-27 14:02:12 INFO  Row 1   inserted
2026-10-27 14:02:12 INFO  Row 2   inserted
...
2026-10-27 14:02:12 WARN  Row 17  skipped  code=E102
2026-10-27 14:02:12 INFO  Row 18  inserted
...
2026-10-27 14:02:13 WARN  Row 41  skipped  code=E105
...
2026-10-27 14:02:15 INFO  Import finished inserted=150 skipped=50
2026-10-27 14:02:15 INFO  Response to caller: HTTP 200 {"status":"received","records":200}
```

Of the 50 skipped rows: 31 are `E102` and 19 are `E105`. The log does not say what these codes mean.

**Customer-side note:** the CRM's own log shows "batch B-4471: sent 200, response 200 OK."

### Your Task:

Write a response to Jennifer. Decide what you can say now, what you must verify before you say it, and how you will handle that her team believes the import succeeded.

---

## Scenario 5: Ambiguous Problem / Needs Investigation

### Customer's Ticket:

**Subject:** Something's wrong but I don't know what

**From:** Robert Chen, Operations Manager

**Message:**
> Hi,
>
> Our reports just don't look right lately. The numbers seem off, but I can't put my finger on exactly what's wrong. Can someone take a look?
>
> Thanks,
> Robert Chen

### Evidence you have:

You looked at his account and found these two things:

**His saved "Sales Summary" report** is set to a date filter of *Current Month*. It was last run on the 4th of the month and shows:

| Customer | Orders | Gross | Discount | Net |
|----------|--------|-------|----------|-----|
| Delta Fuel | 3 | 4,200.00 | 200.00 | 4,000.00 |
| Ridge Propane | 2 | 1,150.00 | *(blank)* | *(blank)* |
| **Total** | **5** | **5,350.00** | **200.00** | **4,000.00** |

**Our release notes** show that an update about two weeks ago changed how blank values are handled in some report calculations. The notes don't say which reports.

### Your Task:

Write a response to Robert. He has given you almost nothing, so decide what you can tell him, what you need from him, and how to make it easy for him to answer.
