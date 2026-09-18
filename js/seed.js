import {db,collection,doc,getDocs,setDoc,writeBatch,serverTimestamp} from "./firebase.js";

export const northTerraceRoster = [
  {
    "id": "staff1",
    "name": "Parthy",
    "staffId": "1",
    "pin": "1111",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff2",
    "name": "Uday",
    "staffId": "2",
    "pin": "2222",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff3",
    "name": "Prashanthy",
    "staffId": "3",
    "pin": "3333",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff4",
    "name": "Suku",
    "staffId": "4",
    "pin": "4444",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff5",
    "name": "Donna",
    "staffId": "5",
    "pin": "5555",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff6",
    "name": "Moon",
    "staffId": "6",
    "pin": "6666",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff7",
    "name": "Himmo",
    "staffId": "7",
    "pin": "7777",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff8",
    "name": "Rishi",
    "staffId": "8",
    "pin": "8888",
    "role": "staff",
    "active": true
  },
  {
    "id": "staff9",
    "name": "Pragash",
    "staffId": "9",
    "pin": "9999",
    "role": "staff",
    "active": true
  }
];

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
            "assigneeKey": "person:Parthy",
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



async function commitUpdates(items, updater){
  const chunkSize=400;
  for(let i=0;i<items.length;i+=chunkSize){
    const batch=writeBatch(db);
    items.slice(i,i+chunkSize).forEach(item=>updater(batch,item));
    await batch.commit();
  }
}

async function seedPeopleRoster(){
  for(const person of northTerraceRoster){
    await setDoc(doc(db,"users",person.id),{
      ...person,
      updatedAt:serverTimestamp()
    },{merge:true});
  }

  await setDoc(doc(db,"users","manager1"),{
    name:"Manager",
    pin:"0000",
    role:"manager",
    active:true,
    updatedAt:serverTimestamp()
  },{merge:true});

  // Hide earlier prototype duplicates if they are still present.
  const users=await getDocs(collection(db,"users"));
  const oldIds=["staff","person_donna","person_parth","person_parthy"];
  const oldDocs=users.docs.filter(d=>oldIds.includes(d.id));
  if(oldDocs.length){
    await commitUpdates(oldDocs,(batch,d)=>{
      batch.set(d.ref,{active:false,updatedAt:serverTimestamp()},{merge:true});
    });
  }
}

function localTodayISO(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}


function isParthName(value){
  return String(value||"").trim().toLowerCase()==="parth";
}

