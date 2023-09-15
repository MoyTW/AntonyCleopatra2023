interface Calendar {
  AM: string
  PM: string

  makeSpanId: (date: string, slot: string, role: string) => string

  getScheduled: (date: string, slot: string, role: string) => string | undefined
  scheduleVisit: (date: string, slot: string, role: string, cluePointId: string) => void
}

interface CalendarEntry {
  date: string;
  slot: string;
  role: string;
  cluePointId: string;
}

(function () {
  class CalendarImpl implements Calendar {
    AM = 'AM'
    PM = 'PM'

    ENTRIES_VAR = '$CalendarImpl_entries'

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
      entries.push({ date: date, slot: slot, role: role, cluePointId: cluePointId})
      console.log('setting', entries)
      State.setVar(this.ENTRIES_VAR, entries)
    }
  }

  (setup as any).Calendar = new CalendarImpl()
})()