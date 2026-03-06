import Link from 'next/link';

const links = [
  { href: '/landing', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/login', label: 'Login' },
  { href: '/signup', label: 'Signup' }
];

export function Navbar() {
  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between py-4">
      <Link href="/landing" className="text-xl font-bold text-brand">
        HomeworkAI
      </Link>
      <div className="flex items-center gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-700 hover:text-brand">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