export async function migrateParthToParthy(){
  const usersSnap=await getDocs(collection(db,"users"));
  const oldParthDocs=usersSnap.docs.filter(d=>{
    const x=d.data();
    return d.id!=="staff1" && isParthName(x.name);
  });
  const oldParthIds=new Set(oldParthDocs.map(d=>d.id));

  // Ensure the canonical staff record exists and is active.
  await setDoc(doc(db,"users","staff1"),{
    name:"Parthy",
    staffId:"1",
    pin:"1111",
    role:"staff",
    active:true,
    updatedAt:serverTimestamp()
  },{merge:true});

  // Hide any duplicate Parth identity from People / Assignee lists.
  if(oldParthDocs.length){
    await commitUpdates(oldParthDocs,(batch,d)=>{
      batch.set(d.ref,{
        active:false,
        mergedInto:"staff1",
        mergedIntoName:"Parthy",
        updatedAt:serverTimestamp()
      },{merge:true});
    });
  }

  // Rewrite all recurring schedule rules that still point to Parth.
  const templateSnap=await getDocs(collection(db,"weeklyTemplates"));
  const changedTemplates=[];

  for(const d of templateSnap.docs){
    const x=d.data();
    const schedule=structuredClone(x.schedule||{});
    let changed=false;

    Object.keys(schedule).forEach(day=>{
      const dayData=schedule[day];
      if(!dayData) return;

      if(Array.isArray(dayData.versions)){
        dayData.versions=dayData.versions.map(v=>{
          const oldId=String(v.assigneeId||"");
          const key=String(v.assigneeKey||"");
          const legacy=String(v.legacyAssignee||"");
          const keyName=key.toLowerCase()==="person:parth";

          if(oldParthIds.has(oldId) || keyName || isParthName(legacy)){
            changed=true;
            return {
              ...v,
              assigneeId:"staff1",
              assigneeKey:"",
              legacyAssignee:""
            };
          }
          return v;
        });
      }else if(dayData && typeof dayData==="object"){
        // V1 compatibility if an unmigrated day still exists.
        if(isParthName(dayData.assignee)){
          dayData.assignee="1";
          changed=true;
        }
      }
    });

    if(changed) changedTemplates.push({ref:d.ref,schedule});
  }

  if(changedTemplates.length){
    await commitUpdates(changedTemplates,(batch,item)=>{
      batch.update(item.ref,{
        schedule:item.schedule,
        updatedAt:serverTimestamp()
      });
    });
  }

  // Rewrite daily task identity references for all dates, including history.
  // This is an identity correction only; completion timestamps/status are preserved.
  const dailySnap=await getDocs(collection(db,"dailyTasks"));
  const changedDaily=[];

  dailySnap.docs.forEach(d=>{
    const x=d.data();
    const patch={};
    let changed=false;

    if(oldParthIds.has(String(x.assignedTo||"")) || isParthName(x.assignedName)){
      patch.assignedTo="staff1";
      patch.assignedName="Parthy";
      changed=true;
    }

    if(oldParthIds.has(String(x.originalAssignedTo||"")) || isParthName(x.originalAssignedName)){
      patch.originalAssignedTo="staff1";
      patch.originalAssignedName="Parthy";
      changed=true;
    }

    if(oldParthIds.has(String(x.completedByUserId||"")) || isParthName(x.completedByName)){
      patch.completedByUserId="staff1";
      patch.completedByName="Parthy";
      changed=true;
    }

    if(changed){
      patch.updatedAt=serverTimestamp();
      changedDaily.push({ref:d.ref,patch});
    }
  });

  if(changedDaily.length){
    await commitUpdates(changedDaily,(batch,item)=>{
      batch.update(item.ref,item.patch);
    });
  }

  return {
    duplicateUsers:oldParthDocs.length,
    templateTasks:changedTemplates.length,
    dailyTasks:changedDaily.length
  };
}

export async function initializeV22(){
  await seedPeopleRoster();
  await migrateParthToParthy();

  const templateSnap=await getDocs(collection(db,"weeklyTemplates"));
  const existingTemplates=templateSnap.docs.map(d=>({id:d.id,...d.data()}));
  const templateAlreadyV2=
    existingTemplates.length>0 &&
    existingTemplates.every(t=>Number(t.schemaVersion)===2);

  let templateMigrated=false;

  if(!templateAlreadyV2){
    // Old V1 / partial data: replace the weekly template once.
    if(!templateSnap.empty){
      await commitUpdates(templateSnap.docs,(batch,d)=>batch.delete(d.ref));
    }

    const templateItems=v2NorthTerraceTasks.map(t=>t);
    await commitUpdates(templateItems,(batch,t)=>{
      const {id,...data}=t;
      batch.set(doc(db,"weeklyTemplates",id),{
        ...data,
        updatedAt:serverTimestamp()
      });
    });
    templateMigrated=true;
  }

  const today=localTodayISO();
  const rosterMap=new Map(northTerraceRoster.map(p=>[p.id,p]));

  const dailySnap=await getDocs(collection(db,"dailyTasks"));
  const currentAndFuture=dailySnap.docs.filter(d=>String(d.data().date||"")>=today);

  if(templateMigrated){
    // Old daily snapshots do not contain V2 slot/assignee fields.
    // Clear only today/future so the app can regenerate them correctly.
    if(currentAndFuture.length){
      await commitUpdates(currentAndFuture,(batch,d)=>batch.delete(d.ref));
    }
  }else{
    // Already-V2: preserve completions/reassignments and refresh roster names only.
    const patchable=currentAndFuture.filter(d=>{
      const x=d.data();
      return rosterMap.has(x.assignedTo) || rosterMap.has(x.originalAssignedTo);
    });
    if(patchable.length){
      await commitUpdates(patchable,(batch,d)=>{
        const x=d.data(),patch={updatedAt:serverTimestamp()};
        if(rosterMap.has(x.assignedTo)) patch.assignedName=rosterMap.get(x.assignedTo).name;
        if(rosterMap.has(x.originalAssignedTo)) patch.originalAssignedName=rosterMap.get(x.originalAssignedTo).name;
        batch.update(d.ref,patch);
      });
    }
  }

  await setDoc(doc(db,"system","app"),{
    v22Ready:true,
    schemaVersion:"2.2",
    rosterVersion:"2026-09-12",
    initializedAt:serverTimestamp(),
    templateMigrated
  },{merge:true});

  return {
    templateMigrated,
    masterTasks:v2NorthTerraceTasks.length,
    rosterCount:northTerraceRoster.length
  };
}


