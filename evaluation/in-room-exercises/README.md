# In-Room Written Exercises

Open `index.html` in Chrome, Edge or Safari. No server, no internet, no install.

## Running it
1. Open `index.html`, hand over the laptop, have the candidate enter their name and click **Begin**. It goes full screen.
2. They work through 3 exercises in order; Exercise 2 and 3 appear only after submitting the one before. They can click back to any earlier exercise to view and edit it.
3. Work autosaves in the browser (localStorage) every few seconds. A closed tab or crash can be resumed from the start screen.
4. **Optional, Chrome/Edge:** click **Autosave to folder…** once at the start and pick a folder. It then keeps `<name>_live.md` up to date as they type, and writes `<name>_after_exercise_N.html` and `.md` each time they submit an exercise. Safari/Firefox can't write to a folder, so there each submit downloads the .html and .md to the Downloads folder instead. After a page reload, click the button again to re-pick the folder.
5. At the end, use **Download report (.html)** or **.txt**. **Download copy** in the top bar works at any point.

Open `index.html#interviewer` to make the Exercise 1/2/3 buttons clickable (to preview or jump ahead before the candidate gets there).

## What it does to discourage AI use
- Paste, cut, copy, drag-and-drop and right-click are blocked in the editor. The brief can't be selected or copied.
- Window switches, full-screen exits, blocked paste attempts and large one-shot insertions are logged and appear in the report.

## What it can't do
A web page can't see a phone on the desk, a second laptop, or someone retyping the brief into another tool. Treat the log as a deterrent and a conversation starter, not proof. Sit in the room, use a laptop you control, and ask them to walk through their reasoning afterward.

## Files
- `index.html`, `style.css`: layout
- `exercises.js`: the three candidate briefs (edit text here). Exercise 3 is a messy ticket to summarize; internal notes are pale yellow (`.msg.internal`), like Zendesk.
- `app.js`: editor, autosave, lockdown, export
