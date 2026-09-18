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

## V2.3 — Report tabs and shared filters

Reports now have top tabs:
- Overview
- Staff
- Tasks
- Time Slots
- Exceptions / Audit

Shared report filters:
- Today
- This Week
- This Month
- Custom Range
- Staff selector

When a specific staff member is selected, an additional involvement filter appears:
- Assigned to them
- Completed by them
- Either assigned or completed

The selected date/staff scope remains active when switching report tabs.
CSV export uses the currently filtered records.

## V2.4 — Dense desktop Schedule Editor

Desktop Schedule Editor now uses an operations-board layout:
- compact slot header
- capacity displayed inside the slot header
- desktop columns for Task / Assignee / Effort / Status / Edit
- task rows reduced to approximately 45–50px
- larger, stronger assignee and effort values
- Unassigned highlighted in amber
- technical source assignment hidden from normal view and shown only inside Edit
- no separate full-width capacity strip
- compact Add Task action

Mobile remains card-based and stacks the same information cleanly.
Advanced Edit All and single-row Edit continue to work as before.

V2.3 report tabs, date filters, staff filters and filtered CSV export are preserved.

## V2.4.1 — Parth identity merge

Canonical identity:
- Staff 1 = Parthy
- PIN = 1111

Automatic cleanup when Manager opens the new version:
- any separate user named `Parth` is deactivated and marked as merged into `staff1`
- recurring weekly schedule rules assigned to Parth are reassigned to Parthy
- daily tasks assigned/originally assigned to Parth are reassigned to Parthy
- historical `completed by Parth` records are normalized to Parthy for consistent reporting
- existing task status, completion timestamps and history are preserved
- assignee dropdown defensively hides duplicate Parth identities

## V2.5 — Shift Cover Scheduler

Shift Cover is now date-based like Schedule Editor:
- previous / next date arrows
- date picker
- Today shortcut
- matching-task preview
- workload/capacity preview for the covering person

Two cover scopes:
1. **Apply to This Date Only**
   - reassigns only incomplete matching tasks on the selected date
   - recurring schedule is unchanged

2. **Every <weekday> From This Date Onward**
   - creates a permanent future shift-cover rule for the selected weekday + operational slot
   - previous dates are preserved
   - already-generated matching future tasks are updated
   - dates generated later automatically follow the rule
   - supports recurring hourly tasks correctly because the rule applies at slot level

A later future-cover rule can be created from a newer date to change the arrangement again.

## V2.6 — Tablet Live General View

General View is optimized for an always-on store tablet:
- today's current operational slot is expanded automatically
- all other time slots start collapsed
- tap a slot header once to expand/collapse it
- when operational time moves into the next slot, that new slot becomes the default expanded slot
- the current slot is visually highlighted
- overdue tasks are highlighted in red

### Focus mode
- double-tap a slot header to make that slot fill the app screen
- double-tap the header again, press `Normal view`, or press Escape to return
- implemented as an in-app focus screen for better tablet compatibility than browser Fullscreen API

### Overdue alerts
The `Enable Alerts` button:
- requests browser notification permission when supported
- enables a three-beep overdue alarm
- shows a grouped system notification when new tasks become overdue
- vibrates on supported Android devices
- tries to acquire Screen Wake Lock so the tablet remains awake while the General View is active
- gives one alert when each task first becomes overdue rather than sounding continuously

Task due/overdue transitions are recalculated locally every 30 seconds and do not add continuous Firestore reads.

Important platform limitation: sound/notification monitoring works while the PWA/page is running. A pure GitHub Pages client app cannot guarantee timed alarms after the tablet closes or the browser/OS fully suspends the app; true background alarms would require a backend push/scheduled-notification service.

## V2.7 — Smart Slot Alerts

General View still opens in normal mode. Focus mode is entered only by double-tapping a slot.

If focus mode is active when time moves into the next operational slot, the app automatically keeps focus mode active and switches the full-screen view to the new current slot.

Alert schedule is now slot-based rather than frequent polling:
- one reminder 60 minutes before slot end
- one reminder 30 minutes before slot end
- one due alert at slot end
- due-time sound = three beeps once only
- each milestone fires only once per slot/day
- no repeated overdue alarm every 20/30 seconds

