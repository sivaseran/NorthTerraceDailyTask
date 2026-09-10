# North Terrace Daily Task App — V1.2 Full Schedule

## What changed
This build replaces the 10-task starter template with the complete task rows transcribed from the two supplied North Terrace master sheets:

- AM work list: 05:30–14:00
- PM work list: 14:00–22:00
- 46 master task rows in total
- Monday–Sunday assignment/timing data
- Photo reminder flags
- The AM "Cooking and check temperature every Hour" task generates hourly daily checkpoints

## Loading the full schedule
1. Upload/replace the V1.2 files in GitHub.
2. Open the deployed app and log in as Manager.
3. Open **Setup**.
4. Click **Load Full North Terrace Schedule**.
5. Confirm the warning.

The setup will:
- replace the old `weeklyTemplates` starter records,
- rebuild today's `dailyTasks`,
- keep all `users` and PINs unchanged.

Current test completions/reassignments for today will be cleared when today's tasks are rebuilt.

## Assignment labels preserved from the AM sheet
The AM sheet uses operational labels rather than numeric staff IDs:
- `WHO OPEN`
- `FLOOR`
- `DONNA`
- `PARTH`

These are intentionally preserved rather than guessed. They appear in General/Manager views. They are not yet mapped to a PIN staff account, so those AM role-labelled tasks will not appear under a numbered staff login until a mapping rule is added.

## Source details preserved
- PM tasks retain their day-specific staff numbers and day-specific times.
- Inactive/black cells are not generated on that day.
- Friday pump-cleaning assignment shown as `1-D` in the supplied sheet is preserved as `1-D`.
- Friday/Saturday closing rows shown as 20:00–23:00 are preserved even though the PM sheet heading says 14:00–22:00.

## Expected daily task count
Because inactive tasks vary by weekday and the hourly AM task expands into checkpoints:
- Mon: 50 daily checkpoints
- Tue: 53
- Wed: 49
- Thu: 50
- Fri: 50
- Sat: 53
- Sun: 46

## Firebase collections
- `users`
- `weeklyTemplates`
- `dailyTasks`
- `shiftCover`

## Development security
Firestore rules are currently open for V1 testing. Tighten them before routine operational use.


## V1.3 — Weekly planning experience
- Dynamic page heading: Today at a glance / Week at a glance
- Correct Monday–Sunday date range in Week view
- Seven-day workload summary cards with AM/PM counts
- All / AM / PM filters
- Separate collapsible AM and PM operational sections
- Tasks grouped into source time blocks
- Today's day/column highlighted
- Sticky day header and sticky task column
- Numeric assignments displayed as Staff 1, Staff 2, etc.
- Repeated day times hidden when they match the usual task time
- Day-specific time differences remain visible
- Clear Photo and Hourly badges
