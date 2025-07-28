import config from 'config'
import { Member } from 'eris'

export const isAdmin = (member: Member, adminRole?: string): boolean =>
  !adminRole
    ? member.permissions.has('administrator')
    : member.roles.indexOf(adminRole as string) !== -1

export const isDev = (member: Member): boolean =>
  member.id === config.get('DEVELOPER_ID')

export const isDJ = (member: Member, djRole?: string): boolean =>
  !djRole
    ? true
    : member.roles.indexOf(djRole) !== -1