Exact browser timers handle slot boundaries and alerts. A once-per-minute housekeeping timer remains only for the visible clock and midnight/day rollover, not for overdue polling.

General View date navigation is visually aligned more closely with the Shift Cover Scheduler.

## V2.7.1 — Final release

Final production hardening:
- Manager Schedule Editor past dates are fully read-only.
- Historical task rows remain visible for review/audit.
- Edit, Advanced Edit All, Add Task, Save, Skip, Remove and recurring-change actions are unavailable on past dates.
- A clear historical read-only banner is shown with a Go to Today shortcut.
- Additional event-handler guards prevent stale/cached UI controls from mutating historical records.

V2.7.1 includes all functionality from V2.7:
- roster/PIN management and Parth → Parthy cleanup
- dense Schedule Editor
- date-specific and recurring schedule changes
- Reports tabs, date/staff/involvement filters and filtered CSV
- date-based Shift Cover with one-date or future same-weekday scope
- General View current-slot/collapsible tablet workflow
- double-tap focus mode with automatic current-slot handover
- 60-minute / 30-minute / due-time slot alerts, with three due-time beeps once only
- best-effort Screen Wake Lock

## V2.8 — Bulk Task Setup
Manager Bulk Setup provides one-table editing of recurring assignee and effort values.
Filters: weekday, slot, Unassigned only, Effort not set only.
Quick effort: 5/10/15/20/30/45/60 min.
Supports row selection, copy Assignee Down, copy Effort Down, and one Save All Changes action.
Historical records remain unchanged; incomplete generated today/future snapshots are refreshed.

## V2.8.1 — Bulk Edit Existing Firebase Tasks

Bulk Setup now loads real `dailyTasks` records from a selected date with `ensure:false`, so opening the screen never creates or recreates tasks.

Editable fields:
- Task name
- Slot
- Assignee
- Effort
- Remove

Two save scopes:
1. Save Changes to This Date
   - updates only the loaded daily records
   - disabled for historical dates to preserve audit history

2. Apply Changed Tasks to Future Schedule
   - uses each row's existing `templateTaskId`
   - applies name / slot / assignee / effort from the effective date onward
   - Remove stops that recurring task from the effective date onward
   - if the selected source date is historical, future changes start Today
   - ad-hoc/date-only rows without a template are skipped

This lets management use an already-existing daily schedule as the source instead of recreating tasks one by one.

## V2.8.2 — Existing Bulk Editor fixes

Fixes:
- Historical source dates now apply future changes from the **next occurrence of the same weekday**, not simply from Today.
  Example: using an old Monday as the source on a Friday starts the new recurring rule on the next Monday.
- Hourly recurring tasks such as `Cooking and check temperature every Hour` display their checkpoint time.
- Hourly checkpoint slot is shown as automatic and cannot be manually moved to an incorrect slot.
- Multiple checkpoint rows from one hourly task are consolidated into a single master-template update when applying future changes.
- Saving a current/future date-only change to one hourly checkpoint keeps all checkpoints of that recurring task consistent for task name / assignee / effort.

## V2.8.3 — Weekly Bulk Edit View

Bulk Edit now loads a full Monday–Sunday week from existing Firebase `dailyTasks`.
It still uses `ensure:false`, so missing days are never generated.

Features:
- previous / next week navigation
- This Week shortcut
- choose any date to jump to its Monday–Sunday week
- day filter plus slot / unassigned / missing-effort filters
- day divider rows for Monday through Sunday
- edit task name, slot, assignee, effort, or remove
- quick effort chips across selected rows
- Save Changes to This Week updates only today/future daily records inside the loaded week; historical daily records remain read-only
- Apply Changed Tasks to Future Schedule applies each changed row to its own matching weekday
- historical source rows begin at the next occurrence of that weekday
- hourly checkpoint tasks are consolidated per weekday/master task rather than across the entire week

## V2.8.4 — Weekly Bulk Matrix

