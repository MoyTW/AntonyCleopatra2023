enum RoleEnum {
  BROTHER = 'BROTHER',
  SISTER = 'SISTER',
  PILOT = 'PILOT',
  SCHOLAR = 'SCHOLAR'
}

interface Roles {
  PILOT: string
  SCHOLAR: string
  isPilot: () => boolean
  isScholar: () => boolean

  BROTHER: string
  SISTER: string
  isBrother: () => boolean
  isSister: () => boolean

  getRole: () => string | undefined
  getRoleIcon: (role: string) => JQuery<HTMLElement>
}

(function () {
  class RolesImpl implements Roles {
    BROTHER = "BROTHER"
    SISTER = "SISTER"
    PILOT = "PILOT"
    isPilot = () => { return this.hasRole(this.PILOT) }
    SCHOLAR = "SCHOLAR"
    isScholar = () => { return this.hasRole(this.SCHOLAR) }

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

    isBrother = (): boolean => {
      return this.hasRole(this.BROTHER)
    }

    isSister = (): boolean => {
      return this.hasRole(this.SISTER)
    }

    getRole = (): string | undefined => {
      if (this.isBrother()) {
        return this.BROTHER
      } else if (this.isSister()) {
        return this.SISTER
      } else if (this.isPilot()) {
        return this.PILOT
      } else if (this.isScholar()) {
        return this.SCHOLAR
      } else {
        console.error(`getRole was called but no such role was assigned!`)
        return undefined
      }
    }

    getRoleIcon = (role: string): JQuery<HTMLElement> => {
      if (!role) { console.error(`Role ${role} is undefined! Returning brother icon.`) }

      const onPage = $(`#role-${role}-icon`)
      if (onPage.length > 0) {
        return onPage
      } else {
        // TODO: Convert from brother
        const iconPath = role === this.BROTHER ? 'images/vicon.png' : 'images/jicon.png'
        const iconClass = role === this.BROTHER ? 'brother-icon' : 'sister-icon'
        return jQuery(document.createElement('img'))
          .attr('id', `role-${role}-icon`)
          .attr('src', iconPath)
          .addClass(iconClass)
      }
    }
  }

  (setup as any).Roles = new RolesImpl()
})()