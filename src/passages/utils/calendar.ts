interface Calendar {
  AM: string
  PM: string

  getMonthShortText: (idx: number) => string | undefined

  getCurrentTimeslot: () => Timeslot | undefined
  setCurrentTimeslot: (timeslot: Timeslot) => void
  getCurrentTimeslotText: (suffix: string | undefined) => string | undefined
  isMorning: () => boolean
  isPastTimeslot: (month: number, day: number, slot: string) => boolean

  advanceTime: () => void

  makeSpanId: (month: number, day: number, slot: string) => string

  getScheduled: (month: number, day: number, slot: string) => Appointment[]
  getScheduledNow: () => Appointment | undefined
  scheduleVisit: (month: number, day: number, slot: string, role: string, cluePointId: string) => Appointment | undefined
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
  const shortMonthNames = ['Jan' ,'Feb' ,'Mar' ,'Apr' ,'May' ,'Jun' ,'Jul' ,'Aug' ,'Sep' ,'Oct' ,'Nov' ,'Dec'];
  const monthNames = ['January' ,'February' ,'March' ,'April' ,'May' ,'June' ,'July' ,'August' ,'September' ,'October' ,'November' ,'December'];

  class CalendarImpl implements Calendar {
    AM = 'AM'
    PM = 'PM'
    ALL_DAY ='ALL_DAY'

    ENTRIES_VAR = '$CalendarImpl_entries'
    TIMESLOT_VAR = '$CalendarImpl_currentTimeslot'

    getMonthShortText = (idx: number) => {
      return shortMonthNames[idx]
    }

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

    getTextForDate = (month: number, day: number) => {
      const d = new Date(2021, month, day)
      return `${dayNames[d.getDay()]}, ${monthNames[(d.getMonth())]} ${day}`
    }

    getCurrentTimeslotText = (suffix: string | undefined) => {
      const cts: Timeslot = State.getVar(this.TIMESLOT_VAR)
      if (!cts) {
        return undefined
      } else {
        const d = new Date(cts.year, cts.month, cts.day)
        const withoutTime = `${dayNames[d.getDay()]}, ${monthNames[(d.getMonth())]} ${cts.day}`
        if (cts.slot === this.ALL_DAY) {
          return withoutTime
        } else if (suffix) {
          return withoutTime + ', ' + suffix
        } else if (cts.slot === this.AM) {
          return `${withoutTime}, 9 a.m.`
        } else {
          return `${withoutTime}, 1 p.m.`
        }
      }
    }

    getCurrentTimeslotSidebarText = (suffix: string | undefined) => {
      const cts: Timeslot = State.getVar(this.TIMESLOT_VAR)
      if (!cts) {
        return undefined
      } else {
        const d = new Date(cts.year, cts.month, cts.day)
        const withoutTime = `${dayNames[d.getDay()]}, ${monthNames[(d.getMonth())]} ${cts.day}, 2021`
        return withoutTime
      }
    }


    isMorning = () => {
      const cts: Timeslot = State.getVar(this.TIMESLOT_VAR)
      return cts.slot === this.AM
    }

    // This is hella jank because our time advancement happens in the morning - hence if day is equal it's 'past'
    isPastTimeslot = (month: number, day: number) => {
      const cts: Timeslot = State.getVar(this.TIMESLOT_VAR)
      return cts.month > month || (cts.month === month && cts.day >= day)
    }

    advanceTime = () => {
      const cts: Timeslot = State.getVar(this.TIMESLOT_VAR)

      if (cts.slot === this.ALL_DAY || cts.slot === this.PM) {
        cts.day += 1
        cts.slot = this.AM
      } else {
        cts.slot = this.PM
      }

      // Month rollover
      if (cts.day === 32) {
        cts.month += 1
        cts.day = 1
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
      
      const matchingSlotIdx = entries.findIndex((e) => {
        return e.month ===  month && e.day === day && e.slot === slot
      })
      if (matchingSlotIdx > -1) {
        entries.deleteAt(matchingSlotIdx)
      }

      let matchingItem: Appointment | undefined = undefined
      const matchingCluePointIdx = entries.findIndex((e) => {
        return e.cluePointId === cluePointId
      })
      if (matchingCluePointIdx > -1) {
        matchingItem = entries[matchingCluePointIdx]
        entries.deleteAt(matchingCluePointIdx)
      }

      entries.push({ month: month, day: day, slot: slot, role: role, cluePointId: cluePointId})
      State.setVar(this.ENTRIES_VAR, entries)

      return matchingItem
    }

    clearCurrentSlot = () => {
      const entries: Appointment[] = State.getVar(this.ENTRIES_VAR) || []
      const cts = this.getCurrentTimeslot()

      if (cts) {
        const matchingSlotIdx = entries.findIndex((e) => {
          return e.month === cts.month && e.day === cts.day && e.slot === cts.slot
        })
        if (matchingSlotIdx > -1) {
          entries.deleteAt(matchingSlotIdx)
        }
      }
    }
  }

  (setup as any).Calendar = new CalendarImpl()
})()