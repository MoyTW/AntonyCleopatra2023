interface Transcript {
  initialize(): void
  saveToCluePointId(): void
  getForCluePointId(cluePointId: string): string | undefined
}

(function () {
  class TranscriptImpl implements Transcript {
    _toKey(cluePointId: string): string {
      return `8E8DBD2A-FEFA-4600-A93B-AC499CA5C8B6-transcript-${cluePointId}`
    }

    _clearKey(cluePointId: string): void {
      const storage = window.localStorage
      storage.removeItem(this._toKey(cluePointId))
    }

    initialize(): void {
      console.log('Clearing localstorage.')
      const CluePoints = (setup as any).CluePoints as CluePoints
      CluePoints.getAllKeys().forEach((id) => {
        this._clearKey(id)
      });
    }

    saveToCluePointId(): void {
      const Calendar = (setup as any).Calendar as Calendar

      const id = Calendar.getScheduledNow()?.cluePointId
      if (!id) {
        console.error('Attempted to call saveToCluePointId but no clue point ID could be found!')
        return
      }

      const btnRegex = /<div id=["']options["']>.*<\/div>/i;
      const passage = $(".passage")[0]
      if (passage) {
        const transcript = passage.innerHTML.replace(btnRegex, '')
        const storage = window.localStorage
        storage.setItem(this._toKey(id), transcript)
      } else {
        console.error(`Couldn't read passage when attempting to save cluePointId ${id}!`)
      }
    }

    getForCluePointId(cluePointId: string): string | undefined {
      const storage = window.localStorage
      const retrieved = storage.getItem(this._toKey(cluePointId))
      if (!retrieved) {
        return undefined
      } else {
        return retrieved
      }
    }
  }

  (setup as any).Transcript = new TranscriptImpl()
})()