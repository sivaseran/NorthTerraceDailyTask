import {db,collection,doc,getDoc,getDocs,setDoc,writeBatch,serverTimestamp} from './firebase.js';

export const FINAL_SETUP_VERSION='v3.6.4-final-2026-09-21';
export const SUNDAY_ROTATION_ANCHOR='2026-09-27';
export const SUNDAY_ROTATION=['staff1','staff9','staff3','staff4']; // Parthy, Pragash, Prashanthy, Suku

export const FINAL_WEEKLY_TASKS=[
  {
    "id": "am05",
    "taskName": "Check VR light in the pump (all)",
    "sortOrder": 1,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:00"
          }
        ]
      }
    }
  },
  {
    "id": "temp0630",
    "taskName": "Check hot food temperature 06:30",
    "sortOrder": 2,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "06:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": ""
          }
        ]
      }
    }
  },
  {
    "id": "am03",
    "taskName": "Fill and tidy up Vape, Cigarette and Spirits Shelve",
    "sortOrder": 3,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "06:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "06:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "06:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "06:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "06:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "06:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "07:30"
          }
        ]
      }
    }
  },
  {
    "id": "am04",
    "taskName": "Write the needed list of Vape, Cigarette, Cigarette papers",
    "sortOrder": 4,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "07:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "07:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "07:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "07:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      }
    }
  },
  {
    "id": "temp0730",
    "taskName": "Check hot food temperature 07:30",
    "sortOrder": 5,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "07:00"
          }
        ]
      }
    }
  },
  {
    "id": "am07",
    "taskName": "Check out of date (Sandwich chiller, Eggs, Bread)",
    "sortOrder": 6,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "08:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "08:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "08:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "08:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "08:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "08:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "08:00"
          }
        ]
      }
    }
  },
  {
    "id": "am09",
    "taskName": "Face up Drinks, Crisps, Milk, Sandwiches",
    "sortOrder": 7,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:15"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:15"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:15"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:15"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:15"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:15"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:15"
          }
        ]
      }
    }
  },
  {
    "id": "temp0830",
    "taskName": "Check hot food temperature 08:30",
    "sortOrder": 8,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "08:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "08:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "08:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "08:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "08:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "08:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "08:00"
          }
        ]
      }
    }
  },
  {
    "id": "am06",
    "taskName": "Sweep the floor, tidy Coffee machine",
    "sortOrder": 9,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:30"
          }
        ]
      }
    }
  },
  {
    "id": "am10",
    "taskName": "Wash - trays, Tongues, Probe (Photo)",
    "sortOrder": 10,
    "photoRequired": true,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S1",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "08:45"
          }
        ]
      }
    }
  },
  {
    "id": "am20",
    "taskName": "Clear Firex exit rubbish",
    "sortOrder": 11,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:00"
          }
        ]
      }
    }
  },
  {
    "id": "am18",
    "taskName": "Face up - Coal Bunker, Adblue, Screenwash",
    "sortOrder": 12,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:15"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:15"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:15"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:15"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:15"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:15"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:15"
          }
        ]
      }
    }
  },
  {
    "id": "temp0930",
    "taskName": "Check hot food temperature 09:30",
    "sortOrder": 13,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "09:00"
          }
        ]
      }
    }
  },
  {
    "id": "am19",
    "taskName": "Check Gas-Stock",
    "sortOrder": 14,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "09:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      }
    }
  },
  {
    "id": "am08",
    "taskName": "Wipe and tidy coffee machine (fill up if necessary)",
    "sortOrder": 15,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "10:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "10:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "10:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "10:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "10:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "10:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "10:00"
          }
        ]
      }
    }
  },
  {
    "id": "am11",
    "taskName": "Complete fill up - Drinks, beer, & wines (M)",
    "sortOrder": 16,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:00"
          }
        ]
      }
    }
  },
  {
    "id": "temp1030",
    "taskName": "Check hot food temperature 10:30",
    "sortOrder": 17,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "10:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "10:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "10:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "10:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "10:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "10:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "10:00"
          }
        ]
      }
    }
  },
  {
    "id": "am12",
    "taskName": "Full filling of chocolate from back stock",
    "sortOrder": 18,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "14:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "10:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      }
    }
  },
  {
    "id": "am13",
    "taskName": "Full filling of crisps from back Stock",
    "sortOrder": 19,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "14:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "11:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": ""
          }
        ]
      }
    }
  },
  {
    "id": "temp1130",
    "taskName": "Check hot food temperature 11:30",
    "sortOrder": 20,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "11:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "11:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "11:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "11:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "11:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "11:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "11:00"
          }
        ]
      }
    }
  },
  {
    "id": "am14",
    "taskName": "Full filling of car care and engine oil from Upstairs",
    "sortOrder": 21,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      }
    }
  },
  {
    "id": "am15",
    "taskName": "Fill up other department from upstairs",
    "sortOrder": 22,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      }
    }
  },
  {
    "id": "am17",
    "taskName": "Fill up coffee machine incredients and tidy up",
    "sortOrder": 23,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      }
    }
  },
  {
    "id": "temp1230",
    "taskName": "Check hot food temperature 12:30",
    "sortOrder": 24,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:00"
          }
        ]
      }
    }
  },
  {
    "id": "am21",
    "taskName": "Face up entire shop - Send photo",
    "sortOrder": 25,
    "photoRequired": true,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "12:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "12:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "12:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "12:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "12:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "12:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "12:30"
          }
        ]
      }
    }
  },
  {
    "id": "pm03",
    "taskName": "Sweep the floor & tidy up coffee machine whenever needed",
    "sortOrder": 26,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:00"
          }
        ]
      }
    }
  },
  {
    "id": "temp1330",
    "taskName": "Check hot food temperature 13:30",
    "sortOrder": 27,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "13:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "13:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "13:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff5",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "13:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "13:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "13:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "13:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm01",
    "taskName": "Paper Works - Office work",
    "sortOrder": 28,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 45,
            "sourceTime": "14:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 45,
            "sourceTime": "13:15"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 45,
            "sourceTime": ""
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 45,
            "sourceTime": "13:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 45,
            "sourceTime": "13:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 45,
            "sourceTime": "13:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 45,
            "sourceTime": ""
          }
        ]
      }
    }
  },
  {
    "id": "pm02",
    "taskName": "Hot food unit, oven & oven floor cleaning",
    "sortOrder": 29,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      }
    }
  },
  {
    "id": "pm15",
    "taskName": "Toilet Cleaning - should send photo in floor group",
    "sortOrder": 30,
    "photoRequired": true,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "14:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "13:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "12:30"
          }
        ]
      }
    }
  },
  {
    "id": "temp1430",
    "taskName": "Check hot food temperature 14:30",
    "sortOrder": 31,
    "photoRequired": false,
    "temperatureRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm04",
    "taskName": "Follow the cleaning schedule & print missing label including face up drinks/crisps",
    "sortOrder": 32,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 120,
            "sourceTime": ""
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 120,
            "sourceTime": "14:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 120,
            "sourceTime": "14:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 120,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 120,
            "sourceTime": "14:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 120,
            "sourceTime": "14:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 120,
            "sourceTime": "14:30"
          }
        ]
      }
    }
  },
  {
    "id": "pm10",
    "taskName": "Clean the Kitchen Sink",
    "sortOrder": 33,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "15:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "15:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "15:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "15:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "15:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "15:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "15:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm11",
    "taskName": "Top up Gloves, Towel, Check Bins (forecourt)",
    "sortOrder": 34,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "14:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "15:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "15:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "15:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "15:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "15:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:30"
          }
        ]
      }
    }
  },
  {
    "id": "pm12",
    "taskName": "Pump Cleaning, pick up litter (Coal Area as well)",
    "sortOrder": 35,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "14:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "15:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "15:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": ""
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "11:45"
          }
        ]
      }
    }
  },
  {
    "id": "pm13",
    "taskName": "Send photo to Vijay (after forecourt cleaning)",
    "sortOrder": 36,
    "photoRequired": true,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "14:55"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": ""
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "16:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": ""
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "16:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": false,
            "slotId": "",
            "assigneeId": "",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": ""
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S2",
            "assigneeId": "staff2",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 5,
            "sourceTime": "12:15"
          }
        ]
      }
    }
  },
  {
    "id": "pm08",
    "taskName": "Fill up coffee items in the cabinet",
    "sortOrder": 37,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "16:15"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "16:15"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "16:15"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "16:15"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "16:15"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "16:15"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S3",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "16:15"
          }
        ]
      }
    }
  },
  {
    "id": "pm05",
    "taskName": "Complete fill up - Drinks, beer, & wines (E)",
    "sortOrder": 38,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "18:15"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "18:15"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "18:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "18:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "18:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "18:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 30,
            "sourceTime": "18:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm16",
    "taskName": "Go to storage once (Follow list) - Top up Back Stock",
    "sortOrder": 39,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "18:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "18:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "18:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "18:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "18:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "18:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "18:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm09",
    "taskName": "Cleaning the coffee machine and Tango machine, empty coffee bin",
    "sortOrder": 40,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm14",
    "taskName": "Hoover the front door Mat (must Hoover)",
    "sortOrder": 41,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm17",
    "taskName": "Face-up the entire shop after coming from storage - Send Photo",
    "sortOrder": 42,
    "photoRequired": true,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "19:30"
          }
        ]
      }
    }
  },
  {
    "id": "pm18",
    "taskName": "Check out of date",
    "sortOrder": 43,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "19:45"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff9",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "19:45"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "19:45"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "19:45"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "19:45"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "19:45"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S4",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "19:45"
          }
        ]
      }
    }
  },
  {
    "id": "pm21",
    "taskName": "Clear up the newspapers",
    "sortOrder": 44,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "20:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "20:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "20:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "20:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "20:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff8",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "20:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 10,
            "sourceTime": "20:30"
          }
        ]
      }
    }
  },
  {
    "id": "pm20",
    "taskName": "Top up drinks",
    "sortOrder": 45,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:00"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:00"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:00"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:00"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:00"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff8",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:00"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:00"
          }
        ]
      }
    }
  },
  {
    "id": "pm22",
    "taskName": "Sweep the floor",
    "sortOrder": 46,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:15"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:15"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:15"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:15"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:15"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff8",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:15"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:15"
          }
        ]
      }
    }
  },
  {
    "id": "pm23",
    "taskName": "Mop the floor",
    "sortOrder": 47,
    "photoRequired": false,
    "temperatureRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff6",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:30"
          }
        ]
      },
      "Tue": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff7",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:30"
          }
        ]
      },
      "Wed": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff3",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:30"
          }
        ]
      },
      "Thu": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:30"
          }
        ]
      },
      "Fri": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff1",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:30"
          }
        ]
      },
      "Sat": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff8",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:30"
          }
        ]
      },
      "Sun": {
        "versions": [
          {
            "effectiveFrom": "2026-09-21",
            "active": true,
            "slotId": "S5",
            "assigneeId": "staff4",
            "assigneeKey": "",
            "legacyAssignee": "",
            "effortMinutes": 15,
            "sourceTime": "21:30"
          }
        ]
      }
    }
  }
];

