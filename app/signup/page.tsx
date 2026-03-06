import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';

export default function SignupPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <AuthForm mode="signup" />
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link className="text-brand" href="/login">Login</Link>
      </p>
    </main>
  );
}
