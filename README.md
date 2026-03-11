# Technical Support Engineer Assessment

Welcome! Thank you for taking the time to complete this technical assessment for the Technical Support Engineer position at Cargas.

## Overview

This assessment is designed to evaluate your SQL fundamentals and support communication skills. It consists of two main sections:

1. **SQL Questions** - Testing your ability to query and analyze data
2. **Support Ticket Scenarios** - Testing your customer communication and problem-solving skills

**Estimated Time:** Less than 1 hour total

**Important:** This is a take-home assessment. Please complete it independently and submit your work by the deadline provided in your email.

## Getting Started

### What You'll Need

- **SQL Server** (or SQL Server Express - free download)
  - Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- **SQL Server Management Studio (SSMS)** or any SQL client
  - Download: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
- **Text editor** for writing your support ticket responses (Word, Google Docs, Notepad, etc.)

## Part 1: SQL Assessment

### Step 1: Set Up the Test Database

1. Open SQL Server Management Studio (or your SQL client)
2. Connect to your local SQL Server instance
3. Create a new database called `TSE_Assessment` (or any name you prefer)
4. Open the file `sql/setup_database.sql` from this assessment package
5. Execute the entire script to create tables and insert test data
6. Verify the setup by running:
   ```sql
   SELECT COUNT(*) FROM Customers;
   SELECT COUNT(*) FROM Products;
   SELECT COUNT(*) FROM Orders;
   SELECT COUNT(*) FROM OrderItems;
   ```
   You should see 50 customers, 30 products, 68 orders, and 68 order items.

### Step 2: Answer the SQL Questions

1. Open the file `sql/sql_questions.md`
2. Read each question carefully
3. Write SQL queries to answer each question
4. Save your queries in a file named `[YourName]_sql_solutions.sql`
   - Example: `JohnDoe_sql_solutions.sql`
5. Include comments in your file indicating which question each query answers

---

## Part 2: Support Ticket Scenarios

### Step 1: Read the Scenarios

1. Open the file `support/ticket_scenarios.md`
2. Read all customer scenarios carefully

### Step 2: Write Your Responses

1. Create a file named `ticket_scenarios_answers.md` in the root of your repository
2. Write a professional support ticket response for each scenario
3. Label your responses clearly (Scenario 1, Scenario 2, Scenario 3, Scenario 4, Scenario 5)

---

## Submission

### What to Submit

Please add the following files to your repository:

1. `[YourName]_sql_solutions.sql` - Your SQL query answers
2. `ticket_scenarios_answers.md` - Your support ticket responses

### How to Submit

**Option 1: Fork and Submit (Recommended)**
1. Fork this repository to your own GitHub account
2. Add your solution files to the forked repository
3. Commit and push your changes
4. Return the link to your repository to HR

**Option 2: Clone and Submit**
1. Clone this repository to your local machine
2. Add your solution files to the cloned repository
3. Create a new repository on GitHub (or your preferred git hosting service)
4. Push your changes to your new repository
5. Return the link to your repository to HR

---

## Questions or Technical Issues?

If you encounter technical difficulties setting up the database or have questions about the assessment instructions, please contact:

**Adam Elchert (aelchert@cargas.com)**

**Important:** Questions about how to solve specific SQL problems or support scenarios are part of the assessment. We can help with technical setup issues, but not with the answers themselves.

## Good Luck!