async function deleteCollection(name){
  const snap=await getDocs(collection(db,name));
  const docs=[...snap.docs];
  for(let i=0;i<docs.length;i+=350){
    const batch=writeBatch(db);
    docs.slice(i,i+350).forEach(d=>batch.delete(d.ref));
    await batch.commit();
  }
  return docs.length;
}

async function writeTemplates(){
  await deleteCollection('weeklyTemplates');
  for(let i=0;i<FINAL_WEEKLY_TASKS.length;i+=200){
    const batch=writeBatch(db);
    for(const t of FINAL_WEEKLY_TASKS.slice(i,i+200)){
      const {id,...payload}=t;
      batch.set(doc(db,'weeklyTemplates',id),{
        ...payload,
        updatedAt:serverTimestamp(),
        updatedByUserId:'system',
        updatedByName:'Final V3.6.5 setup'
      });
    }
    await batch.commit();
  }
}

export async function ensureFinalV36Schedule(){
  const appRef=doc(db,'system','app');
  const appSnap=await getDoc(appRef);
  if(appSnap.exists() && appSnap.data()?.finalSetupVersion===FINAL_SETUP_VERSION) return {applied:false};

  await writeTemplates();
  const removedDaily=await deleteCollection('dailyTasks');
  const removedCover=await deleteCollection('shiftCover');
  const removedCoverRules=await deleteCollection('shiftCoverRules');

  await setDoc(appRef,{
    finalSetupVersion:FINAL_SETUP_VERSION,
    finalSetupAppliedAt:serverTimestamp(),
    sundayRotationAnchor:SUNDAY_ROTATION_ANCHOR,
    sundayRotationStaff:SUNDAY_ROTATION,
    finalTaskCount:FINAL_WEEKLY_TASKS.length
  },{merge:true});

  return {applied:true,removedDaily,removedCover,removedCoverRules,taskCount:FINAL_WEEKLY_TASKS.length};
}
