import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/services/api';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [tenantSlug, setTenantSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill from URL params (e.g. when opened from Chatwoot with context)
  const params = new URLSearchParams(window.location.search);
  const defaultSlug = params.get('tenant') ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(tenantSlug || defaultSlug, email, password);
      setAuth(data.accessToken, {
        userId: data.userId,
        email: data.email,
        tenantId: data.tenantId,
        role: data.role,
      }, tenantSlug || defaultSlug);
      navigate('/');
    } catch {
      setError('Credenciais inválidas ou tenant não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>🚗 GlobalVeículos</h1>
        <p className={styles.subtitle}>Painel de Gestão Automotiva</p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>
          Empresa (slug)
          <input
            className="input"
            value={tenantSlug || defaultSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            placeholder="minha-concessionaria"
            required
          />
        </label>

        <label className={styles.label}>
          E-mail
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@empresa.com"
            required
          />
        </label>

        <label className={styles.label}>
          Senha
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className={styles.link}>
          Novo por aqui? <Link to="/register">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}
