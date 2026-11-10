// Candidate-facing briefs only. No answer key lives in this folder.
window.EXERCISES = [
  {
    id: 1,
    title: "Reply to the customer and their manager",
    audience: "Dana Whitfield (Billing Supervisor) and Tom Brandt (Director of Operations)",
    confirm: "Submit and go to Exercise 2? You can come back and edit this one at any time.",
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
    confirm: "Submit and go to Exercise 3? You can come back and edit this one at any time.",
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
    title: "Summarize a messy ticket",
    audience: "A teammate taking over this ticket tomorrow morning",
    confirm: "This is the last exercise. Submit and finish? You can still go back and edit afterward.",
    brief: `
<h2>Exercise 3: Summarize a messy ticket</h2>

<h3>Scenario</h3>
<p>This is a <strong>different customer and a different problem</strong> from the first two exercises.</p>
<p>It's <strong>3:00 PM Monday</strong>. Lena, the TSE who has been working this ticket, is going off shift. You are picking it up tomorrow morning, and so is another teammate who has never seen it. The thread below is everything so far: customer emails, plus Lena's and Raj's internal notes (shown on a pale yellow background, like in Zendesk). It's long and out of order in places.</p>

<h3>Ticket thread</h3>
<div class="ticket-hd"><div class="ts">RE: RE: FW: drivers not seeing deliveries??</div><div class="tm">Customer: Prairie Valley Propane</div></div>

<div class="msg"><div class="av">MD</div><div class="mb"><div class="mh"><b>Marcus Delgado</b> <span class="sub">Dispatch Manager, customer</span><span class="mt">Mon 7:12 AM</span></div><div class="mx">Drivers can't see their deliveries on the tablets this morning. 6 of our 14 have nothing. Need this fixed NOW, we have 140 stops today.</div></div></div>

<div class="msg agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b> <span class="sub">Cargas TSE</span><span class="mt">7:31 AM</span></div><div class="mx">Hi Marcus, sorry about this. Can you tell me which drivers, what version of the app they're on, and whether the deliveries show up in the office system?</div></div></div>

<div class="msg"><div class="av">M</div><div class="mb"><div class="mh"><b>Marcus</b><span class="mt">7:44 AM</span></div><div class="mx">Office system has everything. Kevin, Aaron, Tomas, Dee, Rob and Sam have nothing. Not sure on the version. Also while I have you, can you tell me why the Friday delivery report prints two copies? It's been like that for weeks.</div></div></div>

<div class="msg"><div class="av">M</div><div class="mb"><div class="mh"><b>Marcus</b> <span class="sub">forwarding a text from Kevin, a driver</span><span class="mt">8:20 AM</span></div><div class="mx">Kevin says his tablet shows "last sync Sat 6:02 PM." So it's been broken since Saturday. You guys must have changed something over the weekend. Sent from my iPhone</div></div></div>

<div class="msg internal agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b><span class="tag">Internal note</span><span class="mt">8:35 AM</span></div><div class="mx">Checked the app server. "EF Sync Service" is Stopped. Event log shows it stopped Sun 11:48 PM with "There is not enough space on the disk." D: drive has 0 bytes free.</div></div></div>

<div class="msg internal agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b><span class="tag">Internal note</span><span class="mt">8:52 AM</span></div><div class="mx">D:\\SQLBackups is 212 GB. It's normally about 40 GB. The backup retention setting is "keep all" and the folder has files going back to Oct 27. No idea who changed it.</div></div></div>

<div class="msg agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b> <span class="sub">to Marcus</span><span class="mt">9:05 AM</span></div><div class="mx">I think I found it. The sync service stopped because the server ran out of disk space. I'm freeing space now and restarting it. It should be working in 15 to 20 minutes.</div></div></div>

<div class="msg internal agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b><span class="tag">Internal note</span><span class="mt">9:40 AM</span></div><div class="mx">Moved backups older than 7 days to the archive share. 160 GB free now. Restarted EF Sync Service at 9:32.</div></div></div>

<div class="msg"><div class="av">M</div><div class="mb"><div class="mh"><b>Marcus</b><span class="mt">9:50 AM</span></div><div class="mx">Kevin and Aaron can see their deliveries now. Tomas, Dee, Rob and Sam still have nothing.</div></div></div>

<div class="msg"><div class="av">PN</div><div class="mb"><div class="mh"><b>Priya Natarajan</b> <span class="sub">IT contractor for the customer, added to thread</span><span class="mt">10:05 AM</span></div><div class="mx">Hi, I manage their IT. I heard there's a VPN issue? We did swap their firewall Thursday, could that be related? Also, we moved the nightly backup job onto the D: drive last week because the NAS was full. I didn't tell anyone, sorry.</div></div></div>

<div class="msg internal agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b><span class="tag">Internal note</span><span class="mt">10:12 AM</span></div><div class="mx">Tablets for Tomas, Dee, Rob, Sam are on app v4.1.2. Kevin and Aaron are on v4.2.0. Wondering if 4.1.x uses a different sync endpoint. Not confirmed. Asked Raj (Tier 2).</div></div></div>

<div class="msg"><div class="av">M</div><div class="mb"><div class="mh"><b>Marcus</b><span class="mt">10:30 AM</span></div><div class="mx">Dee says she gets a login error now instead of a blank screen. Sam's tablet is in his truck and he's out until noon. Rob called in sick so I moved his route to Dee.</div></div></div>

<div class="msg internal agent"><div class="av">R</div><div class="mb"><div class="mh"><b>Raj</b> <span class="sub">Tier 2</span><span class="tag">Internal note</span><span class="mt">10:48 AM</span></div><div class="mx">4.1.x shouldn't be affected by the disk issue. Could be a separate problem. Their routes were rebuilt Friday, so check whether routes show as Unassigned for today. Not sure.</div></div></div>

<div class="msg internal agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b><span class="tag">Internal note</span><span class="mt">11:15 AM</span></div><div class="mx">Route Assignment for 11/3: Tomas and Sam are assigned. Dee and Rob show Unassigned (Rob's move to Dee isn't in the system). So Dee/Rob is a dispatch issue, not ours. Tomas and Sam still unknown, probably the 4.1.2 version.</div></div></div>

<div class="msg agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b> <span class="sub">to Marcus and Priya</span><span class="mt">11:20 AM</span></div><div class="mx">Marcus, can you assign Dee's and Rob's routes in the office system? Priya, can you update Tomas's and Sam's tablets to 4.2.0?</div></div></div>

<div class="msg"><div class="av">M</div><div class="mb"><div class="mh"><b>Marcus</b><span class="mt">11:42 AM</span></div><div class="mx">We're running those four off paper tickets right now, about 60 stops. I don't know how to update tablets, Priya does that. Please just tell me when it's fixed.</div></div></div>

<div class="msg"><div class="av">P</div><div class="mb"><div class="mh"><b>Priya</b><span class="mt">12:30 PM</span></div><div class="mx">Pushed 4.2.0 to Tomas's tablet remotely. Will do Sam when he's back at his truck. Also, which disk was full? Is that on us?</div></div></div>

<div class="msg"><div class="av">M</div><div class="mb"><div class="mh"><b>Marcus</b><span class="mt">1:15 PM</span></div><div class="mx">Tomas can see his deliveries now. I assigned Dee's route. Dee still gets the login error though.</div></div></div>

<div class="msg internal agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b><span class="tag">Internal note</span><span class="mt">2:10 PM</span></div><div class="mx">Backup retention on the server is still "keep all." The job writes about 6 GB a night. At that rate D: fills again in a few weeks. I haven't changed it because I don't know whether the customer wants it changed or moved back to the NAS.</div></div></div>

<div class="msg"><div class="av">M</div><div class="mb"><div class="mh"><b>Marcus</b><span class="mt">2:20 PM</span></div><div class="mx">Can you also check the Friday report printing twice? And we lost about four hours on 60 stops today. Is there going to be a credit?</div></div></div>

<div class="msg agent"><div class="av">L</div><div class="mb"><div class="mh"><b>Lena</b><span class="mt">3:00 PM</span></div><div class="mx">Marcus, I'm handing this to a colleague who will pick it up first thing tomorrow. You'll have an update from us by 9 AM.</div></div></div>

<div class="task"><strong>Your task:</strong> Write the handoff summary for the teammate taking over tomorrow. It should be something they could read in about a minute and then act on.</div>
`
  }
];
