# Technical Support Engineer Assessment

Thank you for taking the time to complete this assessment for the Technical Support Engineer position at Cargas.

## Overview

This assessment looks at how you think through problems, not whether you have memorized syntax. It has two parts:

1. **SQL Questions** - query and analyze data
2. **Support Ticket Scenarios** - diagnose and respond to customers

**Estimated Time:** about 1 hour total.

## Using AI Tools

**You may use AI tools (ChatGPT, Claude, Copilot, etc.), search, and documentation.** Our team uses them every day, and we want to see how you work with them.

The rules:
- You are responsible for every answer you submit. Check it, run it, and fix it if it is wrong.
- Add a short `ai_notes.md` listing which tools you used, what you asked them, and one place where the AI was wrong or where you changed its answer. "I didn't use any" is a fine answer.
- We may ask you to explain your answers afterward. If you could not explain it, do not submit it.

## Getting Started

### What You'll Need

- **SQL Server** (or SQL Server Express - free download)
  - Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- **SQL Server Management Studio (SSMS)** or any SQL Server client
  - Download: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
- **Text editor** for your written responses

## Part 1: SQL Assessment

### Step 1: Set Up the Test Database

1. Open SQL Server Management Studio (or your SQL client)
2. Connect to your local SQL Server instance
3. Create a new database called `TSE_Assessment` (or any name you prefer)
4. Open `sql/setup_database.sql` and execute the entire script
5. Verify the setup by running:
   ```sql
   SELECT COUNT(*) FROM Customers;
   SELECT COUNT(*) FROM Products;
   SELECT COUNT(*) FROM Orders;
   SELECT COUNT(*) FROM OrderItems;
   ```
   You should see 50 customers, 30 products, 68 orders, and 68 order items.

### Step 2: Answer the SQL Questions

1. Open `sql/sql_questions.md` and read each question carefully
2. Write SQL queries and run them against your database
3. Save them in `[YourName]_sql_solutions.sql`
4. Comment each query with the question number and one line on your approach. If a result surprised you, say so.

---

## Part 2: Support Ticket Scenarios

1. Open `support/ticket_scenarios.md` and read all scenarios.
2. Create `ticket_scenarios_answers.md` in the root of your repository.
3. For each scenario, write the reply you would send to the customer. Where it applies, include:
   - what you think may be happening, and what you would check to confirm it
   - the specific questions you need answered before you can be sure
   - what you can and cannot promise, and when the customer will hear from you next
4. Label each response clearly (Scenario 1 ... Scenario 5).

It is fine, and often better, to say "I don't know yet, here is how I will find out."

---

## Submission

Add the following files to your repository:

1. `[YourName]_sql_solutions.sql`
2. `ticket_scenarios_answers.md`
3. `ai_notes.md`

**Option 1: Fork and Submit (Recommended)**
1. Fork this repository to your own GitHub account
2. Add your files, commit and push
3. Send the link to HR

**Option 2: Clone and Submit**
1. Clone this repository locally and add your files
2. Create a new repository on GitHub (or your preferred host) and push
3. Send the link to HR

---

## Questions or Technical Issues?

For setup problems, contact **Adam Elchert (aelchert@cargas.com)**.

Questions about how to solve specific SQL problems or support scenarios are part of the assessment. We can help with technical setup, but not with the answers.

## Good Luck!
