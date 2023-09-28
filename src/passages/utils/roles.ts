interface Roles {
  ANTONY: string
  CLEOPATRA: string

  isAntony: () => boolean
  isCleopatra: () => boolean

  getRole: () => string | undefined
  getSeal: (role: string | undefined) => JQuery<HTMLElement>
}

(function () {
  class RolesImpl implements Roles {
    ANTONY = 'ANTONY'
    CLEOPATRA = 'CLEOPATRA'

    isAntony = () => { return this.hasRole(this.ANTONY) }
    isCleopatra = () => { return this.hasRole(this.CLEOPATRA) }

    hasRole = (role: string): boolean => {
      const roles: { [key: string]: string[] | undefined } = State.getVar('$websocketRoles')
      const clientId = State.getVar('$clientId')
      
      if (!roles) {
        console.error(`No roles registered for ${clientId}!`)
        return false
      } else {
        return roles[clientId]!.includes(role)
      }
    }

    getRole = (): string | undefined => {
      if (this.isAntony()) {
        return this.ANTONY
      } else if (this.isCleopatra()) {
        return this.CLEOPATRA
      } else {
        return undefined
      }
    }

    // TODO: Unify this with the widgets (probably by calling wikify)
    getSeal = (role: string | undefined): JQuery<HTMLElement> => {
      if (role === undefined) {
        role = this.getRole()
      }

      const onPage = $(`#role-${role}-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        const sealClass = role === this.ANTONY ? 'antony-seal' : 'cleopatra-seal'
        const html = role === this.ANTONY ? '<strong>A</strong>' : '<strong>C</strong>'
        return jQuery(document.createElement('div'))
          .attr('id', `role-${role}-seal`)
          .addClass(sealClass)
          .html(html)
      }
    }

    getHostSeal = (): JQuery<HTMLElement> => {
      const onPage = $(`#role-HOST-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        return jQuery(document.createElement('div'))
          .attr('id', `role-HOST-seal`)
          .addClass('select-host-seal')
          .html('<strong>H</strong>')
      }
    }
    getHostConfirmSeal = (): JQuery<HTMLElement> => {
      const onPage = $(`#role-HOST-CONFIRM-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        return jQuery(document.createElement('div'))
          .attr('id', `role-HOST-CONFIRM-seal`)
          .addClass('select-host-seal')
          .html('<strong>H</strong>')
      }
    }
    getJoinerSeal = (): JQuery<HTMLElement> => {
      const onPage = $(`#role-JOINER-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        return jQuery(document.createElement('div'))
          .attr('id', `role-JOINER-seal`)
          .addClass('select-joiner-seal')
          .html('<strong>J</strong>')
      }
    }
    getJoinerConfirmSeal = (): JQuery<HTMLElement> => {
      const onPage = $(`#role-JOINER-CONFIRM-seal`)
      if (onPage.length > 0) {
        return onPage
      } else {
        return jQuery(document.createElement('div'))
          .attr('id', `role-JOINER-CONFIRM-seal`)
          .addClass('select-joiner-seal')
          .html('<strong>J</strong>')
      }
    }
  }

  (setup as any).Roles = new RolesImpl()
})()