interface Ch3 {
  getVoteSeal: (role: string) => JQuery<HTMLElement>
}

(function () {
  class Ch3Impl implements Ch3 {
    getVoteSeal = (role: string): JQuery<HTMLElement> => {
      const Roles = (setup as any).Roles as Roles

      const onPage = $(`#role-${role}-vote-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        const sealClass = role === Roles.ANTONY ? 'antony-ch3-seal' : 'cleopatra-ch3-seal'
        const html = role === Roles.ANTONY ? '<strong>A</strong>' : '<strong>C</strong>'
        return jQuery(document.createElement('div'))
          .attr('id', `role-${role}-vote-seal`)
          .addClass(sealClass)
          .html(html)
      }
    }

    getMotiveSeal = (role: string): JQuery<HTMLElement> => {
      const Roles = (setup as any).Roles as Roles

      const onPage = $(`#role-${role}-motive-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        const sealClass = role === Roles.ANTONY ? 'antony-ch3-seal' : 'cleopatra-ch3-seal'
        const html = role === Roles.ANTONY ? '<strong>A</strong>' : '<strong>C</strong>'
        return jQuery(document.createElement('div'))
          .attr('id', `role-${role}-motive-seal`)
          .addClass(sealClass)
          .html(html)
      }
    }

    getBreachSeal = (role: string): JQuery<HTMLElement> => {
      const Roles = (setup as any).Roles as Roles

      const onPage = $(`#role-${role}-breach-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        const sealClass = role === Roles.ANTONY ? 'antony-ch3-seal' : 'cleopatra-ch3-seal'
        const html = role === Roles.ANTONY ? '<strong>A</strong>' : '<strong>C</strong>'
        return jQuery(document.createElement('div'))
          .attr('id', `role-${role}-breach-seal`)
          .addClass(sealClass)
          .html(html)
      }
    }

    getBreacherSeal = (role: string): JQuery<HTMLElement> => {
      const Roles = (setup as any).Roles as Roles

      const onPage = $(`#role-${role}-breacher-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        const sealClass = role === Roles.ANTONY ? 'antony-ch3-seal' : 'cleopatra-ch3-seal'
        const html = role === Roles.ANTONY ? '<strong>A</strong>' : '<strong>C</strong>'
        return jQuery(document.createElement('div'))
          .attr('id', `role-${role}-breacher-seal`)
          .addClass(sealClass)
          .html(html)
      }
    }

    getSubmitSeal = (role: string): JQuery<HTMLElement> => {
      const Roles = (setup as any).Roles as Roles

      const onPage = $(`#role-${role}-submit-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        const sealClass = role === Roles.ANTONY ? 'antony-ch3-seal' : 'cleopatra-ch3-seal'
        const html = role === Roles.ANTONY ? '<strong>A</strong>' : '<strong>C</strong>'
        return jQuery(document.createElement('div'))
          .attr('id', `role-${role}-submit-seal`)
          .addClass(sealClass)
          .html(html)
      }
    }

    _disableSubmission = () => {
      const Roles = (setup as any).Roles as Roles

      ($('#finish-report button')[0] as any).disabled = true
      const as = this.getSubmitSeal(Roles.ANTONY)[0]
      if (as) { as.remove() }
      const cs = this.getSubmitSeal(Roles.CLEOPATRA)[0]
      if (cs) { cs.remove() }
    }

    _enableSubmission = () => {
      ($('#finish-report button')[0] as any).disabled = false
    }

    processNonFinalVote = () => {
      const Roles = (setup as any).Roles as Roles

      // Vote seals
      const avs = this.getVoteSeal(Roles.ANTONY)[0]
      const cvs = this.getVoteSeal(Roles.CLEOPATRA)[0]
      if (!(avs && cvs && avs.parentNode && avs.parentNode === cvs.parentNode)) {
        this._disableSubmission()
        return
      }

      const ams = this.getMotiveSeal(Roles.ANTONY)[0]
      const cms = this.getMotiveSeal(Roles.CLEOPATRA)[0]
      if (!(ams && cms && ams.parentNode && ams.parentNode === cms.parentNode)) {
        this._disableSubmission()
        return
      }

      const abs = this.getBreachSeal(Roles.ANTONY)[0]
      const cbs = this.getBreachSeal(Roles.CLEOPATRA)[0]
      if (!(abs && cbs && abs.parentNode && abs.parentNode === cbs.parentNode)) {
        this._disableSubmission()
        return
      }

      const abrs = this.getBreacherSeal(Roles.ANTONY)[0]
      const cbrs = this.getBreacherSeal(Roles.CLEOPATRA)[0]
      if (!(abrs && cbrs && abrs.parentNode && abrs.parentNode === cbrs.parentNode)) {
        this._disableSubmission()
        return
      }
      
      this._enableSubmission()
    }
  }

  (setup as any).Ch3 = new Ch3Impl()
})()