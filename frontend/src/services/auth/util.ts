import { User } from '@auth0/auth0-react';

export const CLAIM_ROLE = 'https://mrmglobal.com/role';
export const ROLE_ADMIN = 'mrm_admin';

export function isAdmin(user?: User) {
  if (!user) return false;

  return user[CLAIM_ROLE].includes(ROLE_ADMIN);
}
