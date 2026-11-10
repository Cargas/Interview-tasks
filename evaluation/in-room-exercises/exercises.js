// Candidate-facing briefs only. No answer key lives in this folder.
window.EXERCISES = [
  {
    id: 1,
    title: "Reply to the customer and their manager",
    audience: "Dana Whitfield (Billing Supervisor) and Tom Brandt (Director of Operations)",
    confirm: "Once you submit, you can't come back to this exercise. Submit and go to Exercise 2?",
    brief: `
<h2>Exercise 1: Reply to the customer and their manager</h2>

<h3>Scenario</h3>
<p>You are a Technical Support Engineer at Cargas. A customer contacted support about a billing problem. It has been investigated and <strong>fixed</strong>. You are now writing the reply to close the loop.</p>

<h3>Ticket thread so far</h3>
<p class="from">Dana Whitfield, Billing Supervisor, Ridgeline Propane &amp; Fuel<br>Wed Oct 29, 7:48 AM &middot; Subject: Invoices WRONG - customers calling us already</p>
<blockquote>Our overnight invoices went out and the tax line is way too high on a bunch of them. I've had four customers call me already and it's not even 8 AM. This is our name on these invoices, not yours. I need someone to tell me what happened and when it's getting fixed.</blockquote>

<p class="from">Automated reply, 8:05 AM</p>
<blockquote>Thank you for contacting Cargas Support. Your request has been received. Please provide your database name, version, and a screenshot of the issue.</blockquote>

<p class="from">Dana Whitfield, 8:21 AM</p>
<blockquote>I already told you what's wrong. I have 200+ invoices out there. Why am I being asked for a screenshot?</blockquote>

<p class="from">Tom Brandt, Director of Operations, Ridgeline (added to the thread, 9:30 AM)</p>
<blockquote>I've been brought into this. This is the second billing issue we've had since the spring and our customers are the ones paying for it. I need to understand exactly what happened, how many customers are affected, and what we're doing so this doesn't happen again. If I don't have a good answer today we'll need to talk about whether this is working for us.</blockquote>

<h3>Where things stand (as of 12:15 PM)</h3>
<ul>
  <li>The cause was found and corrected on our side. A tax-rate update job loaded some tax rates twice, which charged the county tax line twice on invoices for certain counties (Harlan and Pike).</li>
  <li>212 invoices were affected. The average overcharge was about $19.50 per invoice, $4,126.40 in total.</li>
  <li>Corrected invoices have been generated and are being sent to the affected customers now.</li>
  <li>19 of the affected customers paid by card auto-pay. Refunds for those have been submitted and will post in roughly 3 to 5 business days, depending on the card issuer.</li>
  <li>We are working on changes to stop this from happening again. The work is in progress; there is no firm date yet.</li>
  <li>Our earlier automated reply asked for information we already had.</li>
</ul>

<div class="task"><strong>Your task:</strong> Write a reply to the thread, addressed to both Dana and Tom.</div>
`
  },
  {
    id: 2,
    title: "Internal summary for the VPs",
    audience: "VPs of Engineering, Customer Experience, and Sales",
    confirm: "Once you submit, you can't come back to this exercise. Submit and go to Exercise 3?",
    brief: `
<h2>Exercise 2: Internal summary for the VPs</h2>

<h3>Scenario</h3>
<p>Same incident as the last exercise: Ridgeline Propane &amp; Fuel, 212 invoices with incorrect tax, a frustrated billing supervisor, and a Director of Operations who says &ldquo;we'll need to talk about whether this is working for us.&rdquo;</p>
<p>It's now <strong>2:30 PM</strong> on Wednesday. Your support lead has asked you to send a short note to the VPs of Engineering, Customer Experience, and Sales so they aren't surprised if the customer calls them. You have the internal notes below.</p>

<h3>Internal Zendesk notes (technical)</h3>
<pre>09:15  Checked invoice INV-48812 (Harlan Co.). Tax line
       "County Excise" = $0.08/gal. Expected $0.04/gal.
       Same on INV-48817 (Pike Co.). Not on invoices for
       Lowell Co. (rate correct).

09:22  Reviewed customer audit log for tax config edits in
       past 30 days. None. (Customer did not change anything.)

09:38  SELECT JurisdictionName, COUNT(*) FROM FuelTaxRate
       WHERE EffectiveDate = '2025-10-01'
       GROUP BY JurisdictionName HAVING COUNT(*) > 1;
       -> 41 jurisdictions returning 2 rows each. Expected 1.
       Total rows with EffectiveDate 10/01 = 123. Expected 82.

09:44  Duplicates share identical values; RateID gaps show
       they were inserted in two separate runs.

09:49  Windows event log on DB server: Event ID 1074
       (restart initiated by Windows Update) at 22:20 on 10/28.
       Task Scheduler history: TaxRateUpdate_Q4 started 22:00,
       restarted 22:31 ("restart on failure" / "run if missed"
       enabled). Task result: 0x0 (success).

09:52  Cause: task was interrupted mid-run by patch reboot,
       re-ran from the start, script has no existence check.
       The nightly invoice view joins FuelTaxRate on
       jurisdiction + effective date, so duplicate rows
       doubled the tax line.

10:05  Dev hotfix approved by Support Lead. Backed up
       FuelTaxRate to FuelTaxRate_bak_20251029.

10:40  Deleted 41 duplicate rows (kept MIN(RateID)).
       Row count with 10/01 date now = 82.

11:15  Recalc of 212 invoices in TEST. Spot-checked 5.
       Matches expected.

11:50  Production recalc complete. Corrected invoices
       reissued, originals voided.

13:00  19 card auto-pay refunds submitted to processor.

14:10  Checked other customers on same patch group (3).
       Cedar Valley Oil also has duplicates (29 rows).
       Their next invoice run is tonight.
       Duplicates removed 14:25. No invoices affected.</pre>

<div class="task"><strong>Your task:</strong> Write the note to the three VPs (Engineering, Customer Experience, Sales). Use whatever format you think they would actually read.</div>
`
  },
  {
    id: 3,
    title: "Post-mortem",
    audience: "Leadership, Engineering, Support, and CX (who will also share it with the customer)",
    confirm: "This is the last exercise. Submit and finish?",
    brief: `
<h2>Exercise 3: Post-mortem</h2>

<h3>Scenario</h3>
<p>Same incident. It's been a few days. Leadership has asked for a post-mortem. <strong>It will be shared with everyone: leadership, Engineering and Support, and our CX team, who will also share it with the customer.</strong></p>
<p>Below is the raw timeline from the team's notes, including internal details.</p>

<h3>Raw timeline (all times Central)</h3>
<pre>TUE OCT 28
10:00 PM  Scheduled task TaxRateUpdate_Q4 starts on DB server.
          (Task created by Implementation on Oct 21;
          scheduled for 10 PM.)
10:14 PM  Task has inserted 41 of 82 tax rate rows into
          FuelTaxRate.
10:20 PM  Windows Update forces restart. (Patch window for this
          server group is 10 PM to 2 AM; set by IT Ops in
          September.)
10:31 PM  Server back online. Task Scheduler re-runs
          TaxRateUpdate_Q4 from the beginning (restart-on-
          failure is enabled).
10:33 PM  Task completes: inserts all 82 rows. Logs "Success,
          exit code 0." 41 rows from the first run are now
          duplicated.

WED OCT 29
2:00 AM   Nightly invoice generation starts. For duplicated
          jurisdictions, the tax lookup returns two rows and
          the county excise line is doubled.
6:10 AM   212 invoices emailed to Ridgeline's customers.
          19 customers on card auto-pay are charged.
7:48 AM   Dana Whitfield (Ridgeline billing) opens a ticket:
          invoices have wrong tax; customers already calling.
8:05 AM   Automated reply asks for DB name, version,
          screenshot. (Info we already have.)
8:21 AM   Dana replies, frustrated.
8:40 AM   Ticket assigned to a TSE.
9:15 AM   TSE confirms tax line is double on sample invoices.
9:22 AM   TSE checks audit log for tax config changes by the
          customer. None. (This took about 40 minutes of the
          investigation.)
9:30 AM   Tom Brandt (Ridgeline Director of Ops) added to
          thread. Says "second billing issue since spring."
9:38 AM   TSE queries FuelTaxRate and finds 41 duplicated
          jurisdictions.
9:52 AM   Cause identified: interrupted run + re-run + script
          has no existence check.
10:05 AM  Support Lead approves hotfix; table backed up.
10:40 AM  41 duplicate rows deleted.
11:15 AM  Recalc of 212 invoices in test environment.
          Sample verified.
11:50 AM  Production recalc done. Corrected invoices reissued;
          originals voided.
12:15 PM  Status reply sent to Dana and Tom.
1:00 PM   19 refunds submitted to card processor.
2:10 PM   Other customers in the same patch group checked.
          Cedar Valley Oil has 29 duplicate rows; their
          invoice run is that night.
2:25 PM   Cedar Valley duplicates removed. No invoices
          affected.
2:30 PM   Internal summary sent to VPs.

THU OCT 30
9:00 AM   Dev begins work on a unique constraint and an
          idempotent script. No release date yet.
4:00 PM   Dana confirms refunds visible to her customers. Two
          of her customers had already disputed the charge
          with their card issuer.</pre>

<div class="task"><strong>Your task:</strong> Write the post-mortem. Think about what the audience needs, and what you should and shouldn't include given that the customer will see it.</div>
`
  }
];