Bulk Edit is now a matrix:
- rows = task/master task
- columns = Monday through Sunday
- each existing day-cell contains Assignee + Effort + Remove
- blank cells mean no saved Firebase task exists on that day and are never auto-created
- hourly checkpoint tasks are collapsed into one master-task row/day cell
- day cells preserve their own weekday when applying future changes
- task/slot column is sticky; day headers are sticky for easier large-screen editing
- Save This Week updates only today/future existing daily records
- Apply to Future Schedule updates the recurring master task for that specific weekday

## V2.8.5 — Separate Effort Allocation

Manager navigation now includes a dedicated `Effort Allocation` tab.

Bulk Setup:
- weekly matrix remains for assignee / remove work
- effort controls removed from this page

Effort Allocation:
- separate Monday–Sunday weekly matrix
- tasks as rows, days as columns
- only effort minutes are editable
- existing Firebase daily tasks only (`ensure:false`)
- blank cells are never auto-created
- filter by slot
- show only tasks/cells with missing effort
- quick-select effort buttons: 5/10/15/20/30/45/60 minutes + Clear
- Save Effort to This Week updates only today/future daily records
- Apply Effort to Future Schedule updates the recurring task for the matching weekday
- historical records remain protected

## V2.8.6 — Weekly Effort Template

Effort Allocation has been simplified:
- one effort value per task
- same effort reused on every active weekday
- Monday–Sunday columns contain only a Remove checkbox
- blank cells mean no existing task record exists on that day
- Save Weekly Effort Setup updates current/future daily records and recurring weekday rules
- no assignee editing on the Effort Allocation page
- staff assignment remains a separate step in Bulk Setup

## V2.9 FINAL — Effort → Availability → Assignment workflow

Final manager workflow:

1. Staff Availability
   - Weekly rota stored in `system/staffAvailability`.
   - Pre-populated from the supplied rota image.
   - Corrected Friday hours:
     - Moon 09:30–12:00
     - Himmo 05:30–09:30
   - Uday Monday delivery and Pragash Thursday delivery are intentionally excluded from normal shop-floor availability.
   - Supports split shifts with comma-separated periods.

2. Effort Allocation
   - One effort value per task.
   - Same effort is reused on every active weekday.
   - Monday–Sunday columns are Remove controls only.

3. Staff Assignment
   - Tasks as rows and Monday–Sunday as columns.
   - Assignment only; no effort or removal controls.
   - Assignee dropdown is filtered by the weekly rota.
   - Full task-window coverage is listed first.
   - Partial coverage is listed second.
   - Off-rota staff are hidden unless already assigned, in which case they remain visible with a warning.
   - Unassigned is always available.

All previous schedule editor, shift cover, reports, tablet general view and smart alert features are retained.

## V3.0 FINAL — Full-week task model + hot food temperatures

Task model:
- Every existing master task is populated across all seven weekdays.
- Setup pages use the current weekly template, so Monday–Sunday columns are fully populated even when an old daily snapshot was missing tasks.
- Saved daily values are overlaid where they exist.

Temperature workflow:
- Legacy `Cooking and check temperature every Hour` / old temperature checkpoint template is removed from the active model.
- Nine separate recurring tasks are created every day:
  - 06:30
  - 07:30
  - 08:30
  - 09:30
  - 10:30
  - 11:30
  - 12:30
  - 13:30
  - 14:30
- Each task is named exactly `Check hot food temperature`.
- Each task is shown as a separate row/time in Effort Allocation and Staff Assignment.
- Staff/General operational views provide a Celsius input.
- Temperature is required before the task can be completed and is stored on the daily task record as `temperatureC`.

Migration:
- V3 migration is idempotent and recorded in `system/app.v30Ready`.
- Historical daily records are not rewritten.
- Old temperature daily rows are removed only from today/future.

## V3.0.1 FINAL — Simplified temperature completion + removal flow

Changes:
- `Check hot food temperature` remains as nine separate tasks from 06:30 to 14:30.
- Celsius entry has been removed for now.
- Staff simply press `Complete` like any other task.
- Tasks removed on Effort Allocation are excluded from the Staff Assignment matrix.
- Staff Assignment therefore shows only active tasks that still need an assignee.
