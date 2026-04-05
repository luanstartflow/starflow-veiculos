import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi, contactsApi, vehiclesApi, contractsApi } from '@/services/api';
import styles from './CardModal.module.css';

interface Contact { id: string; name: string; phone?: string | null; email?: string | null }
interface Vehicle { id: string; brand: string; model: string; year: number; plate?: string | null; price?: unknown }
interface Contract { id: string; number: string; status: string }

interface Card {
  id: string;
  title: string;
  description?: string | null;
  value?: number | null;
  dueDate?: string | null;
  chatwootConversationId?: number | null;
  contact?: Contact | null;
  vehicle?: Vehicle | null;
  contracts?: Contract[];
}

interface Props {
  cardId: string;
  boardId: string;
  onClose: () => void;
}

type Tab = 'info' | 'associations' | 'contract';

export default function CardModal({ cardId, boardId, onClose }: Props) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('info');

  // ── Card data ──────────────────────────────────────────────────────────────
  const { data: card, isLoading } = useQuery<Card>({
    queryKey: ['card', cardId],
    queryFn: () => cardsApi.get(cardId),
  });

  // ── Edit form state ────────────────────────────────────────────────────────
  const [form, setForm] = useState({ title: '', description: '', value: '', dueDate: '' });

  useEffect(() => {
    if (card) {
      setForm({
        title: card.title,
        description: card.description ?? '',
        value: card.value != null ? String(card.value) : '',
        dueDate: card.dueDate ? card.dueDate.slice(0, 10) : '',
      });
    }
  }, [card]);

  const updateCard = useMutation({
    mutationFn: (data: Record<string, unknown>) => cardsApi.update(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] });
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const handleSave = () => {
    updateCard.mutate({
      title: form.title,
      description: form.description || null,
      value: form.value ? parseFloat(form.value) : null,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    });
  };

  // ── Associations ───────────────────────────────────────────────────────────
  const [contactSearch, setContactSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts', contactSearch],
    queryFn: () => contactsApi.list(contactSearch || undefined),
    enabled: tab === 'associations',
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-all', vehicleSearch],
    queryFn: () => vehiclesApi.list(undefined, vehicleSearch || undefined),
    enabled: tab === 'associations',
  });

  const associateMutation = useMutation({
    mutationFn: (data: { contactId?: string | null; vehicleId?: string | null }) =>
      cardsApi.update(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] });
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  // ── Contract ───────────────────────────────────────────────────────────────
  const { data: contracts = [] } = useQuery<Contract[]>({
    queryKey: ['contracts', cardId],
    queryFn: () => contractsApi.list(cardId),
    enabled: tab === 'contract',
  });

  const [contractTemplate, setContractTemplate] = useState('Compra e Venda');
  const [contractNumber, setContractNumber] = useState('');

  const createContract = useMutation({
    mutationFn: () =>
      contractsApi.create({
        cardId,
        template: contractTemplate,
        number: contractNumber || `CONT-${Date.now()}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', cardId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setContractNumber('');
    },
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            {isLoading ? '...' : form.title || 'Card'}
          </span>
          {card?.chatwootConversationId && (
            <span className={styles.convBadge}>Conversa #{card.chatwootConversationId}</span>
          )}
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.tabs}>
          {(['info', 'associations', 'contract'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'info' ? 'Informações' : t === 'associations' ? 'Vínculos' : 'Contrato'}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          {/* ── INFO TAB ── */}
          {tab === 'info' && (
            <div className={styles.formGrid}>
              <label className={styles.label}>
                Título *
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </label>

              <label className={styles.label} style={{ gridColumn: '1 / -1' }}>
                Descrição
                <textarea
                  className="input"
                  style={{ resize: 'vertical', minHeight: 72 }}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </label>

              <label className={styles.label}>
                Valor (R$)
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                />
              </label>

              <label className={styles.label}>
                Data limite
                <input
                  className="input"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                />
              </label>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  className="btn btn-primary"
                  disabled={!form.title.trim() || updateCard.isPending}
                  onClick={handleSave}
                >
                  {updateCard.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          )}

          {/* ── ASSOCIATIONS TAB ── */}
          {tab === 'associations' && (
            <div className={styles.assocSection}>
              {/* Contact */}
              <div className={styles.assocBlock}>
                <h4 className={styles.assocTitle}>Contato vinculado</h4>
                {card?.contact ? (
                  <div className={styles.assocCard}>
                    <span>👤 {card.contact.name}</span>
                    {card.contact.phone && <span className={styles.assocMeta}>{card.contact.phone}</span>}
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 11, padding: '2px 8px', marginLeft: 'auto' }}
                      onClick={() => associateMutation.mutate({ contactId: null })}
                    >
                      Desvincular
                    </button>
                  </div>
                ) : (
                  <p className={styles.assocEmpty}>Nenhum contato vinculado.</p>
                )}

                <input
                  className="input"
                  style={{ marginTop: 8 }}
                  placeholder="Buscar contato..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                />
                <div className={styles.assocList}>
                  {contacts.slice(0, 8).map((c) => (
                    <button
                      key={c.id}
                      className={`${styles.assocItem} ${card?.contact?.id === c.id ? styles.assocItemActive : ''}`}
                      onClick={() => associateMutation.mutate({ contactId: c.id })}
                    >
                      <span>👤 {c.name}</span>
                      {c.phone && <span className={styles.assocMeta}>{c.phone}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle */}
              <div className={styles.assocBlock}>
                <h4 className={styles.assocTitle}>Veículo vinculado</h4>
                {card?.vehicle ? (
                  <div className={styles.assocCard}>
                    <span>🚗 {card.vehicle.brand} {card.vehicle.model} {card.vehicle.year}</span>
                    {card.vehicle.plate && <span className={styles.assocMeta}>{card.vehicle.plate}</span>}
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 11, padding: '2px 8px', marginLeft: 'auto' }}
                      onClick={() => associateMutation.mutate({ vehicleId: null })}
                    >
                      Desvincular
                    </button>
                  </div>
                ) : (
                  <p className={styles.assocEmpty}>Nenhum veículo vinculado.</p>
                )}

                <input
                  className="input"
                  style={{ marginTop: 8 }}
                  placeholder="Buscar veículo..."
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                />
                <div className={styles.assocList}>
                  {vehicles.slice(0, 8).map((v) => (
                    <button
                      key={v.id}
                      className={`${styles.assocItem} ${card?.vehicle?.id === v.id ? styles.assocItemActive : ''}`}
                      onClick={() => associateMutation.mutate({ vehicleId: v.id })}
                    >
                      <span>🚗 {v.brand} {v.model} {v.year}</span>
                      {v.plate && <span className={styles.assocMeta}>{v.plate}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CONTRACT TAB ── */}
          {tab === 'contract' && (
            <div className={styles.contractSection}>
              {contracts.length > 0 && (
                <div className={styles.contractList}>
                  {contracts.map((ct) => (
                    <div key={ct.id} className={styles.contractRow}>
                      <span className={styles.contractNum}>{ct.number}</span>
                      <span className={`badge badge-${ct.status.toLowerCase()}`}>{ct.status}</span>
                      <a
                        href={contractsApi.pdfUrl(ct.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: '2px 10px', marginLeft: 'auto' }}
                      >
                        PDF
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {!card?.contact && !card?.vehicle && (
                <p className={styles.assocEmpty} style={{ marginBottom: 12 }}>
                  Dica: vincule um contato e veículo na aba "Vínculos" antes de gerar o contrato.
                </p>
              )}

              <h4 className={styles.assocTitle} style={{ marginTop: 12 }}>Novo contrato</h4>
              <div className={styles.formGrid} style={{ marginTop: 8 }}>
                <label className={styles.label}>
                  Número
                  <input
                    className="input"
                    placeholder={`CONT-${Date.now()}`}
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                  />
                </label>
                <label className={styles.label}>
                  Tipo
                  <select
                    className="input"
                    value={contractTemplate}
                    onChange={(e) => setContractTemplate(e.target.value)}
                  >
                    <option>Compra e Venda</option>
                    <option>Reserva</option>
                    <option>Consignação</option>
                    <option>Permuta</option>
                  </select>
                </label>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                disabled={createContract.isPending}
                onClick={() => createContract.mutate()}
              >
                {createContract.isPending ? 'Gerando...' : 'Gerar Contrato'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
