interface CluePointData {
  id: string,
  name: string,
  type: string,
  passage: string,
  defaultKnown: boolean,
  reveals: string[],
}

interface CluePoints {
  getKnownCluePointIds: (type: string) => string[]
}

(function () {
  const CluePointType = {
    Person: 'PERSON',
    Place: 'PLACE',
  }

  const CluePointKey = {
    JocelynBrando: 'Jocelyn Brando',
    TaritaBrando: 'Tarita Brando',
    JamesDean: 'James Dean',
    AudryHepburn: 'Audry Hepburn',
    GeneralLabienus: 'General Labienus',
    Horace: 'Horace',
    HoracesMother: "Horace's mother",
    VitruviusPollio: 'Vitruvius Pollio',
    NapoleonBonaparte: 'Napoleon Bonaparte',
    OttoVonBismarck: 'Otto von Bismarck',
    GrigoriRasputin: 'Grigori Rasputin',
    GeorgeRandolphHearst: 'George Randolph Hearst',
    GaiusMarius: 'Gaius Marius',
    LiviaDrusilla: 'Livia Drusilla',
    MarieDeChampagne: 'Marie de Champagne',
    TheMurderScene: 'The murder scene',
    TheRaytheonMainOffices: 'The Raytheon main offices',
    TheRaytheonSkunkworks: 'The Raytheon Skunkworks',
    GaryDanko: 'Gary Danko',
    FirstConnection: 'First Connection',
    GoldenLotus: 'Golden Lotus',
    BloodDiamond: 'Blood Diamond',
  }

  const cluePointIdsInOrder = [
    CluePointKey.JocelynBrando,
    CluePointKey.TaritaBrando,
    CluePointKey.JamesDean,
    CluePointKey.AudryHepburn,
    CluePointKey.GeneralLabienus,
    CluePointKey.Horace,
    CluePointKey.HoracesMother,
    CluePointKey.VitruviusPollio,
    CluePointKey.NapoleonBonaparte,
    CluePointKey.OttoVonBismarck,
    CluePointKey.GrigoriRasputin,
    CluePointKey.GeorgeRandolphHearst,
    CluePointKey.GaiusMarius,
    CluePointKey.LiviaDrusilla,
    CluePointKey.MarieDeChampagne,
    CluePointKey.TheMurderScene,
    CluePointKey.TheRaytheonMainOffices,
    CluePointKey.TheRaytheonSkunkworks,
    CluePointKey.GaryDanko,
    CluePointKey.FirstConnection,
    CluePointKey.GoldenLotus,
    CluePointKey.BloodDiamond
  ]

  const cluePointData: CluePointData[] = [
    {
      id: CluePointKey.JocelynBrando,
      name: 'Jocelyn Brando',
      type: CluePointType.Person,
      passage: 'CluePoint_JocelynBrando',
      defaultKnown: true,
      reveals: []
    },
    {
      id: CluePointKey.TaritaBrando,
      name: 'Tarita Brando',
      type: CluePointType.Person,
      passage: 'CluePoint_TaritaBrando',
      defaultKnown: true,
      reveals: []
    },
    {
      id: CluePointKey.JamesDean,
      name: 'James Dean',
      type: CluePointType.Person,
      passage: 'CluePoint_JamesDean',
      defaultKnown: true,
      reveals: [
        CluePointKey.VitruviusPollio,
        CluePointKey.NapoleonBonaparte,
        CluePointKey.GoldenLotus
      ]
    },
    {
      id: CluePointKey.AudryHepburn,
      name: 'Audry Hepburn',
      type: CluePointType.Person,
      passage: 'CluePoint_AudryHepburn',
      defaultKnown: true,
      reveals: []
    },
    {
      id: CluePointKey.GeneralLabienus,
      name: 'General Labienus',
      type: CluePointType.Person,
      passage: 'CluePoint_GeneralLabienus',
      defaultKnown: true,
      reveals: [
        CluePointKey.VitruviusPollio,
        CluePointKey.NapoleonBonaparte,
        CluePointKey.OttoVonBismarck,
        CluePointKey.GrigoriRasputin
      ]
    },
    {
      id: CluePointKey.Horace,
      name: 'Horace',
      type: CluePointType.Person,
      passage: 'CluePoint_Horace',
      defaultKnown: true,
      reveals: []
    },
    {
      id: CluePointKey.HoracesMother,
      name: "Horace's mother",
      type: CluePointType.Person,
      passage: 'CluePoint_HoracesMother',
      defaultKnown: true,
      reveals: []
    },
    {
      id: CluePointKey.VitruviusPollio,
      name: 'Vitruvius Pollio',
      type: CluePointType.Person,
      passage: 'CluePoint_VitruviusPollio',
      defaultKnown: false,
      reveals: [
        CluePointKey.NapoleonBonaparte,
        CluePointKey.GoldenLotus
      ]
    },
    {
      id: CluePointKey.NapoleonBonaparte,
      name: 'Napoleon Bonaparte',
      type: CluePointType.Person,
      passage: 'CluePoint_NapoleonBonaparte',
      defaultKnown: false,
      reveals: [
        CluePointKey.GoldenLotus
      ]
    },
    {
      id: CluePointKey.OttoVonBismarck,
      name: 'Otto von Bismarck',
      type: CluePointType.Person,
      passage: 'CluePoint_OttoVonBismarck',
      defaultKnown: false,
      reveals: []
    },
    {
      id: CluePointKey.GrigoriRasputin,
      name: 'Grigori Rasputin',
      type: CluePointType.Person,
      passage: 'CluePoint_GrigoriRasputin',
      defaultKnown: false,
      reveals: []
    },
    {
      id: CluePointKey.GeorgeRandolphHearst,
      name: 'George Randolph Hearst',
      type: CluePointType.Person,
      passage: 'CluePoint_GeorgeRandolphHearst',
      defaultKnown: false,
      reveals: []
    },
    {
      id: CluePointKey.GaiusMarius,
      name: 'Gaius Marius',
      type: CluePointType.Person,
      passage: 'CluePoint_GaiusMarius',
      defaultKnown: false,
      reveals: []
    },
    {
      id: CluePointKey.LiviaDrusilla,
      name: 'Livia Drusilla',
      type: CluePointType.Person,
      passage: 'CluePoint_LiviaDrusilla',
      defaultKnown: false,
      reveals: []
    },
    {
      id: CluePointKey.MarieDeChampagne,
      name: 'Marie de Champagne',
      type: CluePointType.Person,
      passage: 'CluePoint_MarieDeChampagne',
      defaultKnown: false,
      reveals: []
    },
    // Locations
    {
      id: CluePointKey.TheMurderScene,
      name: 'The murder scene',
      type: CluePointType.Place,
      passage: 'CluePoint_TheMurderScene',
      defaultKnown: true,
      reveals: [CluePointKey.GoldenLotus]
    },
    {
      id: CluePointKey.TheRaytheonMainOffices,
      name: 'The Raytheon main offices',
      type: CluePointType.Place,
      passage: 'CluePoint_TheRaytheonMainOffices',
      defaultKnown: true,
      reveals: []
    },
    {
      id: CluePointKey.TheRaytheonSkunkworks,
      name: 'The Raytheon Skunkworks',
      type: CluePointType.Place,
      passage: 'CluePoint_TheRaytheonSkunkworks',
      defaultKnown: true,
      reveals: [
        CluePointKey.VitruviusPollio
      ]
    },
    {
      id: CluePointKey.GaryDanko,
      name: 'Gary Danko', type: CluePointType.Place, passage: 'CluePoint_GaryDanko',
      defaultKnown: true,
      reveals: [
        CluePointKey.BloodDiamond
      ]
    },
    {
      id: CluePointKey.FirstConnection,
      name: 'First Connection',
      type: CluePointType.Place,
      passage: 'CluePoint_FirstConnection',
      defaultKnown: true,
      reveals: [
        CluePointKey.GrigoriRasputin,
        CluePointKey.GeorgeRandolphHearst
      ]
    },
    {
      id: CluePointKey.GoldenLotus,
      name: 'Golden Lotus',
      type: CluePointType.Place,
      passage: 'CluePoint_GoldenLotus',
      defaultKnown: false,
      reveals: [
        CluePointKey.NapoleonBonaparte,
        CluePointKey.GaiusMarius,
        CluePointKey.VitruviusPollio,
        CluePointKey.LiviaDrusilla,
        CluePointKey.OttoVonBismarck
      ]
    },
    {
      id: CluePointKey.BloodDiamond,
      name: 'Blood Diamond',
      type: CluePointType.Place,
      passage: 'CluePoint_BloodDiamond',
      defaultKnown: false,
      reveals: [
        CluePointKey.MarieDeChampagne
      ]
    },
  ]

  class CluePointsImpl implements CluePoints {
    dataMap: Map<string, CluePointData>

    constructor (data: CluePointData[]) {
      this.dataMap = new Map<string, CluePointData>()
      for (let d of data) {
        this.dataMap.set(d.id, d)
      }
      // Integrity checks
      data.forEach((d) => {
        if (!cluePointIdsInOrder.includes(d.id)) {
          console.error(`Clue point in data ${d.id} has no ordering!`)
        }
        d.reveals.forEach((r) => {
          if (!this.dataMap.has(r)) {
            console.error(`Missing revealed id ${r} in data!`)
          }
        })
      })
      cluePointIdsInOrder.forEach((k) => {
        if (!this.dataMap.has(k)) {
          console.error(`Clue point in ordering ${k} not in data!`)
        }
      })
    }

    getKnownCluePointIds = (type: string | undefined) => {
      let knownIds: string[] | undefined = State.getVar('$knownCluePoints')
      if (!knownIds) {
        knownIds = cluePointIdsInOrder.filter((id) => this.dataMap.get(id)?.defaultKnown)
        State.setVar('$knownCluePoints', knownIds)
      }
      if (type) {
        return knownIds.filter((id) => this.dataMap.get(id)?.type === type)
      } else {
        return knownIds
      }
    }
  }

  (setup as any).CluePoints = new CluePointsImpl(cluePointData)
})()