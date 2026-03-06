const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const tokenKey = 'homeworkai_access_token';

async function authRequest(path: string, body?: unknown, token?: string) {
  const res = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      apikey: anonKey,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  return res;
}

export function createSupabaseBrowserClient() {
  return {
    auth: {
      async signUp({ email, password }: { email: string; password: string }) {
        const res = await authRequest('signup', { email, password });
        const data = await res.json();
        if (!res.ok) return { error: { message: data.msg || 'Signup failed' } };
        return { error: null };
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const res = await authRequest('token?grant_type=password', { email, password });
        const data = await res.json();
        if (!res.ok) return { error: { message: data.error_description || 'Login failed' } };
        localStorage.setItem(tokenKey, data.access_token);
        return { error: null };
      },
      async signInWithOAuth({ options }: { provider: 'google'; options: { redirectTo: string } }) {
        const redirect = encodeURIComponent(options.redirectTo);
        window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirect}&response_type=token`;
        return { error: null };
      },
      async getSession() {
        return { data: { session: { access_token: localStorage.getItem(tokenKey) } } };
      },
      async getUser() {
        const token = localStorage.getItem(tokenKey);
        if (!token) return { data: { user: null } };
        const res = await authRequest('user', undefined, token);
        if (!res.ok) return { data: { user: null } };
        return { data: { user: await res.json() } };
      },
      setAccessToken(token: string) {
        localStorage.setItem(tokenKey, token);
      }
    },
    storage: {
      from(bucket: string) {
        return {
          async upload(path: string, file: File) {
            const token = localStorage.getItem(tokenKey);
            const res = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
              method: 'POST',
              headers: {
                apikey: anonKey,
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              },
              body: file
            });
            const data = await res.json();
            if (!res.ok) return { data: null, error: { message: data.message || 'Upload failed' } };
            return { data: { path }, error: null };
          }
        };
      }
    },
    async fetchQuestions(limit = 20) {
      const token = localStorage.getItem(tokenKey);
      const res = await fetch(
        `${supabaseUrl}/rest/v1/questions?select=id,question_text,ai_answer,created_at&order=created_at.desc&limit=${limit}`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  };
}
