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
