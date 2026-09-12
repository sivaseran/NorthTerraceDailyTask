# North Terrace Operations — V2 Beta

This is the upgraded schedule/workload/reporting build.

## Confirmed fixed slots
- 05:30–09:00
- 09:00–14:00
- 14:00–18:00
- 18:00–20:00
- 20:00–22:00 Sunday–Thursday
- 20:00–23:00 Friday–Saturday

## New in V2
- Day and week date navigation in General View.
- General View task completion using a staff/assignee PIN.
- Keeps Assigned to and Completed by separately.
- Manager Schedule Editor is inline — no separate edit page.
- Change task name, slot, effort, assignee and photo requirement directly in the schedule.
- Slot changes move the row immediately on screen, then Save confirms it.
- Save this date only OR every matching weekday going forward.
- Create new tasks directly inside any slot.
- Cancel this date / stop future recurrence.
- Named assignee management.
- Assignee-only people can exist without a PIN.
- Capacity warnings use Task Effort; blank effort is allowed and ignored.
- Whole-slot cover.
- Detailed management reports: Today / Week / Month / Custom range.
- Staff, Task, Slot and Exceptions report tables.
- CSV export.
- Historical records are never rewritten when future template rules change.

## V2 migration
After deploying, login as Manager → Setup → **Upgrade Schedule to V2**.

This keeps:
- users and PINs
- historical `dailyTasks`

It replaces:
- `weeklyTemplates`

It rebuilds:
- today's `dailyTasks`

Donna and Parth are created as named Assignee records if they do not already exist.
Legacy WHO OPEN / FLOOR assignments become Unassigned for management to allocate to real people.

## Important reporting note
Because this version uses free client-side schedule generation, reports cover dates where a daily schedule record exists. The app does not fabricate historical task records for days that were never generated.

## V2.1 — Team roster + compact editing

Roster:
- Staff 1 — Parthy — 1111
- Staff 2 — Uday — 2222
- Staff 3 — Prashanthy — 3333
- Staff 4 — Suku — 4444
- Staff 5 — Donna — 5555
- Staff 6 — Moon — 6666
- Staff 7 — Himmo — 7777
- Staff 8 — Rishi — 8888
- Staff 9 — Pragash — 9999
- Manager — 0000

People & PINs shows the roster first. Add/Edit details stay collapsed until clicked.
Schedule Editor is compact by default with one-row editing and optional Advanced Edit All.

## V2.2 — Production Manager Navigation

Normal Manager navigation is now:
- Schedule Editor
- People & PINs
- Shift Cover
- Reports

Removed:
- Settings tab — Manager PIN is edited from People & PINs.
- Setup tab — replaced by a one-time initialization banner.

The one-time banner disappears permanently after successful initialization.
A `system/app` Firestore marker records completion so managers do not see setup controls during normal operation.
Existing V2 weekly templates are preserved during initialization; old V1 templates are migrated only when detected.

## V2.2.1 — Task action wording
- "Skip This Date" remains the one-day exception action.
- "Stop recurring from this date" is renamed to "Remove This Task Completely".
- Confirmation clearly states that previous history is preserved while the selected date and future matching occurrences are removed.
