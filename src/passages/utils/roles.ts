interface Roles {
  ANTONY: string
  CLEOPATRA: string

  isAntony: () => boolean
  isCleopatra: () => boolean

  getRole: () => string | undefined
  getRoleIcon: (role: string) => JQuery<HTMLElement>
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

    getRoleIcon = (role: string): JQuery<HTMLElement> => {
      if (!role) { console.error(`Role ${role} is undefined! Returning brother icon.`) }

      const onPage = $(`#role-${role}-icon`)
      if (onPage.length > 0) {
        return onPage
      } else {
        // TODO: Convert from brother
        const iconPath = role === this.ANTONY ? 'images/vicon.png' : 'images/jicon.png'
        const iconClass = role === this.CLEOPATRA ? 'brother-icon' : 'sister-icon'
        return jQuery(document.createElement('img'))
          .attr('id', `role-${role}-icon`)
          .attr('src', iconPath)
          .addClass(iconClass)
      }
    }
  }

  (setup as any).Roles = new RolesImpl()
})()