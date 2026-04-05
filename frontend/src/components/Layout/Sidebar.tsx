import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { boardsApi } from '@/services/api';
import styles from './Sidebar.module.css';

// ── Icons ─────────────────────────────────────────────────────────────────────

const IcoDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

const IcoContacts = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IcoCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17H5a2 2 0 0 1-2-2v-4l2-5h14l2 5v4a2 2 0 0 1-2 2z"/>
    <circle cx="7.5" cy="17" r="1.5"/>
    <circle cx="16.5" cy="17" r="1.5"/>
  </svg>
);

const IcoContract = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IcoKanban = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="18" rx="1"/>
    <rect x="10" y="3" width="5" height="11" rx="1"/>
    <rect x="17" y="3" width="5" height="14" rx="1"/>
  </svg>
);

const IcoBoard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="9" x2="9" y2="21"/>
  </svg>
);

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard', icon: <IcoDashboard />, end: true },
  { to: '/contacts',  label: 'Contatos',  icon: <IcoContacts />,  end: false },
  { to: '/vehicles',  label: 'Veículos',  icon: <IcoCar />,       end: false },
  { to: '/contracts', label: 'Contratos', icon: <IcoContract />,  end: false },
  { to: '/boards',    label: 'Quadros',   icon: <IcoKanban />,    end: true },
];

export default function Sidebar() {
  const { data: boards = [] } = useQuery({
    queryKey: ['boards'],
    queryFn: boardsApi.list,
  });

  return (
    <aside className={styles.sidebar}>

      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <IcoCar />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>GlobalVeículos</span>
          <span className={styles.logoBadge}>CRM</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <p className={styles.groupLabel}>Menu</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {(boards as { id: string; name: string }[]).length > 0 && (
          <div className={styles.navGroup}>
            <p className={styles.groupLabel}>Kanban</p>
            {(boards as { id: string; name: string }[]).map((board) => (
              <NavLink
                key={board.id}
                to={`/boards/${board.id}`}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}><IcoBoard /></span>
                <span className={`${styles.navLabel} ${styles.truncate}`}>{board.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

    </aside>
  );
}
