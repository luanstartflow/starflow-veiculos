import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '@/services/api';
import styles from './ListPage.module.css';

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  document?: string;
  notes?: string;
}

export default function ContactsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', document: '' });

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['contacts', search],
    queryFn: () => contactsApi.list(search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: () => contactsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setForm({ name: '', phone: '', email: '', document: '' });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>👥 Contatos</h1>
        <div className={styles.actions}>
          <input
            className="input"
            style={{ width: 240 }}
            placeholder="Buscar por nome, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Novo Contato
          </button>
        </div>
      </div>

      {showForm && (
        <div className={`card-surface ${styles.formCard}`}>
          <h3 className={styles.formTitle}>Novo Contato</h3>
          <div className={styles.formGrid}>
            {[
              { name: 'name', label: 'Nome *', placeholder: 'João Silva' },
              { name: 'phone', label: 'Telefone', placeholder: '(11) 99999-9999' },
              { name: 'email', label: 'E-mail', placeholder: 'joao@email.com' },
              { name: 'document', label: 'CPF / CNPJ', placeholder: '000.000.000-00' },
            ].map(({ name, label, placeholder }) => (
              <label key={name} className={styles.label}>
                {label}
                <input
                  className="input"
                  placeholder={placeholder}
                  value={(form as Record<string, string>)[name]}
                  onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                />
              </label>
            ))}
          </div>
          <div className={styles.formActions}>
            <button className="btn btn-primary" onClick={() => createMutation.mutate()} disabled={!form.name}>
              Salvar
            </button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : contacts.length === 0 ? (
        <p className={styles.empty}>Nenhum contato encontrado.</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Nome</span><span>Telefone</span><span>E-mail</span><span>CPF/CNPJ</span><span />
          </div>
          {contacts.map((c) => (
            <div key={c.id} className={styles.tableRow}>
              <span className={styles.name}>{c.name}</span>
              <span>{c.phone ?? '—'}</span>
              <span className="truncate">{c.email ?? '—'}</span>
              <span>{c.document ?? '—'}</span>
              <button
                className="btn btn-ghost"
                style={{ padding: '4px 8px', fontSize: 12 }}
                onClick={() => { if (confirm('Remover contato?')) deleteMutation.mutate(c.id); }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
