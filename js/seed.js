import {db,collection,doc,getDocs,writeBatch} from "./firebase.js";

export const fullNorthTerraceTasks = [
  {
    "id": "am01",
    "taskName": "Cooking and check temperature every Hour",
    "shift": "AM",
    "section": "05:30-09:00",
    "photoRequired": false,
    "recurring": true,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-14:00"
      },
      "Tue": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-14:00"
      },
      "Wed": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-14:00"
      },
      "Thu": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-14:00"
      },
      "Fri": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-14:00"
      },
      "Sat": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-14:00"
      },
      "Sun": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-14:00"
      }
    },
    "frequencyMinutes": 60
  },
  {
    "id": "am02",
    "taskName": "Temperature check, Daily Check",
    "shift": "AM",
    "section": "05:30-09:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Tue": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Wed": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-09:00"
      },
      "Thu": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-09:00"
      },
      "Fri": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Sat": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Sun": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      }
    }
  },
  {
    "id": "am03",
    "taskName": "Fill up and tidy vape and Spirits Shelve",
    "shift": "AM",
    "section": "05:30-09:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Tue": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Wed": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-09:00"
      },
      "Thu": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-09:00"
      },
      "Fri": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Sat": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Sun": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      }
    }
  },
  {
    "id": "am04",
    "taskName": "Write the Cigarette, Spirit list, papers AND FILL",
    "shift": "AM",
    "section": "05:30-09:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": false
      },
      "Tue": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Wed": {
        "active": false
      },
      "Thu": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-09:00"
      },
      "Fri": {
        "active": false
      },
      "Sat": {
        "active": true,
        "assignee": "PARTH",
        "time": "05:30-09:00"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "am05",
    "taskName": "Check VR light in the pump (all)",
    "shift": "AM",
    "section": "05:30-09:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Tue": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Wed": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-09:00"
      },
      "Thu": {
        "active": true,
        "assignee": "DONNA",
        "time": "05:30-09:00"
      },
      "Fri": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Sat": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      },
      "Sun": {
        "active": true,
        "assignee": "WHO OPEN",
        "time": "05:30-09:00"
      }
    }
  },
  {
    "id": "am06",
    "taskName": "Sweep the floor, Tidy Coffee machine as when needed",
    "shift": "AM",
    "section": "08:00-08:45",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      }
    }
  },
  {
    "id": "am07",
    "taskName": "Check out of date (Sandwich chiller, Eggs, Bread)",
    "shift": "AM",
    "section": "08:00-08:45",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      }
    }
  },
  {
    "id": "am08",
    "taskName": "Wipe and tidy coffee machine (fill up if necessary)",
    "shift": "AM",
    "section": "08:00-08:45",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      }
    }
  },
  {
    "id": "am09",
    "taskName": "Just face up Drinks, Crisps, Milk, Sandwiches",
    "shift": "AM",
    "section": "08:00-08:45",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      }
    }
  },
  {
    "id": "am10",
    "taskName": "Wash - trays, Tongues, Probe (Photo)",
    "shift": "AM",
    "section": "08:00-08:45",
    "photoRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "08:00-08:45"
      }
    }
  },
  {
    "id": "am11",
    "taskName": "Fill-up (Drinks, beer, wines)",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      }
    }
  },
  {
    "id": "am12",
    "taskName": "Full filling of chocolate from back stock",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": false
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": false
      },
      "Thu": {
        "active": false
      },
      "Fri": {
        "active": false
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "am13",
    "taskName": "Full filling of crisps from back Stock",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": false
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": false
      },
      "Thu": {
        "active": false
      },
      "Fri": {
        "active": false
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "am14",
    "taskName": "Full filling of car care and engine oil from Upstairs",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Tue": {
        "active": false
      },
      "Wed": {
        "active": false
      },
      "Thu": {
        "active": false
      },
      "Fri": {
        "active": false
      },
      "Sat": {
        "active": false
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      }
    }
  },
  {
    "id": "am15",
    "taskName": "Fill up other department from upstairs",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      }
    }
  },
  {
    "id": "am16",
    "taskName": "Sweep the floor, Tidy Coffee machine as when needed",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      }
    }
  },
  {
    "id": "am17",
    "taskName": "FILL UP COFFEE INGREDIENTS",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      }
    }
  },
  {
    "id": "am18",
    "taskName": "Face up - Coal Bunker, Adblue, Screenwash",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      }
    }
  },
  {
    "id": "am19",
    "taskName": "Need Gas-Stock Check",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "09:30-12:30"
      }
    }
  },
  {
    "id": "am20",
    "taskName": "Clear Firex exit rubbish",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      }
    }
  },
  {
    "id": "am21",
    "taskName": "Face up entire shop - Send photo",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "12:30-13:00"
      }
    }
  },
  {
    "id": "am22",
    "taskName": "Send photo of this signed sheet",
    "shift": "AM",
    "section": "08:45-13:30",
    "photoRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "FLOOR",
        "time": "13:30"
      },
      "Tue": {
        "active": true,
        "assignee": "FLOOR",
        "time": "13:30"
      },
      "Wed": {
        "active": true,
        "assignee": "FLOOR",
        "time": "13:30"
      },
      "Thu": {
        "active": true,
        "assignee": "FLOOR",
        "time": "13:30"
      },
      "Fri": {
        "active": true,
        "assignee": "FLOOR",
        "time": "13:30"
      },
      "Sat": {
        "active": true,
        "assignee": "FLOOR",
        "time": "13:30"
      },
      "Sun": {
        "active": true,
        "assignee": "FLOOR",
        "time": "13:30"
      }
    }
  },
  {
    "id": "pm01",
    "taskName": "Paper Works - Office work (A)",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "13:30-14:30"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "13:30-14:15"
      },
      "Wed": {
        "active": false
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "Any 1 hr"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "14:00-14:45"
      },
      "Sat": {
        "active": true,
        "assignee": "3",
        "time": "14:00-14:45"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "pm02",
    "taskName": "Afternoon shift / Hot food unit cleaning, check oven for clean, oven floor",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "14:30-15:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:15-14:45"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "14:00-14:30"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:00-14:30"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "14:45-15:15"
      },
      "Sat": {
        "active": true,
        "assignee": "3",
        "time": "14:45-15:15"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "pm03",
    "taskName": "Sweep the floor, then as when needed",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "14:30-15:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:15-14:45"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "14:00-14:30"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:00-14:30"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "14:45-15:15"
      },
      "Sat": {
        "active": true,
        "assignee": "3",
        "time": "14:45-15:15"
      },
      "Sun": {
        "active": true,
        "assignee": "2",
        "time": "14:00-16:00"
      }
    }
  },
  {
    "id": "pm04",
    "taskName": "Follow the cleaning schedule and face up drinks/crisps; print missing label",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": false
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "14:30-16:00"
      },
      "Thu": {
        "active": false
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "15:15-16:30"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "2",
        "time": "14:00-16:00"
      }
    }
  },
  {
    "id": "pm05",
    "taskName": "Fill up (Drinks, Beers, Wine - chiller)",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-18:00"
      }
    }
  },
  {
    "id": "pm06",
    "taskName": "Full filling of crisps from back Stock",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-18:00"
      }
    }
  },
  {
    "id": "pm07",
    "taskName": "Face up Crisps and Chocolate",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-18:00"
      }
    }
  },
  {
    "id": "pm08",
    "taskName": "Fill up coffee items in the cabinet",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-22:00"
      }
    }
  },
  {
    "id": "pm09",
    "taskName": "Cleaning the coffee machine and Tango machine, empty coffee bin",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-22:00"
      }
    }
  },
  {
    "id": "pm10",
    "taskName": "Clean the Kitchen Sink",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-22:00"
      }
    }
  },
  {
    "id": "pm11",
    "taskName": "Top up Gloves, Towel, Check Bins (forecourt)",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "7",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "pm12",
    "taskName": "Pump Cleaning, pick up litter (Coal Area as well)",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "7",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1-D",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "pm13",
    "taskName": "Send photo to Vijay (after forecourt cleaning)",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "7",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": false
      }
    }
  },
  {
    "id": "pm14",
    "taskName": "Hoover the front door Mat (must Hoover)",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "7",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-22:00"
      }
    }
  },
  {
    "id": "pm15",
    "taskName": "Toilet Cleaning - should send photo in floor group",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "15 min"
      },
      "Tue": {
        "active": true,
        "assignee": "7",
        "time": "15 min"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "15 min"
      },
      "Thu": {
        "active": true,
        "assignee": "5",
        "time": "15 min"
      },
      "Fri": {
        "active": true,
        "assignee": "6",
        "time": "15 min"
      },
      "Sat": {
        "active": true,
        "assignee": "4",
        "time": "15 min"
      },
      "Sun": {
        "active": true,
        "assignee": "2",
        "time": "15 min"
      }
    }
  },
  {
    "id": "pm16",
    "taskName": "Go to storage once (Follow list) - Top up Back Stock",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "15:00-19:00"
      },
      "Tue": {
        "active": true,
        "assignee": "4",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "16:30-19:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "15:15-19:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-18:00"
      }
    }
  },
  {
    "id": "pm17",
    "taskName": "Face-up the entire shop after coming from storage - Send Photo",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": true,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "1",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "1",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "19:00-20:00"
      },
      "Sat": {
        "active": true,
        "assignee": "3",
        "time": "19:00-20:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-18:00"
      }
    }
  },
  {
    "id": "pm18",
    "taskName": "Check out of date",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "19:00-20:00"
      },
      "Sat": {
        "active": true,
        "assignee": "3",
        "time": "19:00-20:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-18:00"
      }
    }
  },
  {
    "id": "pm19",
    "taskName": "Temperature check, Daily Check",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "3",
        "time": "14:45-19:00"
      },
      "Wed": {
        "active": true,
        "assignee": "1",
        "time": "16:00-19:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "14:30-19:00"
      },
      "Fri": {
        "active": true,
        "assignee": "3",
        "time": "19:00-20:00"
      },
      "Sat": {
        "active": true,
        "assignee": "3",
        "time": "19:00-20:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "16:00-18:00"
      }
    }
  },
  {
    "id": "pm20",
    "taskName": "TOP UP DRINKS IF NEEDED",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "20:00-22:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "18:00-22:00"
      }
    }
  },
  {
    "id": "pm21",
    "taskName": "Clear up the newspapers",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "20:00-22:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "18:00-22:00"
      }
    }
  },
  {
    "id": "pm22",
    "taskName": "Sweep the floor",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "20:00-22:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "18:00-22:00"
      }
    }
  },
  {
    "id": "pm23",
    "taskName": "Mop the floor",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "20:00-22:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "18:00-22:00"
      }
    }
  },
  {
    "id": "pm24",
    "taskName": "Wipe shelf strips with hot water (Entire Shop) - Must do job",
    "shift": "PM",
    "section": "14:00-22:00",
    "photoRequired": false,
    "recurring": false,
    "schedule": {
      "Mon": {
        "active": true,
        "assignee": "3",
        "time": "After 20:00"
      },
      "Tue": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Wed": {
        "active": true,
        "assignee": "4",
        "time": "19:00-22:00"
      },
      "Thu": {
        "active": true,
        "assignee": "3",
        "time": "20:00-22:00"
      },
      "Fri": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sat": {
        "active": true,
        "assignee": "1",
        "time": "20:00-23:00"
      },
      "Sun": {
        "active": true,
        "assignee": "4",
        "time": "18:00-22:00"
      }
    }
  }
];

export async function seedFullTemplate() {
  const existing = await getDocs(collection(db,"weeklyTemplates"));
  const batch = writeBatch(db);

  existing.docs.forEach(d => batch.delete(d.ref));

  fullNorthTerraceTasks.forEach((task,index) => {
    const {id,...data} = task;
    batch.set(doc(db,"weeklyTemplates",id), {
      ...data,
      sortOrder:index+1,
      source:"North Terrace AM/PM master sheets"
    });
  });

  await batch.commit();
  return fullNorthTerraceTasks.length;
}
