'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHrmsStore, UserRole } from '../../stores/hrmsStore';
import {
  Home, Users, Calendar, BarChart3, BookOpen,
  Megaphone, UserCheck, TrendingUp, Layers, ClipboardList, FileText
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> };

const navByRole: Record<UserRole, NavItem[]> = {
  Employee: [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/attendance', label: 'Attendance', icon: Calendar },
    { href: '/performance', label: 'Goals', icon: TrendingUp },
    { href: '/training', label: 'Learning', icon: BookOpen },
    { href: '/contributions', label: 'Contribute', icon: Layers },
  ],
  Manager: [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/leave', label: 'Leave', icon: Calendar },
    { href: '/performance', label: 'Goals', icon: TrendingUp },
    { href: '/training', label: 'Learning', icon: BookOpen },
  ],
  HR: [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/recruitment', label: 'Recruit', icon: UserCheck },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/training', label: 'Learning', icon: BookOpen },
    { href: '/announcements', label: 'Announce', icon: Megaphone },
  ],
  Admin: [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/training', label: 'Learning', icon: BookOpen },
    { href: '/announcements', label: 'Announce', icon: Megaphone },
  ],
};

export function BottomNav() {
  const pathname = usePathname();
  const { activeRole, isOnboarding } = useHrmsStore();

  const onboardingItems: NavItem[] = [
    { href: '/onboarding', label: 'Onboarding', icon: ClipboardList },
    { href: '/training', label: 'Learning', icon: BookOpen },
    { href: '/documents', label: 'Documents', icon: FileText },
  ];

  const items = isOnboarding ? onboardingItems : navByRole[activeRole];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <span className="nav-icon-wrap">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
            </span>
            <span style={{ fontSize: '0.6rem', fontWeight: isActive ? 700 : 500, letterSpacing: '0.01em' }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
