# Hot Food & Compliance — Final Build Candidate

Feature flag remains **OFF by default** for safe deployment.

Implemented:
- Manager-controlled enable/disable guard. Existing application remains usable with Hot Food disabled.
- Product master, weekday Initial Cooking Plan and configurable core/holding thresholds, eligibility interval, cooking cut-off and holding duration.
- Initial Cooking, New Cooking / Top Up and General View Start Hot Food workflow.
- Multiple core readings for Reheat / Retest; failed final core can be wasted.
- Batch/session records, FIFO stock accounting and separate batch sell-out times.
- Fixed :55 hot-holding checks, current shelf quantity, lowest temperature, voluntary waste reasons/comments and automatic full waste on failed holding temperature.
- Dynamic holding-expiry tasks, early-removal reasons, actual removal time and stock-discrepancy audit when physical waste exceeds the system estimate.
- Future temperature/expiry task cancellation when stock closes, without deleting historical records.
- Retrospective cooking and catch-up handling for multiple overdue checks using one genuine current reading.
- General View PIN and personal Staff PWA completion flows.
- Automatic assignment using availability + lowest slot workload.
- CountryChoice-style Production Control and Hot Holding reports, date/week/range preview, print/save-PDF flow, exceptions and per-week sign-off status across multi-week reports.
- Monday-Sunday Manager sign-off, exception comments, staff lock, reopen/re-sign history.
- Manager corrections with original -> corrected audit entries.
- Combined filterable Audit History.

Safety/rollout:
- Hot Food is OFF by default.
- Disabling is blocked while active batches or outstanding Hot Food tasks exist.
- Existing Daily Tasks, Effort Allocation, Staff Assignment, Shift Cover and non-Hot-Food reports are not intentionally changed.
- Live Firebase mutation/end-to-end testing has NOT yet been run. This ZIP is the candidate for the planned test stage.
