import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { boardsApi, tenantApi, vehiclesApi } from '@/services/api';
import styles from './DashboardPage.module.css';

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17H5a2 2 0 0 1-2-2v-4l2-5h14l2 5v4a2 2 0 0 1-2 2z"/>
    <circle cx="7.5" cy="17" r="1.5"/>
    <circle cx="16.5" cy="17" r="1.5"/>
  </svg>
);

const IconKanban = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="18" rx="1"/>
    <rect x="10" y="3" width="5" height="11" rx="1"/>
    <rect x="17" y="3" width="5" height="14" rx="1"/>
  </svg>
);

const IconDeal = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const IconSettings = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

const COLUMN_COLORS = ['#6366F1','#10B981','#F59E0B','#EF4444','#8B5CF6','#3B82F6','#EC4899'];

type Board = {
  id: string;
  name: string;
  columns: { id: string; name: string; color?: string; _count: { cards: number } }[];
};

type Vehicle = { status: string };

// ── Component ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['tenant-stats'], queryFn: tenantApi.stats });
  const { data: boards = [] } = useQuery<Board[]>({ queryKey: ['boards'], queryFn: boardsApi.list });
  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-dash'],
    queryFn: () => vehiclesApi.list(),
  });

  const totalCards = (boards as Board[]).reduce(
    (sum, b) => sum + b.columns.reduce((s, c) => s + c._count.cards, 0),
    0,
  );

  const vehicleByStatus = (vehicles as Vehicle[]).reduce<Record<string, number>>((acc, v) => {
    acc[v.status] = (acc[v.status] ?? 0) + 1;
    return acc;
  }, {});

  const KPI_ITEMS = [
    { label: 'Contatos', value: stats?.contacts ?? '–', icon: <IconUsers />, color: 'var(--color-info)', bg: 'var(--color-info-subtle)', to: '/contacts' },
    { label: 'Veículos', value: stats?.vehicles ?? '–', icon: <IconCar />, color: 'var(--color-success)', bg: 'var(--color-success-subtle)', to: '/vehicles' },
    { label: 'Quadros', value: stats?.boards ?? '–', icon: <IconKanban />, color: 'var(--color-violet)', bg: 'var(--color-violet-subtle)', to: '/boards' },
    { label: 'Negociações', value: totalCards, icon: <IconDeal />, color: 'var(--color-warning)', bg: 'var(--color-warning-subtle)', to: '/boards' },
  ];

  const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    available: { label: 'Disponível', cls: 'badge-available' },
    reserved:  { label: 'Reservado',  cls: 'badge-reserved' },
    sold:      { label: 'Vendido',    cls: 'badge-sold' },
  };

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className={`card-surface ${styles.hero}`}>
        <div className={styles.heroContent}>
          <p className={styles.heroDate}>{todayLabel()}</p>
          <h1 className={styles.heroTitle}>{greeting()}, bem-vindo! 👋</h1>
          <p className={styles.heroSub}>Aqui está um resumo das suas operações hoje.</p>
        </div>
        <div className={styles.heroActions}>
          <Link to="/boards" className={`btn btn-ghost ${styles.heroBtn}`}>
            <IconSettings /> Gerenciar Quadros
          </Link>
          <Link to="/contacts" className={`btn btn-accent ${styles.heroBtn}`}>
            <IconPlus /> Novo Contato
          </Link>
        </div>
      </div>

      {/* ── KPI grid ─────────────────────────────────────────── */}
      <div className={styles.kpiGrid}>
        {KPI_ITEMS.map((k) => (
          <Link key={k.label} to={k.to} className={`card-surface ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ background: k.bg, color: k.color }}>
              {k.icon}
            </div>
            <div className={styles.kpiBody}>
              <span className={styles.kpiValue}>{k.value}</span>
              <span className={styles.kpiLabel}>{k.label}</span>
            </div>
            <div className={styles.kpiArrow}>
              <IconArrow />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Content grid ─────────────────────────────────────── */}
      <div className={styles.contentGrid}>

        {/* Boards */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quadros Kanban</h2>
            <Link to="/boards" className={`btn btn-ghost btn-sm`}>
              <IconPlus /> Novo quadro
            </Link>
          </div>

          {(boards as Board[]).length === 0 ? (
            <div className={`card-surface ${styles.empty}`}>
              <IconKanban />
              <p>Nenhum quadro criado ainda.</p>
              <Link to="/boards" className="btn btn-accent btn-sm">Criar agora</Link>
            </div>
          ) : (
            <div className={styles.boardGrid}>
              {(boards as Board[]).map((board, bi) => {
                const cardCount = board.columns.reduce((s, c) => s + c._count.cards, 0);
                return (
                  <Link key={board.id} to={`/boards/${board.id}`} className={`card-surface ${styles.boardCard}`}>
                    <div className={styles.boardCardTop}>
                      <div className={styles.boardIcon} style={{ background: COLUMN_COLORS[bi % COLUMN_COLORS.length] + '22', color: COLUMN_COLORS[bi % COLUMN_COLORS.length] }}>
                        <IconKanban />
                      </div>
                      <div className={styles.boardMeta}>
                        <h3 className={styles.boardName}>{board.name}</h3>
                        <p className={styles.boardStats}>{board.columns.length} colunas · {cardCount} cards</p>
                      </div>
                    </div>
                    {board.columns.length > 0 && (
                      <div className={styles.columnPills}>
                        {board.columns.slice(0, 5).map((col, i) => (
                          <span
                            key={col.id}
                            className={styles.columnPill}
                            style={{ background: (col.color ?? COLUMN_COLORS[i % COLUMN_COLORS.length]) + '22', color: col.color ?? COLUMN_COLORS[i % COLUMN_COLORS.length] }}
                          >
                            {col.name}
                            {col._count.cards > 0 && <b>{col._count.cards}</b>}
                          </span>
                        ))}
                        {board.columns.length > 5 && (
                          <span className={styles.columnPillMore}>+{board.columns.length - 5}</span>
                        )}
                      </div>
                    )}
                    <div className={styles.boardCardFooter}>
                      <span className={styles.openLink}>Abrir quadro <IconArrow /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Right panel */}
        <aside className={styles.aside}>

          {/* Vehicles by status */}
          <div className={`card-surface ${styles.asideCard}`}>
            <div className={styles.asideCardHeader}>
              <h3 className={styles.asideTitle}>Veículos por status</h3>
              <Link to="/vehicles" className={styles.asideLink}>Ver todos <IconArrow /></Link>
            </div>
            {(vehicles as Vehicle[]).length === 0 ? (
              <p className={styles.asideEmpty}>Nenhum veículo cadastrado.</p>
            ) : (
              <div className={styles.statusList}>
                {Object.entries(vehicleByStatus).map(([status, count]) => {
                  const info = STATUS_LABELS[status] ?? { label: status, cls: 'badge-draft' };
                  const pct = Math.round((count / (vehicles as Vehicle[]).length) * 100);
                  return (
                    <div key={status} className={styles.statusRow}>
                      <div className={styles.statusRowTop}>
                        <span className={`badge ${info.cls}`}>{info.label}</span>
                        <span className={styles.statusCount}>{count}</span>
                      </div>
                      <div className={styles.statusBar}>
                        <div className={styles.statusBarFill} style={{ width: `${pct}%`, background: status === 'available' ? 'var(--color-success)' : status === 'reserved' ? 'var(--color-warning)' : 'var(--color-danger)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className={`card-surface ${styles.asideCard}`}>
            <h3 className={styles.asideTitle} style={{ marginBottom: 12 }}>Ações rápidas</h3>
            <div className={styles.quickLinks}>
              {[
                { to: '/contacts', label: 'Novo contato', icon: <IconUsers /> },
                { to: '/vehicles', label: 'Novo veículo', icon: <IconCar /> },
                { to: '/contracts', label: 'Ver contratos', icon: <IconDeal /> },
              ].map((q) => (
                <Link key={q.to} to={q.to} className={styles.quickLink}>
                  <span className={styles.quickLinkIcon}>{q.icon}</span>
                  <span>{q.label}</span>
                  <span className={styles.quickLinkArrow}><IconArrow /></span>
                </Link>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
