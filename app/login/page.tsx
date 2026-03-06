import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <AuthForm mode="login" />
      <p className="mt-4 text-center text-sm">
        No account? <Link className="text-brand" href="/signup">Sign up</Link>
      </p>
    </main>
  );
}
