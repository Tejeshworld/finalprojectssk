"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import {
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineChatBubbleLeftRight,
  HiOutlineRectangleGroup,
  HiOutlineBookmark,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineKey,
  HiOutlineRocketLaunch,
} from 'react-icons/hi2';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="glass-header w-full" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0' }}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMobile}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>
            D
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
            Doubt<span style={{ color: 'var(--accent-primary)' }}>Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop flex flex-1 items-center justify-end gap-3 lg:gap-5 ml-8">
          <Link href="/hubs" style={{ fontWeight: 500, color: 'var(--text-secondary)' }} className="hover:text-white transition-colors text-sm lg:text-base">
            Hubs
          </Link>
          <Link href="/leaderboard" style={{ fontWeight: 500, color: 'var(--text-secondary)' }} className="hover:text-white transition-colors text-sm lg:text-base">
            Leaderboard
          </Link>
          <Link href="/chat" style={{ fontWeight: 500, color: 'var(--text-secondary)' }} className="hover:text-white transition-colors text-sm lg:text-base">
            Chat Lounge
          </Link>
          <Link href="/ask" className="mx-1">
            <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Ask a Doubt</button>
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                  <Link href="/bookmarks" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition-colors" title="Bookmarks">
                    <HiOutlineBookmark size={22} />
                  </Link>
                  <NotificationDropdown />
                  <Link href={`/profile/${user.id}`} className="flex items-center gap-2 ml-1" style={{ fontWeight: 500 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', color: 'white' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <button onClick={logout} className="hover:text-[var(--accent-danger)] text-[var(--text-secondary)] transition-colors ml-1" title="Logout">
                    <HiOutlineArrowRightOnRectangle size={24} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                  <Link href="/login" style={{ fontWeight: 500, color: 'var(--text-secondary)' }} className="hover:text-white transition-colors text-sm lg:text-base">Login</Link>
                  <Link href="/register" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Sign Up</Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Hamburger Button (mobile) */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '24px' }}>
            <span style={{
              display: 'block', height: '2px', background: 'white', borderRadius: '2px',
              transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none'
            }} />
            <span style={{
              display: 'block', height: '2px', background: 'white', borderRadius: '2px',
              transition: 'all 0.3s', opacity: mobileOpen ? 0 : 1
            }} />
            <span style={{
              display: 'block', height: '2px', background: 'white', borderRadius: '2px',
              transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'
            }} />
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu" onClick={closeMobile}>
          <Link href="/ask" className="nav-mobile-item nav-mobile-cta">
            <HiOutlineSparkles size={18} /> Ask a Doubt
          </Link>
          <Link href="/leaderboard" className="nav-mobile-item">
            <HiOutlineTrophy size={18} /> Leaderboard
          </Link>
          <Link href="/chat" className="nav-mobile-item">
            <HiOutlineChatBubbleLeftRight size={18} /> Chat Lounge
          </Link>
          <Link href="/hubs" className="nav-mobile-item">
            <HiOutlineRectangleGroup size={18} /> Hubs
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link href="/bookmarks" className="nav-mobile-item">
                    <HiOutlineBookmark size={18} /> Bookmarks
                  </Link>
                  <Link href="/notifications" className="nav-mobile-item">
                    <HiOutlineBell size={18} /> Notifications
                  </Link>
                  <Link href={`/profile/${user.id}`} className="nav-mobile-item">
                    <HiOutlineUserCircle size={18} /> {user.username}
                  </Link>
                  <button onClick={() => { logout(); closeMobile(); }} className="nav-mobile-item" style={{ width: '100%', textAlign: 'left', color: 'var(--accent-danger)' }}>
                    <HiOutlineArrowRightOnRectangle size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-mobile-item">
                    <HiOutlineKey size={18} /> Login
                  </Link>
                  <Link href="/register" className="nav-mobile-item nav-mobile-cta">
                    <HiOutlineRocketLaunch size={18} /> Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
