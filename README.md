# North Terrace Operations — V1.1 UI/UX Polish

Firebase-connected daily task management app for North Terrace Service Station.

## V1.1 improvements
- Charcoal + electric-blue visual system across Staff, General and Manager views
- Clear loading, success, warning and error feedback
- Toast notifications for completed/saved/reassigned actions
- Saving/loading button states to prevent double clicks
- Staff completion feedback with timestamp and 8-second Undo option
- Task reassignment validation and Undo option
- Whole-shift cover validation + confirmation dialog showing how many tasks will move
- Unique Staff ID and PIN validation before saving a user
- Staff PIN exactly 4 digits; manager PIN 4–8 digits
- Create/edit users from Manager → Staff & PINs
- Dedicated Manager Settings screen to change the current manager PIN
- Empty states instead of blank screens
- Skeleton loading states
- Online/offline indicator in the header
- Improved mobile task cards and touch targets
- Accessible focus states and status labels that do not rely on colour alone
- Updated PWA/service-worker behaviour with an update notification for future releases

## Existing Firebase collections
- `users`
- `weeklyTemplates`
- `dailyTasks`
- `shiftCover`

No database migration is required for this UI update.

## Important current scope
The Firebase workflow is live and working, but the weekly template still contains the temporary starter tasks. The complete AM + PM North Terrace master schedule will be loaded separately after this UI version is tested.

## GitHub update
Replace the existing project files with the files from this package. Two files are new and must also be added:
- `js/ui.js`
- `js/login.js`

After deploying, close all open North Terrace app tabs and reopen the site. If an older cached V1 remains visible, use a hard refresh (`Ctrl + Shift + R`) and close/reopen the tab so the new service worker can activate.
