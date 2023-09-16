interface Calendar {
  AM: string
  PM: string

  getCurrentTimeslot: () => Timeslot | undefined
  setCurrentTimeslot: (timeslot: Timeslot) => void
  getCurrentTimeslotText: () => string | undefined

  advanceTime: () => void

  makeSpanId: (date: string, slot: string, role: string) => string

  getScheduled: (date: string, slot: string, role: string) => string | undefined
  scheduleVisit: (date: string, slot: string, role: string, cluePointId: string) => void
}

interface Timeslot {
  year: number
  month: number // Indexed by zero, as a Date object
  day: number
  fullDay: boolean
  morning: boolean | undefined
}

interface CalendarEntry {
  date: string
  slot: string
  role: string
  cluePointId: string
}

(function () {
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames = ['January' ,'February' ,'March' ,'April' ,'May' ,'June' ,'July' ,'August' ,'September' ,'October' ,'November' ,'December'];

  class CalendarImpl implements Calendar {
    AM = 'AM'
    PM = 'PM'

    ENTRIES_VAR = '$CalendarImpl_entries'
    TIMESLOT_VAR = '$CalendarImpl_currentTimeslot'

    getCurrentTimeslot = () => {
      const cts = State.getVar(this.TIMESLOT_VAR)
      if (!cts) {
        console.error('getCurrentTimeslot() called with no time set!')
      }
      return cts
    }

    setCurrentTimeslot = (timeslot: Timeslot) => {
      State.setVar(this.TIMESLOT_VAR, timeslot)
    }

    getCurrentTimeslotText = () => {
      const cts: Timeslot = State.getVar(this.TIMESLOT_VAR)
      if (!cts) {
        return undefined
      } else {
        const d = new Date(cts.year, cts.month, cts.day)
        const withoutTime = `${dayNames[d.getDay()]}, ${monthNames[(d.getMonth())]} ${cts.day}`
        if (cts.fullDay) {
          return withoutTime
        } else if (cts.morning) {
          return `${withoutTime}, 9 a.m.`
        } else {
          return `${withoutTime}, 1 p.m.`
        }
      }
    }

    advanceTime = () => {
      // TODO
      const cts: Timeslot = State.getVar(this.TIMESLOT_VAR)
      // TODO End game
      if (cts.fullDay || !cts.morning) {
        cts.day += 1
        cts.morning = true
        cts.fullDay = false
      } else {
        cts.morning = false
      }
    }

    makeSpanId = (date: string, slot: string, role: string) => {
      return `${date}-${slot}-${role}`.replace(' ', '-')
    }

    getScheduled = (date: string, slot: string, role: string) => {
      console.log(`Getting: ${date}, ${slot}, ${role}, ${State.getVar(this.ENTRIES_VAR)}`)
      const entries: CalendarEntry[] = State.getVar(this.ENTRIES_VAR)
      if (entries) {
        return entries.find((e) => {
          return e.date === date && e.slot === slot && e.role === role
        })?.cluePointId
      } else {
        return undefined
      }
    }

    scheduleVisit = (date: string, slot: string, role: string, cluePointId: string) => {
      console.log(`scheduling: ${date}, ${slot}, ${role}, ${cluePointId}`)
      const entries: CalendarEntry[] = State.getVar(this.ENTRIES_VAR) || []
      const matchingIdx = entries.findIndex((e) => e.date === date && e.slot === slot && e.role === role)
      if (matchingIdx > -1) {
        entries.deleteAt(matchingIdx)
      }
      entries.push({ date: date, slot: slot, role: role, cluePointId: cluePointId})
      console.log('setting', entries)
      State.setVar(this.ENTRIES_VAR, entries)
    }
  }

  (setup as any).Calendar = new CalendarImpl()
})()