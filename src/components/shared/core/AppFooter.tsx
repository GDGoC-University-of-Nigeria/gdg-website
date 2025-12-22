import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaInstagram, FaLinkedinIn, FaRegEnvelope, FaXTwitter } from 'react-icons/fa6';

import gdgLogo from '@/assets/gdg-logo.png';

const navSections = [
  {
    title: undefined,
    links: [
      { label: 'Home', href: '#home' },
      { label: 'Our Vibe', href: '#our-vibe' },
      { label: 'Upcoming Events', href: '#events' },
      { label: 'Join the Crew', href: '#join' },
      { label: 'Community Blog', href: '#blog' }
    ]
  },
  {
    title: 'Want to Help?',
    links: [
      { label: 'Apply to Speak', href: '#apply-to-speak' },
      { label: 'Volunteer with Us', href: '#volunteer' },
      { label: 'Submit an Article', href: '#submit-article' },
      { label: 'Contact the Team', href: '#contact' }
    ]
  },
  {
    title: 'Legal & Info',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Admin Login', href: '#admin' },
      { label: 'GDG Code of Conduct', href: '#code-of-conduct' }
    ]
  }
];

const socialLinks = [
  {
    label: 'Instagram',
    href: '#instagram',
    icon: <FaInstagram className="h-5 w-5" aria-hidden />
  },
  {
    label: 'Email',
    href: '#email',
    icon: <FaRegEnvelope className="h-5 w-5" aria-hidden />
  },
  {
    label: 'LinkedIn',
    href: '#linkedin',
    icon: <FaLinkedinIn className="h-5 w-5" aria-hidden />
  },
  {
    label: 'GitHub',
    href: '#github',
    icon: <FaGithub className="h-5 w-5" aria-hidden />
  },
  {
    label: 'X',
    href: '#x',
    icon: <FaXTwitter className="h-5 w-5" aria-hidden />
  }
];

export const AppFooter = () => {
  return (
    <footer className="w-full bg-tech-white text-solid-matte-gray">
      <div className="mx-auto flex w-full max-w-94 flex-col gap-8 px-6 py-10 md:max-w-360 md:px-10 lg:gap-10 lg:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center justify-between gap-6 md:min-w-72 w-1/2">
            <Image
              src={gdgLogo}
              alt="Google Developer Group UNN logo"
              className="h-12 w-auto"
              priority
            />
            <div className="hidden h-36 w-px bg-gray-300 md:block" />
          </div>

          <div className="max-w-1/2 grid flex-1 grid-cols-2 gap-8 md:grid-cols-3 md:gap-10">
            {navSections.map(({ title, links }) => (
              <div key={title ?? links[0].label} className="flex flex-col gap-2">
                {title ? (
                  <h3 className="text-sm font-semibold text-blackout">{title}</h3>
                ) : null}
                <ul className="flex flex-col gap-2 text-sm font-medium">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="transition-colors hover:text-blackout">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="grid h-10 w-10 place-items-center text-blackout transition-colors hover:border-blackout hover:text-alexandra"
              >
                {icon}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center md:gap-6">
            <span>
              2025 Google Developers Group UNN Chapter. Designed and Maintained by the GDG UNN
              Community.
            </span>
            <span className="font-semibold text-alexandra">
              Powered by Passion and a whole lot of Google Tech!
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