function currentVersionForMigration(dayData){
  if(!dayData) return null;
  if(Array.isArray(dayData.versions)){
    const active=dayData.versions
      .filter(v=>v&&v.active!==false&&!v.effectiveTo)
      .sort((a,b)=>String(a.effectiveFrom||'').localeCompare(String(b.effectiveFrom||'')));
    return active.at(-1)||dayData.versions.at(-1)||null;
  }
  return dayData&&typeof dayData==='object'?dayData:null;
}
function v3SlotForTime(clock){
  const [h,m]=String(clock).split(':').map(Number);
  const x=h*60+m;
  if(x<9*60) return 'S1';
  if(x<14*60) return 'S2';
  if(x<18*60) return 'S3';
  if(x<20*60) return 'S4';
  return 'S5';
}
function v3TempTemplate(clock){
  const key=clock.replace(':','');
  const dayVersion={
    versions:[{
      effectiveFrom:'2026-09-18',
      active:true,
      slotId:v3SlotForTime(clock),
      assigneeId:'',
      assigneeKey:'',
      legacyAssignee:'',
      effortMinutes:null,
      sourceTime:clock
    }]
  };
  return {
    id:`temp_${key}`,
    schemaVersion:3,
    taskName:`Check hot food temperature ${clock}`,
    photoRequired:false,
    temperatureRequired:true,
    recurring:true,
    frequencyMinutes:null,
    schedule:{
      Mon:structuredClone(dayVersion),Tue:structuredClone(dayVersion),Wed:structuredClone(dayVersion),
      Thu:structuredClone(dayVersion),Fri:structuredClone(dayVersion),Sat:structuredClone(dayVersion),Sun:structuredClone(dayVersion)
    }
  };
}


export async function ensureV321TemperatureNames(){
  const stateRef=doc(db,'system','app');
  const stateSnap=await getDoc(stateRef);
  const state=stateSnap.exists()?stateSnap.data():{};
  if(state?.v321TemperatureNamesReady) return {changed:false};

  const clocks=['06:30','07:30','08:30','09:30','10:30','11:30','12:30','13:30','14:30'];
  const batch=writeBatch(db);

  for(const clock of clocks){
    const id=`temp_${clock.replace(':','')}`;
    batch.set(doc(db,'weeklyTemplates',id),{
      taskName:`Check hot food temperature ${clock}`,
      updatedAt:serverTimestamp()
    },{merge:true});
  }

  await batch.commit();

  // Keep already-generated today/future daily rows consistent with renamed templates.
  const today=localTodayISO();
  const dailySnap=await getDocs(collection(db,'dailyTasks'));
  const toRename=dailySnap.docs.filter(d=>{
    const x=d.data();
    return String(x.date||'')>=today && /^temp_\d{4}$/.test(String(x.templateTaskId||''));
  });

  if(toRename.length){
    await commitUpdates(toRename,(batch,d)=>{
      const x=d.data();
      const m=String(x.templateTaskId||'').match(/^temp_(\d{2})(\d{2})$/);
      if(!m) return;
      const clock=`${m[1]}:${m[2]}`;
      batch.update(d.ref,{
        taskName:`Check hot food temperature ${clock}`,
        updatedAt:serverTimestamp()
      });
    });
  }

  await setDoc(stateRef,{
    v321TemperatureNamesReady:true,
    v321TemperatureNamesAt:serverTimestamp()
  },{merge:true});

  return {changed:true};
}


