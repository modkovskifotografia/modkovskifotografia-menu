'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/painel/propostas';
  const isExpiredNotice = searchParams.get('expired') === 'true' || searchParams.get('session_expired') === 'true';

  const [username, setUsername] = useState('alessandra');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStoredSession, setCheckingStoredSession] = useState(true);
  const [error, setError] = useState(isExpiredNotice ? 'Sua sessão anterior expirou. Por favor, autentique-se novamente.' : '');

  useEffect(() => {
    // If arriving with expired notification, clear any stale tokens and show form
    if (isExpiredNotice) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('modkovski_admin_token');
        localStorage.removeItem('modkovski_admin_auth');
        sessionStorage.removeItem('modkovski_admin_auth');
        document.cookie = 'modkovski_admin_session=; path=/; max-age=0; SameSite=None; Secure';
        document.cookie = 'modkovski_admin_session_lax=; path=/; max-age=0; SameSite=Lax';
      }
      const t = setTimeout(() => setCheckingStoredSession(false), 0);
      return () => clearTimeout(t);
    }

    // Verify if browser already has an active, valid token stored
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('modkovski_admin_token');
      if (storedToken && storedToken.startsWith('modkovski_session_')) {
        // Validate token with server
        fetch(`/api/admin/auth?token=${encodeURIComponent(storedToken)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.authenticated) {
              // Session is still valid: re-affirm cookies and redirect seamlessly
              document.cookie = `modkovski_admin_session=${storedToken}; path=/; max-age=2592000; SameSite=None; Secure`;
              document.cookie = `modkovski_admin_session_lax=${storedToken}; path=/; max-age=2592000; SameSite=Lax`;
              
              const separator = redirectPath.includes('?') ? '&' : '?';
              window.location.href = `${redirectPath}${separator}auth=${storedToken}`;
            } else {
              // Token has expired or is invalid
              localStorage.removeItem('modkovski_admin_token');
              localStorage.removeItem('modkovski_admin_auth');
              sessionStorage.removeItem('modkovski_admin_auth');
              setCheckingStoredSession(false);
            }
          })
          .catch(() => {
            setCheckingStoredSession(false);
          });
      } else {
        const t = setTimeout(() => setCheckingStoredSession(false), 0);
        return () => clearTimeout(t);
      }
    } else {
      const t = setTimeout(() => setCheckingStoredSession(false), 0);
      return () => clearTimeout(t);
    }
  }, [redirectPath, isExpiredNotice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('modkovski_admin_auth', 'true');
          localStorage.setItem('modkovski_admin_auth', 'true');
          if (data.token) {
            localStorage.setItem('modkovski_admin_token', data.token);
            // Write persistent cookies for both iframe and top-level environments
            document.cookie = `modkovski_admin_session=${data.token}; path=/; max-age=2592000; SameSite=None; Secure`;
            document.cookie = `modkovski_admin_session_lax=${data.token}; path=/; max-age=2592000; SameSite=Lax`;
          }
        }
        
        // Pass token in URL to guarantee middleware session handshake on first load
        const separator = redirectPath.includes('?') ? '&' : '?';
        const target = data.token ? `${redirectPath}${separator}auth=${data.token}` : redirectPath;
        window.location.href = target;
      } else {
        setError(data.message || 'Usuário ou senha incorretos. Apenas a Alessandra possui acesso.');
      }
    } catch {
      setError('Erro de conexão ao tentar autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // If verifying existing stored session, show a sleek brand loading state
  if (checkingStoredSession) {
    return (
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-brand-wine/15 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-wine via-brand-wine-dark to-brand-wine" />
        <div className="w-16 h-16 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center mx-auto mb-4 border border-brand-wine/20 shadow-xs">
          <Logo className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-bold text-brand-text mb-2">Restaurando sua sessão</h2>
        <p className="text-xs text-brand-text-soft mb-6">Identificando autenticação salva no seu computador...</p>
        <div className="flex items-center justify-center gap-2 text-brand-wine text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Acessando painel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-brand-wine/15 text-center relative overflow-hidden">
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-wine via-brand-wine-dark to-brand-wine" />

      {/* Logo & Brand Header */}
      <div className="w-16 h-16 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center mx-auto mb-4 border border-brand-wine/20 shadow-xs">
        <Logo className="w-8 h-8" />
      </div>

      <span className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.25em] block mb-1">
        Área Administrativa Restrita
      </span>
      <h1 className="font-serif text-2xl sm:text-3xl text-brand-text font-bold mb-2">
        Acesso da Alessandra
      </h1>
      <p className="text-xs text-brand-text-soft mb-6 leading-relaxed">
        Entre com suas credenciais para gerenciar propostas, depoimentos, parceiros e contratos.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
            Usuário
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-brand-wine/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine bg-brand-cream/30"
              placeholder="alessandra"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
            Senha de Acesso
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-brand-wine/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine bg-brand-cream/30"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-soft hover:text-brand-wine p-1 cursor-pointer"
              title={showPassword ? 'Ocultar senha' : 'Ver senha'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-wine text-white font-semibold text-xs tracking-wider uppercase hover:bg-brand-wine-dark transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <span>Verificando...</span>
          ) : (
            <>
              <span>Entrar no Painel</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Bottom links */}
      <div className="mt-6 pt-4 border-t border-brand-wine/10 flex items-center justify-between text-xs text-brand-text-soft">
        <div className="flex items-center gap-1.5 text-[11px] text-brand-wine font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sessão contínua ativa</span>
        </div>
        <Link href="/" className="hover:text-brand-wine transition-colors">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}

export default function PainelLoginPage() {
  return (
    <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-brand-wine selection:text-white">
      <Suspense fallback={<div className="text-xs text-brand-text-soft">Carregando painel...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
