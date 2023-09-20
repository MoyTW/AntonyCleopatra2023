interface Calendar {
  AM: string
  PM: string

  getCurrentTimeslot: () => Timeslot | undefined
  setCurrentTimeslot: (timeslot: Timeslot) => void
  getCurrentTimeslotText: () => string | undefined

  advanceTime: () => void

  makeSpanId: (month: number, day: number, slot: string) => string

  getScheduled: (month: number, day: number, slot: string) => Appointment[]
  getScheduledNow: () => Appointment | undefined
  scheduleVisit: (month: number, day: number, slot: string, role: string, cluePointId: string) => void
}

interface Timeslot {
  year: number
  month: number // Indexed by zero, same as Date objects
  day: number
  slot: string
}

interface Appointment {
  month: number
  day: number
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
    ALL_DAY ='ALL_DAY'

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
        if (cts.slot === this.ALL_DAY) {
          return withoutTime
        } else if (cts.slot === this.AM) {
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
      if (cts.slot === this.ALL_DAY || cts.slot === this.PM) {
        cts.day += 1
        cts.slot = this.AM
      } else {
        cts.slot = this.PM
      }
    }

    makeSpanId = (month: number, day: number, slot: string) => {
      return `${month}-${day}-${slot}`.replace(' ', '-')
    }

    getScheduled = (month: number, day: number, slot: string | undefined) => {
      const entries: Appointment[] = State.getVar(this.ENTRIES_VAR) || []
      return entries.filter((e) => {
        return e.month === month &&
               e.day === day &&
               (!slot || e.slot === slot)
      })
    }

    getScheduledNow = () => {
      const cts: Timeslot = this.getCurrentTimeslot()
      const scheduled = this.getScheduled(cts.month, cts.day, cts.slot)
      if (scheduled.length > 0) {
        return scheduled[0]
      } else {
        return undefined
      }
    }

    scheduleVisit = (month: number, day: number, slot: string, role: string, cluePointId: string) => {
      const entries: Appointment[] = State.getVar(this.ENTRIES_VAR) || []
      const matchingIdx = entries.findIndex((e) => {
        return e.month ===  month && e.day === day && e.slot === slot
      })
      if (matchingIdx > -1) {
        entries.deleteAt(matchingIdx)
      }
      entries.push({ month: month, day: day, slot: slot, role: role, cluePointId: cluePointId})
      console.log('setting', entries)
      State.setVar(this.ENTRIES_VAR, entries)
    }
  }

  (setup as any).Calendar = new CalendarImpl()
})()