import { getSupabaseUser } from '@/lib/supabase-admin';

export async function getUserFromAuthHeader(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  return getSupabaseUser(token);
}
