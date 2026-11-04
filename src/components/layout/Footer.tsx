import Link from 'next/link';

const PRODUCT_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Learning Studio', href: '/learning' },
  { label: 'Practice Arena', href: '/practice' },
  { label: 'Topic Intelligence', href: '/topics' },
];

const LANGUAGE_LINKS = [
  { label: 'Tamil', href: '#' },
  { label: 'Hindi', href: '#' },
  { label: 'Telugu', href: '#' },
  { label: 'Malayalam', href: '#' },
  { label: 'English', href: '#' },
];

const COMPANY_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Blog', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ivory border-t border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-0.5 select-none mb-4">
              <span className="font-serif text-2xl font-bold text-editorial-blue">LinguaLearn</span>
              <span className="font-serif text-2xl font-bold text-coral">AI</span>
            </Link>
            <p className="text-ink/60 text-sm leading-relaxed mt-3 max-w-xs">
              Your AI-powered multilingual learning companion. Upload, understand, and master any
              document in your mother tongue.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {/* Social icons placeholders */}
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-editorial-blue/10 flex items-center justify-center hover:bg-editorial-blue/20 transition-colors"
              >
                <svg className="w-4 h-4 text-editorial-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-editorial-blue/10 flex items-center justify-center hover:bg-editorial-blue/20 transition-colors"
              >
                <svg className="w-4 h-4 text-editorial-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-editorial-blue/10 flex items-center justify-center hover:bg-editorial-blue/20 transition-colors"
              >
                <svg className="w-4 h-4 text-editorial-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-ink font-semibold text-sm uppercase tracking-widest mb-5">
              Product
            </h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink/60 text-sm hover:text-editorial-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-ink font-semibold text-sm uppercase tracking-widest mb-5">
              Languages
            </h3>
            <ul className="space-y-3">
              {LANGUAGE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ink/60 text-sm hover:text-editorial-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-ink font-semibold text-sm uppercase tracking-widest mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ink/60 text-sm hover:text-editorial-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/8 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ink/40 text-sm">
            &copy; {year} LinguaLearn AI. All rights reserved.
          </p>
          <p className="text-ink/40 text-sm">
            Built with ❤️ for learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