export async function ensureV322TemperatureRepair(){
  const stateRef=doc(db,'system','app');
  const stateSnap=await getDoc(stateRef);
  const state=stateSnap.exists()?stateSnap.data():{};
  if(state?.v322TemperatureRepairReady) return {changed:false};

  const clocks=['06:30','07:30','08:30','09:30','10:30','11:30','12:30','13:30','14:30'];
  const wantedIds=new Set(clocks.map(clock=>`temp_${clock.replace(':','')}`));

  const templatesSnap=await getDocs(collection(db,'weeklyTemplates'));
  const templates=templatesSnap.docs.map(d=>({id:d.id,ref:d.ref,...d.data()}));

  // Remove every old/legacy temperature template except the 9 canonical ones.
  const legacy=templates.filter(t=>{
    if(wantedIds.has(t.id)) return false;
    const name=String(t.taskName||'');
    return /temperature/i.test(name);
  });

  // Preserve existing effort/assignee where a canonical temp task already exists.
  const existingById=new Map(templates.filter(t=>wantedIds.has(t.id)).map(t=>[t.id,t]));

  const batch=writeBatch(db);

  for(const t of legacy) batch.delete(t.ref);

  for(const clock of clocks){
    const id=`temp_${clock.replace(':','')}`;
    const existing=existingById.get(id);
    let effortMinutes=null;
    let assigneeId='';

    if(existing?.schedule){
      for(const day of ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']){
        const versions=Array.isArray(existing.schedule?.[day]?.versions)
          ?existing.schedule[day].versions
          :[];
        const latest=[...versions].sort((a,b)=>String(b.effectiveFrom||'').localeCompare(String(a.effectiveFrom||'')))[0];
        if(latest){
          if(effortMinutes===null&&Number(latest.effortMinutes)>0) effortMinutes=Number(latest.effortMinutes);
          if(!assigneeId&&latest.assigneeId) assigneeId=latest.assigneeId;
        }
      }
    }

    const slotId=v3SlotForTime(clock);
    const schedule={};
    for(const day of ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']){
      schedule[day]={versions:[{
        effectiveFrom:'2026-09-18',
        active:true,
        slotId,
        assigneeId,
        assigneeKey:'',
        legacyAssignee:'',
        effortMinutes,
        sourceTime:clock
      }]};
    }

    batch.set(doc(db,'weeklyTemplates',id),{
      schemaVersion:3,
      taskName:`Check hot food temperature ${clock}`,
      photoRequired:false,
      temperatureRequired:true,
      recurring:true,
      frequencyMinutes:null,
      schedule,
      updatedAt:serverTimestamp()
    },{merge:false});
  }

  await batch.commit();

  // Remove legacy today/future temperature daily rows and rename canonical rows.
  const today=localTodayISO();
  const dailySnap=await getDocs(collection(db,'dailyTasks'));
  const docs=dailySnap.docs.filter(d=>String(d.data().date||'')>=today);

  for(let i=0;i<docs.length;i+=350){
    const b=writeBatch(db);
    let touched=0;
    for(const d of docs.slice(i,i+350)){
      const x=d.data();
      const tid=String(x.templateTaskId||'');
      const name=String(x.taskName||'');

      if(wantedIds.has(tid)){
        const m=tid.match(/^temp_(\d{2})(\d{2})$/);
        const clock=m?`${m[1]}:${m[2]}`:'';
        if(clock){
          b.update(d.ref,{
            taskName:`Check hot food temperature ${clock}`,
            sourceTime:clock,
            slotId:v3SlotForTime(clock),
            updatedAt:serverTimestamp()
          });
          touched++;
        }
      }else if(/temperature/i.test(name)){
        b.delete(d.ref);
        touched++;
      }
    }
    if(touched) await b.commit();
  }

  await setDoc(stateRef,{
    v322TemperatureRepairReady:true,
    v322TemperatureRepairAt:serverTimestamp()
  },{merge:true});

  return {
    changed:true,
    removedLegacyTemplates:legacy.length,
    ensuredTemperatureTasks:clocks.length
  };
}

