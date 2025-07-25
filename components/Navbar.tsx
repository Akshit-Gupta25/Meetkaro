import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';
import { ModeToggle } from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-cream dark:bg-dark-1 px-6 py-4 lg:px-10 text-black dark:text-white">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
          style={{ height: 'auto' }}
        />
        <p className="text-[26px] font-extrabold text-black dark:text-white max-sm:hidden">
          MEET KARO 
        </p>
      </Link>
      <div className="flex-between gap-5">
        <ModeToggle />
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
