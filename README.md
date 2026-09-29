# North Terrace Daily Task — V3.8 Production

Live operations and daily-task application for North Terrace Service Station.

## Live apps

### North Terrace General View
- URL: https://sivaseran.github.io/NorthTerraceDailyTask/
- Installed name: **North Terrace General View**
- Short name: **NT General**
- Opens directly to the shared live operations view; no login is required to view it.
- Designed primarily for the shared store tablet, with a compact responsive phone layout.

### North Terrace Staff Tasks
- URL: https://sivaseran.github.io/NorthTerraceDailyTask/staff-app/
- Installed name: **North Terrace Staff Tasks**
- Short name: **NT Staff**
- Separate installable PWA for individual staff access using the existing staff PIN workflow.

## PWA configuration

The two apps have separate PWA identities, manifests, scopes, service workers, caches and icons.

General View:
- Manifest ID: `/NorthTerraceDailyTask/`
- Start URL: `/NorthTerraceDailyTask/`
- Scope: `/NorthTerraceDailyTask/`

Staff Tasks:
- Manifest ID: `/NorthTerraceDailyTask/staff-app/`
- Start URL: `/NorthTerraceDailyTask/staff-app/`
- Scope: `/NorthTerraceDailyTask/staff-app/`

Both use the North Terrace theme:
- Theme/background: `#1A1F2B`
- Electric-blue accent: `#3DB4F2`

## V3.8 presentation changes

- North Terrace charcoal/navy + electric-blue visual theme.
- Separate General View and Staff Tasks PWA identities and icons.
- Compact mobile General View with reduced header/navigation space.
- Current operational slot prioritised on mobile.
- Tablet remains the primary operations-board layout.
- Existing task completion, scheduling, assignment, reporting, alerts and Firebase workflows are retained.

## Deployment

The contents of this package belong directly in the root of the GitHub repository `NorthTerraceDailyTask`.
Do not upload the package as an extra nested folder.

The `staff-app/` directory must remain as a subfolder.

For Android deployment, Samsung Internet can be used to open each live URL and install/add each PWA separately.
