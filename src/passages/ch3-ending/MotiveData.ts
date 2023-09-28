interface MotiveData {
  id: string,
  description: string,
}

interface Motives {
  getMotives: () => MotiveData[]
  getDescription: (motiveId: string) => string | undefined
}

(function () {
  const MotiveKey = {
    Advancement: 'MAdvancement',
    Grudge: 'MGrudge',
    Rivalry: 'MRivalry',
    Coverup: 'MCoverup',
    Infidelity: 'MInfidelity',
    Weapons: 'MWeapons',
    Personnel: 'MPersonnel',
    Theft: 'MTheft',
  }

  const motiveKeysInOrder = [
    MotiveKey.Advancement,
    MotiveKey.Grudge,
    MotiveKey.Rivalry,
    MotiveKey.Coverup,
    MotiveKey.Infidelity,
    MotiveKey.Weapons,
    MotiveKey.Personnel,
    MotiveKey.Theft,
  ]

  const motiveData: MotiveData[] = [
    {
      id: MotiveKey.Advancement,
      description: `Career advancement.`,
    },
    {
      id: MotiveKey.Grudge,
      description: `His repeated abusive behavior.`,
    },
    {
      id: MotiveKey.Rivalry,
      description: `Professional rivalry.`,
    },
    {
      id: MotiveKey.Coverup,
      description: `To hide a different crime.`,
    },
    {
      id: MotiveKey.Infidelity,
      description: `His infidelity.`,
    },
    {
      id: MotiveKey.Weapons,
      description: `To steal classified weapons data.`,
    },
    {
      id: MotiveKey.Personnel,
      description: `To steal private HR records.`,
    },
    {
      id: MotiveKey.Theft,
      description: `In order to rob him for money.`,
    },    
  ]

  class MotivesImpl implements Motives {
    dataMap: Map<string, MotiveData>

    constructor (data: MotiveData[]) {
      this.dataMap = new Map<string, MotiveData>()

      for (let d of data) {
        this.dataMap.set(d.id, d)
      }
    }

    getMotives = () => {
      return motiveKeysInOrder.map((id) => this.dataMap.get(id)!)
    }

    getDescription = (motiveId: string) => {
      return this.dataMap.get(motiveId)?.description
    }
  }

  (setup as any).Motives = new MotivesImpl(motiveData)
})()