# Hot Food final test checklist

Keep Hot Food OFF first and regression-test the existing app. Then enable only in a controlled test period.

1. Existing app with Hot Food OFF: General View, Staff App, Manager, Daily Tasks, assignments, shift cover, reports.
2. Manager: products, cooking plan, five settings, enable/disable guard.
3. Initial cooking: planned products, edits, extra products, No cooking required, Start Hot Food.
4. Core temperature: pass, Reheat/Retest sequence, failed-core waste.
5. :55 eligibility: exact 15-minute boundary and later boundary.
6. Holding checks: pass at 63.0, fail at 62.9, current quantity, voluntary partial waste and reasons.
7. FIFO: one product across multiple batches, older-batch depletion, separate sell-out times.
8. Expiry: normal waste, zero waste/sold out, early removal, late entry, physical discrepancy.
9. Overdue checks: several overdue checks closed by one actual current reading; future check remains.
10. Assignment: available staff, workload tie behaviour, General View different-person warning, Staff PWA identity.
11. Reports: production rows, holding rows, late status, waste/sell-out, day/week/month/custom print/PDF.
12. Sign-off: exceptions require comment, staff lock, reopen, correction, re-sign, multi-week status.
13. Audit: settings/product/operational/correction/sign-off events and filters.
14. Disable guard: cannot turn OFF with active batches/outstanding Hot Food tasks; history remains after OFF.
