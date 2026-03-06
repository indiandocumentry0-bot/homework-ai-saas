const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function getSupabaseUser(token: string) {
  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function selectSingle(table: string, select: string, filter: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${select}&${filter}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`
    }
  });
  const data = await res.json();
  return Array.isArray(data) ? data[0] : null;
}

export async function countRows(table: string, filter: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id&${filter}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'count=exact'
    }
  });
  const contentRange = res.headers.get('content-range') || '0/0';
  const total = Number(contentRange.split('/')[1] || 0);
  return total;
}

export async function insertRow(table: string, row: Record<string, unknown>) {
  await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(row)
  });
}

export async function upsertRow(table: string, row: Record<string, unknown>) {
  await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(row)
  });
}
