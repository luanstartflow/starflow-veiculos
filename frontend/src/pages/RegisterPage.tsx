import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/services/api';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({
    tenantName: '',
    tenantSlug: '',
    email: '',
    name: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'tenantName'
        ? { tenantSlug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register(form);
      setAuth(data.accessToken, {
        userId: data.userId,
        email: data.email,
        tenantId: data.tenantId,
        role: data.role,
      }, form.tenantSlug);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>🚗 GlobalVeículos</h1>
        <p className={styles.subtitle}>Criar nova conta</p>

        {error && <p className={styles.error}>{error}</p>}

        {(['tenantName', 'tenantSlug', 'name', 'email', 'password'] as const).map((field) => (
          <label key={field} className={styles.label}>
            {{ tenantName: 'Nome da empresa', tenantSlug: 'Slug da empresa', name: 'Seu nome', email: 'E-mail', password: 'Senha' }[field]}
            <input
              className="input"
              name={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={handleChange}
              required
              minLength={field === 'password' ? 8 : undefined}
            />
          </label>
        ))}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>

        <p className={styles.link}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
