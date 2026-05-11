import { currentUserFn } from '#/server/auth'
import type { UserData } from '#/types/auth'
import { redirect } from '@tanstack/react-router'

export function hasSession(data: Partial<UserData>): data is UserData {
  return !!data.user_id && !!data.access
}

export async function requireAuth() {
  const context = await currentUserFn()
  if (!context) throw redirect({ to: '/' })
  return context
}
