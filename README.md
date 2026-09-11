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