export async function ensureV30TaskModel(){
  const stateRef=doc(db,'system','app');
  const stateSnap=await getDoc(stateRef);
  const state=stateSnap.exists()?stateSnap.data():{};
  if(state?.v30Ready) return {changed:false};

  const snap=await getDocs(collection(db,'weeklyTemplates'));
  const templates=snap.docs.map(d=>({id:d.id,ref:d.ref,...d.data()}));
  const oldTempIds=new Set(
    templates
      .filter(t=>/temperature/i.test(String(t.taskName||'')))
      .map(t=>t.id)
  );

  // First make every non-temperature master task active on all seven days.
  // Missing weekdays inherit the task's first available current rule.
  const weekdays=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const batchItems=[];

  for(const t of templates){
    if(oldTempIds.has(t.id)) continue;

    const schedule=structuredClone(t.schedule||{});
    let base=null;
    for(const day of weekdays){
      base=currentVersionForMigration(schedule[day]);
      if(base) break;
    }
    if(!base) continue;

    let changed=false;
    for(const day of weekdays){
      if(currentVersionForMigration(schedule[day])) continue;
      schedule[day]={
        versions:[{
          ...structuredClone(base),
          effectiveFrom:'2026-09-18',
          active:true,
          effectiveTo:null
        }]
      };
      changed=true;
    }
    if(changed||Number(t.schemaVersion)!==3){
      batchItems.push({
        ref:t.ref,
        data:{schedule,schemaVersion:3,updatedAt:serverTimestamp()}
      });
    }
  }

  // Delete all legacy temperature/checkpoint templates.
  for(const t of templates){
    if(oldTempIds.has(t.id)) batchItems.push({ref:t.ref,delete:true});
  }

  // Add separate hourly hot-food temperature tasks 06:30 ... 14:30.
  const clocks=['06:30','07:30','08:30','09:30','10:30','11:30','12:30','13:30','14:30'];
  for(const clock of clocks){
    const t=v3TempTemplate(clock);
    const {id,...data}=t;
    batchItems.push({
      ref:doc(db,'weeklyTemplates',id),
      data:{...data,updatedAt:serverTimestamp()}
    });
  }

  for(let i=0;i<batchItems.length;i+=350){
    const batch=writeBatch(db);
    for(const item of batchItems.slice(i,i+350)){
      if(item.delete) batch.delete(item.ref);
      else batch.set(item.ref,item.data,{merge:true});
    }
    await batch.commit();
  }

  // Remove legacy temperature daily rows from today/future only.
  const today=localTodayISO();
  const dailySnap=await getDocs(collection(db,'dailyTasks'));
  const obsolete=dailySnap.docs.filter(d=>{
    const x=d.data();
    return String(x.date||'')>=today &&
      (oldTempIds.has(String(x.templateTaskId||'')) ||
       /cooking and check temperature|check temperature every hour/i.test(String(x.taskName||'')));
  });
  if(obsolete.length){
    await commitUpdates(obsolete,(batch,d)=>batch.delete(d.ref));
  }

  await setDoc(stateRef,{
    v30Ready:true,
    schemaVersion:'3.0',
    v30MigratedAt:serverTimestamp(),
    v30AllTasksAllDays:true,
    v30TemperatureModel:'separate-hourly-0630-1430'
  },{merge:true});

  return {
    changed:true,
    oldTemperatureTemplatesRemoved:oldTempIds.size,
    newTemperatureTasks:clocks.length
  };
}


// Backward-compatible export for any stale cached page.
export async function seedV2Template(){
  const result=await initializeV22();
  return result.masterTasks;
}
