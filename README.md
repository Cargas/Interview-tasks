# Technical Support Engineer Assessment

Thank you for your interest in the Technical Support Engineer position at Cargas, and for taking the time to complete this assessment.

## Overview

We want to see how you approach a problem: how you read the evidence, what you'd check, and how you'd communicate with a customer along the way. Memorizing syntax matters much less to us. The assessment has two parts:

1. **SQL Questions** - query and analyze data
2. **Support Ticket Scenarios** - diagnose and respond to customers

**Estimated Time:** about 1 hour total.

## Using AI Tools

**You're welcome to use AI tools (ChatGPT, Claude, Copilot, etc.), search, and documentation.** Our team uses them every day, and we're interested in how you work with them.

A few things we ask:
- Treat the answers as yours. Run the queries, check the results, and correct anything that looks off.
- Include a short `ai_notes.md` with which tools you used, what you asked them, and one place where you checked or changed their output. If you didn't use any, just say so.
- Submit only what you understand. If we talk afterward, we'd like to hear your reasoning behind your answers.

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

It's fine, and often better, to say "I don't know yet, and here's how I'll find out."

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

If you run into trouble setting up the database or have questions about the instructions, please reach out to **Adam Elchert (aelchert@cargas.com)**. We're happy to help.

We can't give hints on the SQL questions or the ticket scenarios themselves, since those are what we're hoping to learn from. If something in them is unclear, make a reasonable assumption and note it in your answer.

## Good luck, and thanks again!
