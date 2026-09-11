import {db,collection,doc,getDocs,setDoc,writeBatch,serverTimestamp} from "./firebase.js";

export const v2NorthTerraceTasks = [
  {
    "id": "am01",
    "taskName": "Cooking and check temperature every Hour",
    "photoRequired": false,
    "recurring": true,
    "frequencyMinutes": 60,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "AUTO",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-14:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "AUTO",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-14:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "AUTO",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-14:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "AUTO",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-14:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "AUTO",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-14:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "AUTO",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-14:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "AUTO",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-14:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 1
  },
  {
    "id": "am02",
    "taskName": "Temperature check, Daily Check",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 2
  },
  {
    "id": "am03",
    "taskName": "Fill up and tidy vape and Spirits Shelve",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 3
  },
  {
    "id": "am04",
    "taskName": "Write the Cigarette, Spirit list, papers AND FILL",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Parth",
            "legacyAssignee": "PARTH",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 4
  },
  {
    "id": "am05",
    "taskName": "Check VR light in the pump (all)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "person:Donna",
            "legacyAssignee": "DONNA",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "WHO OPEN",
            "effortMinutes": null,
            "sourceTime": "05:30-09:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 5
  },
  {
    "id": "am06",
    "taskName": "Sweep the floor, Tidy Coffee machine as when needed",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 6
  },
  {
    "id": "am07",
    "taskName": "Check out of date (Sandwich chiller, Eggs, Bread)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 7
  },
  {
    "id": "am08",
    "taskName": "Wipe and tidy coffee machine (fill up if necessary)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 8
  },
  {
    "id": "am09",
    "taskName": "Just face up Drinks, Crisps, Milk, Sandwiches",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 9
  },
  {
    "id": "am10",
    "taskName": "Wash - trays, Tongues, Probe (Photo)",
    "photoRequired": true,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S1",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "08:00-08:45"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 10
  },
  {
    "id": "am11",
    "taskName": "Fill-up (Drinks, beer, wines)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 11
  },
  {
    "id": "am12",
    "taskName": "Full filling of chocolate from back stock",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 12
  },
  {
    "id": "am13",
    "taskName": "Full filling of crisps from back Stock",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 13
  },
  {
    "id": "am14",
    "taskName": "Full filling of car care and engine oil from Upstairs",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 14
  },
  {
    "id": "am15",
    "taskName": "Fill up other department from upstairs",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 15
  },
  {
    "id": "am16",
    "taskName": "Sweep the floor, Tidy Coffee machine as when needed",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 16
  },
  {
    "id": "am17",
    "taskName": "FILL UP COFFEE INGREDIENTS",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 17
  },
  {
    "id": "am18",
    "taskName": "Face up - Coal Bunker, Adblue, Screenwash",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 18
  },
  {
    "id": "am19",
    "taskName": "Need Gas-Stock Check",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "09:30-12:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 19
  },
  {
    "id": "am20",
    "taskName": "Clear Firex exit rubbish",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 20
  },
  {
    "id": "am21",
    "taskName": "Face up entire shop - Send photo",
    "photoRequired": true,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "12:30-13:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 21
  },
  {
    "id": "am22",
    "taskName": "Send photo of this signed sheet",
    "photoRequired": true,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "13:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "13:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "13:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "13:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "13:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "13:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S2",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "FLOOR",
            "effortMinutes": null,
            "sourceTime": "13:30"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 22
  },
  {
    "id": "pm01",
    "taskName": "Paper Works - Office work (A)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "13:30-14:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "13:30-14:15"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "Any 1 hr"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:00-14:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:00-14:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 23
  },
  {
    "id": "pm02",
    "taskName": "Afternoon shift / Hot food unit cleaning, check oven for clean, oven floor",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:30-15:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:15-14:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "14:00-14:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:00-14:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-15:15"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-15:15"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 24
  },
  {
    "id": "pm03",
    "taskName": "Sweep the floor, then as when needed",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:30-15:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:15-14:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "14:00-14:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:00-14:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-15:15"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-15:15"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:2",
            "legacyAssignee": "2",
            "effortMinutes": null,
            "sourceTime": "14:00-16:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 25
  },
  {
    "id": "pm04",
    "taskName": "Follow the cleaning schedule and face up drinks/crisps; print missing label",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "14:30-16:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "15:15-16:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:2",
            "legacyAssignee": "2",
            "effortMinutes": null,
            "sourceTime": "14:00-16:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 26
  },
  {
    "id": "pm05",
    "taskName": "Fill up (Drinks, Beers, Wine - chiller)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-18:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 27
  },
  {
    "id": "pm06",
    "taskName": "Full filling of crisps from back Stock",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-18:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 28
  },
  {
    "id": "pm07",
    "taskName": "Face up Crisps and Chocolate",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-18:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 29
  },
  {
    "id": "pm08",
    "taskName": "Fill up coffee items in the cabinet",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 30
  },
  {
    "id": "pm09",
    "taskName": "Cleaning the coffee machine and Tango machine, empty coffee bin",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 31
  },
  {
    "id": "pm10",
    "taskName": "Clean the Kitchen Sink",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 32
  },
  {
    "id": "pm11",
    "taskName": "Top up Gloves, Towel, Check Bins (forecourt)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:7",
            "legacyAssignee": "7",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 33
  },
  {
    "id": "pm12",
    "taskName": "Pump Cleaning, pick up litter (Coal Area as well)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:7",
            "legacyAssignee": "7",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "1-D",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 34
  },
  {
    "id": "pm13",
    "taskName": "Send photo to Vijay (after forecourt cleaning)",
    "photoRequired": true,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:7",
            "legacyAssignee": "7",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": false,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": null,
            "sourceTime": ""
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 35
  },
  {
    "id": "pm14",
    "taskName": "Hoover the front door Mat (must Hoover)",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:7",
            "legacyAssignee": "7",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 36
  },
  {
    "id": "pm15",
    "taskName": "Toilet Cleaning - should send photo in floor group",
    "photoRequired": true,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "15 min"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:7",
            "legacyAssignee": "7",
            "effortMinutes": null,
            "sourceTime": "15 min"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15 min"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:5",
            "legacyAssignee": "5",
            "effortMinutes": null,
            "sourceTime": "15 min"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:6",
            "legacyAssignee": "6",
            "effortMinutes": null,
            "sourceTime": "15 min"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "15 min"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:2",
            "legacyAssignee": "2",
            "effortMinutes": null,
            "sourceTime": "15 min"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 37
  },
  {
    "id": "pm16",
    "taskName": "Go to storage once (Follow list) - Top up Back Stock",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:00-19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:30-19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "15:15-19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S3",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-18:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 38
  },
  {
    "id": "pm17",
    "taskName": "Face-up the entire shop after coming from storage - Send Photo",
    "photoRequired": true,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "19:00-20:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "19:00-20:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-18:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 39
  },
  {
    "id": "pm18",
    "taskName": "Check out of date",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "19:00-20:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "19:00-20:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-18:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 40
  },
  {
    "id": "pm19",
    "taskName": "Temperature check, Daily Check",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:45-19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "16:00-19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "14:30-19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "19:00-20:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "19:00-20:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S4",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "16:00-18:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 41
  },
  {
    "id": "pm20",
    "taskName": "TOP UP DRINKS IF NEEDED",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "20:00-22:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "18:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 42
  },
  {
    "id": "pm21",
    "taskName": "Clear up the newspapers",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "20:00-22:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "18:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 43
  },
  {
    "id": "pm22",
    "taskName": "Sweep the floor",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "20:00-22:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "18:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 44
  },
  {
    "id": "pm23",
    "taskName": "Mop the floor",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "20:00-22:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "18:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 45
  },
  {
    "id": "pm24",
    "taskName": "Wipe shelf strips with hot water (Entire Shop) - Must do job",
    "photoRequired": false,
    "recurring": false,
    "frequencyMinutes": null,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "After 20:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "19:00-22:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:3",
            "legacyAssignee": "3",
            "effortMinutes": null,
            "sourceTime": "20:00-22:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:1",
            "legacyAssignee": "1",
            "effortMinutes": null,
            "sourceTime": "20:00-23:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-01-01",
            "active": true,
            "slotId": "S5",
            "assigneeId": "",
            "assigneeKey": "staffId:4",
            "legacyAssignee": "4",
            "effortMinutes": null,
            "sourceTime": "18:00-22:00"
          }
        ]
      }
    },
    "schemaVersion": 2,
    "sortOrder": 46
  }
];

async function ensureNamedAssignee(id,name){
  const users=await getDocs(collection(db,"users"));
  const existing=users.docs.map(d=>({id:d.id,...d.data()}))
    .find(u=>String(u.name||"").trim().toLowerCase()===name.toLowerCase());
  if(existing) return existing.id;
  await setDoc(doc(db,"users",id),{
    name,
    pin:"",
    staffId:"",
    role:"assignee",
    active:true,
    createdAt:serverTimestamp()
  },{merge:true});
  return id;
}

export async function seedV2Template(){
  await ensureNamedAssignee("person_donna","Donna");
  await ensureNamedAssignee("person_parth","Parth");

  const existing=await getDocs(collection(db,"weeklyTemplates"));
  if(!existing.empty){
    const clear=writeBatch(db);
    existing.docs.forEach(d=>clear.delete(d.ref));
    await clear.commit();
  }

  const batch=writeBatch(db);
  v2NorthTerraceTasks.forEach(t=>{
    const {id,...data}=t;
    batch.set(doc(db,"weeklyTemplates",id),{...data,updatedAt:serverTimestamp()});
  });
  await batch.commit();
  return v2NorthTerraceTasks.length;
}
