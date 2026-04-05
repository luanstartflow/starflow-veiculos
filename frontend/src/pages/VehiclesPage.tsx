import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '@/services/api';
import styles from './ListPage.module.css';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate?: string;
  color?: string;
  mileage?: number;
  price?: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
}

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Disponível',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
};

export default function VehiclesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    brand: '', model: '', year: new Date().getFullYear().toString(),
    plate: '', color: '', price: '', mileage: '',
  });

  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles', statusFilter, search],
    queryFn: () => vehiclesApi.list(statusFilter || undefined, search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      vehiclesApi.create({
        ...form,
        year: parseInt(form.year),
        price: form.price ? parseFloat(form.price) : undefined,
        mileage: form.mileage ? parseInt(form.mileage) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowForm(false);
      setForm({ brand: '', model: '', year: new Date().getFullYear().toString(), plate: '', color: '', price: '', mileage: '' });
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      vehiclesApi.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>🚗 Veículos</h1>
        <div className={styles.actions}>
          <select
            className="input"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="AVAILABLE">Disponível</option>
            <option value="RESERVED">Reservado</option>
            <option value="SOLD">Vendido</option>
          </select>
          <input
            className="input"
            style={{ width: 200 }}
            placeholder="Buscar marca/modelo/placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Novo Veículo
          </button>
        </div>
      </div>

      {showForm && (
        <div className={`card-surface ${styles.formCard}`}>
          <h3 className={styles.formTitle}>Novo Veículo</h3>
          <div className={styles.formGrid}>
            {[
              { name: 'brand', label: 'Marca *' },
              { name: 'model', label: 'Modelo *' },
              { name: 'year', label: 'Ano *' },
              { name: 'plate', label: 'Placa' },
              { name: 'color', label: 'Cor' },
              { name: 'mileage', label: 'Km' },
              { name: 'price', label: 'Preço (R$)' },
            ].map(({ name, label }) => (
              <label key={name} className={styles.label}>
                {label}
                <input
                  className="input"
                  value={(form as Record<string, string>)[name]}
                  onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                  type={['year', 'mileage', 'price'].includes(name) ? 'number' : 'text'}
                />
              </label>
            ))}
          </div>
          <div className={styles.formActions}>
            <button
              className="btn btn-primary"
              onClick={() => createMutation.mutate()}
              disabled={!form.brand || !form.model}
            >
              Salvar
            </button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : vehicles.length === 0 ? (
        <p className={styles.empty}>Nenhum veículo encontrado.</p>
      ) : (
        <div className={styles.vehicleGrid}>
          {vehicles.map((v) => (
            <div key={v.id} className={`card-surface ${styles.vehicleCard}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p className={styles.vehicleTitle}>{v.brand} {v.model}</p>
                <span className={`badge badge-${v.status.toLowerCase()}`}>{STATUS_LABEL[v.status]}</span>
              </div>
              <p className={styles.vehicleMeta}>
                {v.year}{v.color ? ` · ${v.color}` : ''}{v.plate ? ` · ${v.plate}` : ''}
                {v.mileage != null ? ` · ${v.mileage.toLocaleString()} km` : ''}
              </p>
              {v.price != null && (
                <p className={styles.vehiclePrice}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v.price)}
                </p>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {v.status !== 'SOLD' && (
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, padding: '3px 8px' }}
                    onClick={() =>
                      updateStatus.mutate({
                        id: v.id,
                        status: v.status === 'AVAILABLE' ? 'RESERVED' : 'AVAILABLE',
                      })
                    }
                  >
                    {v.status === 'AVAILABLE' ? 'Reservar' : 'Liberar'}
                  </button>
                )}
                {v.status !== 'SOLD' && (
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, padding: '3px 8px', color: 'var(--color-success)' }}
                    onClick={() => updateStatus.mutate({ id: v.id, status: 'SOLD' })}
                  >
                    Marcar Vendido
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
