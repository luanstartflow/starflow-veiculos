import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsApi } from '@/services/api';
import styles from './ListPage.module.css';

interface Contract {
  id: string;
  number: string;
  template: string;
  status: 'DRAFT' | 'SENT' | 'SIGNED' | 'CANCELLED';
  createdAt: string;
  signedAt?: string;
  card: {
    title: string;
    contact?: { name: string } | null;
    vehicle?: { brand: string; model: string } | null;
  };
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'badge-draft',
  SENT: 'badge-sent',
  SIGNED: 'badge-signed',
  CANCELLED: 'badge-draft',
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho',
  SENT: 'Enviado',
  SIGNED: 'Assinado',
  CANCELLED: 'Cancelado',
};

export default function ContractsPage() {
  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      contractsApi.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts'] }),
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📄 Contratos</h1>
      </div>

      {isLoading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : contracts.length === 0 ? (
        <p className={styles.empty}>Nenhum contrato gerado ainda. Os contratos são criados a partir de um card no Kanban.</p>
      ) : (
        <div className={styles.table}>
          <div
            className={styles.tableHead}
            style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto' }}
          >
            <span>Nº</span>
            <span>Negociação</span>
            <span>Contato</span>
            <span>Veículo</span>
            <span>Status</span>
            <span />
          </div>
          {contracts.map((c) => (
            <div
              key={c.id}
              className={styles.tableRow}
              style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto' }}
            >
              <span className={styles.name}>{c.number}</span>
              <span className="truncate">{c.card.title}</span>
              <span>{c.card.contact?.name ?? '—'}</span>
              <span>{c.card.vehicle ? `${c.card.vehicle.brand} ${c.card.vehicle.model}` : '—'}</span>
              <span>
                <span className={`badge ${STATUS_BADGE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {c.status === 'DRAFT' && (
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, padding: '3px 8px' }}
                    onClick={() => updateMutation.mutate({ id: c.id, status: 'SENT' })}
                  >
                    Enviar
                  </button>
                )}
                {c.status === 'SENT' && (
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, padding: '3px 8px', color: 'var(--color-success)' }}
                    onClick={() => updateMutation.mutate({ id: c.id, status: 'SIGNED' })}
                  >
                    Assinar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
