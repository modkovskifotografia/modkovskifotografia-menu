'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  MessageCircle, 
  Sparkles, 
  Lock, 
  Unlock, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Search,
  RefreshCw,
  FolderPlus,
  HelpCircle,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  User,
  Camera,
  Video
} from 'lucide-react';
import { 
  Proposal, 
  ProposalCategory, 
  ProposalPackage, 
  STANDARD_TEMPLATES, 
  CATEGORY_LABELS, 
  CATEGORY_DESCRIPTIONS, 
  slugify 
} from '@/lib/propostas';
import { 
  fetchAllProposals, 
  saveProposalAction, 
  deleteProposalAction 
} from '@/lib/propostas-service';
import { brandConfig } from '@/lib/config';
import Logo from '@/components/Logo';

export default function ProposalManager() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('modkovski_admin_auth') === 'true';
    }
    return false;
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState('alessandra');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Change password modal state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  
  // Feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadProposals = () => {
    setLoading(true);
    fetchAllProposals().then((data) => {
      setProposals(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    let active = true;
    if (isUnlocked) {
      fetchAllProposals().then((data) => {
        if (active) {
          setProposals(data);
          setLoading(false);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [isUnlocked]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsUnlocked(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('modkovski_admin_auth', 'true');
          sessionStorage.setItem('modkovski_admin_user', data.username || loginUsername);
        }
      } else {
        setLoginError(data.message || 'Credenciais inválidas. Tente novamente.');
      }
    } catch {
      // Fallback local check
      const u = loginUsername.trim().toLowerCase();
      const p = loginPassword.trim();
      if ((u === 'alessandra' || u === 'admin') && (p === 'alessandra' || p === 'modkovski2026' || p === '1234')) {
        setIsUnlocked(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('modkovski_admin_auth', 'true');
        }
      } else {
        setLoginError('Usuário ou senha incorretos.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('modkovski_admin_auth');
      sessionStorage.removeItem('modkovski_admin_user');
    }
  };

  const renderChangePasswordModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-wine/20 text-left">
        
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-brand-wine/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl text-brand-text font-bold">
              Alterar Senha de Acesso
            </h3>
          </div>
          <button
            onClick={() => {
              setIsChangePasswordOpen(false);
              setChangePasswordError('');
              setChangePasswordSuccess('');
            }}
            className="text-brand-text-soft hover:text-brand-wine text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
              Senha Atual *
            </label>
            <input
              type="password"
              required
              placeholder="Digite a senha atual"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setChangePasswordError('');
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30"
            />
            <p className="text-[10px] text-brand-text-soft mt-1">
              Dica: a senha atual é <span className="font-mono text-brand-wine font-semibold">modkovski2026</span> (ou <span className="font-mono text-brand-wine font-semibold">alessandra</span>)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
              Nova Senha * (mínimo 4 caracteres)
            </label>
            <input
              type="password"
              required
              minLength={4}
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setChangePasswordError('');
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
              Confirmar Nova Senha *
            </label>
            <input
              type="password"
              required
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setChangePasswordError('');
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30"
            />
          </div>

          {changePasswordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{changePasswordError}</span>
            </div>
          )}

          {changePasswordSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
              <span>{changePasswordSuccess}</span>
            </div>
          )}

          <div className="pt-3 border-t border-brand-wine/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(false)}
              className="px-4 py-2 rounded-full border border-brand-wine/20 text-xs font-medium text-brand-text hover:bg-brand-wine/5"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={changePasswordLoading}
              className="px-5 py-2 rounded-full bg-brand-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {changePasswordLoading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setChangePasswordError('A confirmação da nova senha não confere.');
      return;
    }

    if (newPassword.length < 4) {
      setChangePasswordError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    setChangePasswordLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setChangePasswordSuccess('Senha alterada com sucesso!');
        setLoginPassword(newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setChangePasswordSuccess('');
        }, 1800);
      } else {
        setChangePasswordError(data.message || 'Erro ao alterar a senha.');
      }
    } catch {
      setChangePasswordError('Erro ao comunicar com o servidor.');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Duplicate from a standard template
  const handleCreateFromTemplate = (cat: ProposalCategory) => {
    const template = STANDARD_TEMPLATES[cat];
    const newProposal: Proposal = {
      ...template,
      id: `prop-${Date.now()}`,
      clientName: '',
      clientSlug: '',
      createdAt: new Date().toISOString(),
      isTemplate: false,
      packages: JSON.parse(JSON.stringify(template.packages)), // deep clone
      videoPackages: template.videoPackages 
        ? JSON.parse(JSON.stringify(template.videoPackages))
        : (cat === 'individual' && STANDARD_TEMPLATES.individual.videoPackages
            ? JSON.parse(JSON.stringify(STANDARD_TEMPLATES.individual.videoPackages))
            : undefined),
    };
    if (cat === 'individual') {
      newProposal.welcomeMessage = 'Meu objetivo é transformar o nosso ensaio em um momento leve e divertido. Vou te guiar em cada passo para que a timidez vá embora e você se sinta em casa logo no primeiro clique.';
    }
    setEditingProposal(newProposal);
    setIsModalOpen(true);
  };

  // Open edit modal for existing proposal
  const handleEditProposal = (p: Proposal) => {
    const cloned: Proposal = JSON.parse(JSON.stringify(p));
    if (cloned.category === 'individual' && (!cloned.videoPackages || cloned.videoPackages.length === 0)) {
      cloned.videoPackages = JSON.parse(JSON.stringify(STANDARD_TEMPLATES.individual.videoPackages || []));
    }
    setEditingProposal(cloned);
    setIsModalOpen(true);
  };

  // Delete proposal
  const handleDeleteProposal = async (id: string, category: string, clientSlug: string, clientName: string) => {
    const confirmed = window.confirm(
      `Deseja realmente apagar a proposta de "${clientName}"?\n\nApós apagar, o link deixará de existir imediatamente para o cliente.`
    );
    if (confirmed) {
      await deleteProposalAction(id, category, clientSlug);
      setProposals((prev) => prev.filter((p) => p.id !== id && !(p.category === category && p.clientSlug === clientSlug)));
    }
  };

  // Copy full URL to clipboard
  const handleCopyLink = (p: Proposal) => {
    if (typeof window === 'undefined') return;
    const origin = 'https://www.modkovskifotografia.com.br';
    const fullUrl = `${origin}/${p.category}/${p.clientSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Generate WhatsApp sending URL
  const getWhatsAppSendUrl = (p: Proposal) => {
    const origin = 'https://www.modkovskifotografia.com.br';
    const fullUrl = `${origin}/${p.category}/${p.clientSlug}`;
    const text = `Olá ${p.clientName}! Preparei a sua proposta personalizada com muito carinho. Você pode conferir os detalhes e opções de investimento neste link exclusivo:\n\n${fullUrl}\n\nFique à vontade para olhar e tirar qualquer dúvida comigo! ✨`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Save proposal
  const handleSaveProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProposal) return;

    if (!editingProposal.clientName.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    let finalSlug = editingProposal.clientSlug.trim();
    if (!finalSlug) {
      finalSlug = slugify(editingProposal.clientName);
    } else {
      finalSlug = slugify(finalSlug);
    }

    const toSave: Proposal = {
      ...editingProposal,
      clientName: editingProposal.clientName.trim(),
      clientSlug: finalSlug,
    };

    const saved = await saveProposalAction(toSave);

    setProposals((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsModalOpen(false);
    setEditingProposal(null);
  };

  // Filtered list
  const filteredProposals = proposals.filter((p) => {
    const matchesSearch = p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.clientSlug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  // Password / Login Gate
  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-brand-wine/15">
          <div className="w-16 h-16 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-text font-bold mb-1">
            Acesso ao Painel
          </h1>
          <p className="text-xs text-brand-text-soft mb-6">
            Área administrativa restrita da Modkovski Fotografia para gerenciar e criar orçamentos exclusivos.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
                Usuário / Login
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-text-soft absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Seu usuário"
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30 bg-brand-cream/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-text-soft absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Sua senha"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30 bg-brand-cream/20"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-soft hover:text-brand-wine p-1"
                  title={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-full bg-brand-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              {loginLoading ? 'Verificando...' : 'Entrar no Painel'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-brand-wine/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setIsChangePasswordOpen(true);
                setChangePasswordError('');
                setChangePasswordSuccess('');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-brand-wine hover:text-brand-wine-dark font-medium transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Alterar Senha</span>
            </button>
            <Link href="/" className="text-xs text-brand-text-soft hover:text-brand-wine transition-colors">
              ← Página Inicial
            </Link>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[11px] text-brand-text-soft">
              Senha atual do painel: <span className="font-mono font-bold text-brand-wine">modkovski2026</span>
            </span>
          </div>
        </div>

        {/* Modal para alterar senha na tela de login */}
        {isChangePasswordOpen && renderChangePasswordModal()}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-text selection:bg-brand-wine selection:text-white pb-24">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-wine/15 py-3 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo className="w-8 h-8 text-brand-wine" />
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold text-brand-wine leading-none">
                  Modkovski Fotografia
                </span>
                <span className="text-[9px] tracking-widest text-brand-text-soft uppercase">
                  Painel de Propostas Personalizadas
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Botao Alterar Senha */}
            <button
              onClick={() => {
                setIsChangePasswordOpen(true);
                setChangePasswordError('');
                setChangePasswordSuccess('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-wine/25 text-xs text-brand-wine font-medium hover:bg-brand-wine hover:text-white transition-all"
              title="Alterar a senha do painel"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Alterar Senha</span>
              <span className="sm:hidden">Senha</span>
            </button>

            <button
              onClick={loadProposals}
              className="p-2 rounded-lg text-brand-text-soft hover:text-brand-wine hover:bg-brand-cream/70 transition-colors"
              title="Atualizar lista de propostas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-full border border-brand-wine/20 text-xs text-brand-text font-medium hover:bg-brand-wine/5 transition-colors hidden sm:inline-block"
            >
              Ver Site
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-brand-text-soft hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sair do painel administrativo"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Intro Notification Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-wine/10 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-brand-wine font-semibold block mb-1">
                Central de Orçamentos Privados
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-text font-normal mb-2">
                Gerenciador de Propostas Padrões e Personalizadas
              </h1>
              <p className="text-sm text-brand-text-soft max-w-2xl leading-relaxed">
                Aqui você pode copiar qualquer modelo padrão, personalizar com o nome do seu cliente e os valores acordados, gerar o link exclusivo (ex: <span className="font-mono text-xs bg-brand-cream px-1.5 py-0.5 rounded text-brand-wine">/corporativo/nome</span>) e apagar assim que ele visualizar.
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 bg-brand-cream px-4 py-2 rounded-2xl border border-brand-wine/15 text-xs text-brand-wine font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>{proposals.length} propostas ativas</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Standard Templates (Propostas Padrões) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-brand-text font-medium">
                Modelos de Propostas Padrões
              </h2>
              <p className="text-xs text-brand-text-soft">
                Clique em &ldquo;Copiar e Criar Orçamento&rdquo; em qualquer um dos 6 tipos abaixo para iniciar:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(Object.keys(STANDARD_TEMPLATES) as ProposalCategory[]).map((cat) => {
              const tmpl = STANDARD_TEMPLATES[cat];
              return (
                <div
                  key={cat}
                  className="bg-white rounded-2xl p-5 border border-brand-wine/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-brand-wine/10 text-brand-wine">
                        {CATEGORY_LABELS[cat]}
                      </span>
                      <span className="text-[11px] text-brand-text-soft font-mono">
                        /{cat}/[nome]
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-brand-text font-medium mb-1.5 group-hover:text-brand-wine transition-colors">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-brand-text-soft line-clamp-2 mb-4 leading-relaxed">
                      {CATEGORY_DESCRIPTIONS[cat]}
                    </p>

                    <div className="text-[11px] text-brand-text-soft/80 mb-5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
                      <span>
                        {tmpl.videoPackages && tmpl.videoPackages.length > 0
                          ? `${tmpl.packages.length} opções foto + ${tmpl.videoPackages.length} opções vídeo`
                          : `${tmpl.packages.length} pacote(s) configurado(s)`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-wine/10 flex items-center gap-2">
                    <button
                      onClick={() => handleCreateFromTemplate(cat)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-brand-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Copiar e Criar
                    </button>
                    
                    <Link
                      href={`/${cat}/padrao`}
                      target="_blank"
                      className="p-2.5 rounded-xl border border-brand-wine/20 text-brand-text hover:bg-brand-wine/5 transition-colors"
                      title="Pré-visualizar modelo padrão"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Active Proposals List */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-brand-text font-medium">
                Propostas Ativas ({filteredProposals.length})
              </h2>
              <p className="text-xs text-brand-text-soft">
                Propostas criadas para clientes. Copie o link, envie no WhatsApp ou apague quando quiser.
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-brand-text-soft absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-brand-wine/20 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-wine w-44 sm:w-56"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-brand-wine/20 bg-white text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-wine"
              >
                <option value="all">Todas as Categorias</option>
                <option value="individual">Individual</option>
                <option value="casal">Casal</option>
                <option value="corporativo">Corporativo</option>
                <option value="casamento">Casamento</option>
                <option value="evento">Evento</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
          </div>

          {filteredProposals.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-brand-wine/10">
              <FileText className="w-10 h-10 text-brand-wine/30 mx-auto mb-3" />
              <h3 className="font-serif text-lg text-brand-text font-medium mb-1">
                Nenhuma proposta ativa no momento
              </h3>
              <p className="text-xs text-brand-text-soft max-w-md mx-auto mb-5">
                Escolha um dos modelos padrões acima e clique em &ldquo;Copiar e Criar&rdquo; para gerar a primeira proposta para o seu cliente!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProposals.map((p) => {
                const isCopied = copiedId === p.id;
                const formattedDate = new Date(p.createdAt).toLocaleDateString('pt-BR');
                const pathUrl = `/${p.category}/${p.clientSlug}`;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-5 border border-brand-wine/15 shadow-sm hover:border-brand-wine/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-wine text-white">
                          {CATEGORY_LABELS[p.category]}
                        </span>
                        <span className="text-xs font-semibold text-brand-text font-serif">
                          {p.clientName}
                        </span>
                        <span className="text-[11px] text-brand-text-soft font-mono bg-brand-cream/80 px-2 py-0.5 rounded border border-brand-wine/10">
                          {pathUrl}
                        </span>
                        <span className="text-[10px] text-brand-text-soft flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-wine" />
                          Criado em {formattedDate}
                        </span>
                      </div>

                      <p className="text-xs text-brand-text-soft line-clamp-1">
                        {p.title} • {p.packages.map((pkg) => `${pkg.name} (${pkg.price})`).join(' | ')}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {/* Copiar Link */}
                      <button
                        onClick={() => handleCopyLink(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isCopied 
                            ? 'bg-green-100 text-green-800 border border-green-300' 
                            : 'bg-brand-cream border border-brand-wine/20 text-brand-wine hover:bg-brand-wine hover:text-white'
                        }`}
                        title="Copiar link para enviar ao cliente"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copiado!' : 'Copiar Link'}</span>
                      </button>

                      {/* Enviar WhatsApp */}
                      <a
                        href={getWhatsAppSendUrl(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors shadow-sm"
                        title="Enviar proposta pronta pelo WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Visualizar */}
                      <Link
                        href={pathUrl}
                        target="_blank"
                        className="p-1.5 rounded-xl border border-brand-wine/20 text-brand-text hover:bg-brand-wine/5 transition-colors"
                        title="Abrir proposta em nova aba"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      {/* Editar */}
                      <button
                        onClick={() => handleEditProposal(p)}
                        className="p-1.5 rounded-xl border border-brand-wine/20 text-brand-text hover:bg-brand-wine/5 transition-colors"
                        title="Editar detalhes desta proposta"
                      >
                        <Edit3 className="w-4 h-4 text-brand-wine" />
                      </button>

                      {/* Excluir */}
                      <button
                        onClick={() => handleDeleteProposal(p.id, p.category, p.clientSlug, p.clientName)}
                        className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Apagar proposta (não aparecerá mais para o cliente)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* MODAL: Criar / Editar Proposta */}
      {isModalOpen && editingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-wine/20 max-h-[90vh] overflow-y-auto my-8">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-wine/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-wine">
                  {CATEGORY_LABELS[editingProposal.category]}
                </span>
                <h3 className="font-serif text-2xl text-brand-text font-bold">
                  {editingProposal.clientName ? `Proposta para ${editingProposal.clientName}` : 'Criar Nova Proposta'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProposal(null);
                }}
                className="text-brand-text-soft hover:text-brand-wine text-sm font-semibold p-2"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleSaveProposal} className="space-y-6">
              
              {/* Client Name and Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1.5">
                    Nome do Cliente ou Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Camila Santos ou TechCorp"
                    value={editingProposal.clientName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditingProposal((prev) => prev ? {
                        ...prev,
                        clientName: name,
                        clientSlug: slugify(name),
                      } : null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1.5">
                    Link da Proposta (URL)
                  </label>
                  <div className="flex items-center">
                    <span className="text-xs text-brand-text-soft bg-brand-cream/80 px-2.5 py-2.5 rounded-l-xl border border-r-0 border-brand-wine/20 font-mono">
                      /{editingProposal.category}/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="nome-do-cliente"
                      value={editingProposal.clientSlug}
                      onChange={(e) => {
                        const slugVal = slugify(e.target.value);
                        setEditingProposal((prev) => prev ? {
                          ...prev,
                          clientSlug: slugVal,
                        } : null);
                      }}
                      className="w-full px-3 py-2.5 rounded-r-xl border border-brand-wine/20 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1.5">
                    Título Principal da Proposta
                  </label>
                  <input
                    type="text"
                    value={editingProposal.title}
                    onChange={(e) => setEditingProposal((prev) => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1.5">
                    Mensagem de Boas-Vindas Personalizada
                  </label>
                  <textarea
                    rows={3}
                    value={editingProposal.welcomeMessage}
                    onChange={(e) => setEditingProposal((prev) => prev ? { ...prev, welcomeMessage: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine/30 leading-relaxed"
                  />
                </div>
              </div>

              {/* Packages Section: Organized exclusively for Individual Proposal, or generic for others */}
              {editingProposal.category === 'individual' ? (
                <>
                  {/* 1. Opções de Ensaio Fotográfico */}
                  <div className="pt-4 border-t border-brand-wine/10" id="section-modal-foto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-brand-wine" />
                          <h4 className="font-serif text-lg text-brand-text font-semibold">
                            1. Ensaio Fotográfico (Proposta Fotográfica)
                          </h4>
                          <span className="text-[10px] bg-brand-wine/10 text-brand-wine px-2 py-0.5 rounded-full font-bold">
                            {editingProposal.packages.length} opções
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-soft mt-0.5">
                          4 opções de ensaio fotográfico (Essencial, Clássico, Especial e Completo). Você pode editar valores, itens, adicionar mais opções ou excluir.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingProposal((prev) => {
                            if (!prev) return null;
                            const nextNum = prev.packages.length + 1;
                            const newPkg: ProposalPackage = {
                              id: `ind-foto-${Date.now()}`,
                              name: `Ensaio Opção 0${nextNum}`,
                              price: 'R$ 450',
                              paymentMethod: 'Pix',
                              duration: 'Duração de até 01 hora',
                              features: [
                                '20 fotos selecionadas e tratadas',
                                '01 vídeo brinde Making Of',
                                'Galeria online privada para download',
                                'Prazo de entrega em até 15 dias úteis',
                                'Foto extra R$ 20,00'
                              ],
                              highlight: false,
                            };
                            return {
                              ...prev,
                              packages: [...prev.packages, newPkg]
                            };
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-wine/10 text-brand-wine text-xs font-semibold hover:bg-brand-wine hover:text-white transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
                        id="btn-add-foto-option"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Opção de Foto
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editingProposal.packages.map((pkg, pIdx) => (
                        <div
                          key={pkg.id || pIdx}
                          className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-wine/15 space-y-3"
                          id={`modal-foto-pkg-${pIdx}`}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-brand-wine text-white">
                                Opção 0{pIdx + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                              <input
                                type="text"
                                value={pkg.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const pkgs = [...prev.packages];
                                    pkgs[pIdx].name = val;
                                    return { ...prev, packages: pkgs };
                                  });
                                }}
                                className="font-serif font-bold text-base text-brand-text bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 flex-1"
                                placeholder="Nome do Ensaio"
                              />

                              <input
                                type="text"
                                value={pkg.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const pkgs = [...prev.packages];
                                    pkgs[pIdx].price = val;
                                    return { ...prev, packages: pkgs };
                                  });
                                }}
                                className="font-bold text-brand-wine text-sm bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 w-32"
                                placeholder="Preço (Ex: R$ 350)"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  return {
                                    ...prev,
                                    packages: prev.packages.filter((_, i) => i !== pIdx)
                                  };
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir opção de foto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                                Duração / Horas
                              </label>
                              <input
                                type="text"
                                value={pkg.duration}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const pkgs = [...prev.packages];
                                    pkgs[pIdx].duration = val;
                                    return { ...prev, packages: pkgs };
                                  });
                                }}
                                className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                                placeholder="Ex: Duração de até 01 hora"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                                Forma de Pagamento
                              </label>
                              <input
                                type="text"
                                value={pkg.paymentMethod}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const pkgs = [...prev.packages];
                                    pkgs[pIdx].paymentMethod = val;
                                    return { ...prev, packages: pkgs };
                                  });
                                }}
                                className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                                placeholder="Ex: Pix ou Cartão em até 12x"
                              />
                            </div>
                          </div>

                          {/* Features list */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                              Itens Inclusos (um por linha)
                            </label>
                            <textarea
                              rows={3}
                              value={pkg.features.join('\n')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n');
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const pkgs = [...prev.packages];
                                  pkgs[pIdx].features = lines;
                                  return { ...prev, packages: pkgs };
                                });
                              }}
                              className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-brand-wine/20 font-sans leading-relaxed"
                              placeholder="Digite um item por linha"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs text-brand-text cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pkg.highlight || false}
                                onChange={(e) => {
                                  const isHigh = e.target.checked;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const pkgs = [...prev.packages];
                                    pkgs[pIdx].highlight = isHigh;
                                    return { ...prev, packages: pkgs };
                                  });
                                }}
                                className="rounded text-brand-wine focus:ring-brand-wine"
                              />
                              <span>Destacar como &ldquo;Mais Escolhido / Recomendado&rdquo;</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Opções de Produção de Vídeo */}
                  <div className="pt-6 border-t border-brand-wine/10" id="section-modal-video">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-brand-wine" />
                          <h4 className="font-serif text-lg text-brand-text font-semibold">
                            2. Produção de Vídeo (Proposta de Vídeos)
                          </h4>
                          <span className="text-[10px] bg-brand-wine text-white px-2 py-0.5 rounded-full font-bold">
                            {(editingProposal.videoPackages || []).length} opções
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-soft mt-0.5">
                          4 formatos de produção de vídeo (Prático, Essencial, Presença e Autoridade). Você pode editar valores, itens, adicionar mais opções ou excluir.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingProposal((prev) => {
                            if (!prev) return null;
                            const currentVideos = prev.videoPackages || [];
                            const nextNum = currentVideos.length + 1;
                            const newVideo: ProposalPackage = {
                              id: `ind-video-${Date.now()}`,
                              name: `Formato de Vídeo 0${nextNum}`,
                              price: 'R$ 350',
                              paymentMethod: 'Pix',
                              duration: '02 vídeos até 1:30seg',
                              features: [
                                '02 vídeos até 1:30seg',
                                '02 capas pra vídeo',
                                'Roteirização, direção e posicionamento',
                                'Edição dinâmica, cortes essenciais, legenda e trilha sonora'
                              ],
                              highlight: false,
                            };
                            return {
                              ...prev,
                              videoPackages: [...currentVideos, newVideo]
                            };
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wine-dark transition-colors self-start sm:self-auto shrink-0 cursor-pointer shadow-xs"
                        id="btn-add-video-option"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Opção de Vídeo
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(editingProposal.videoPackages || []).map((vPkg, vIdx) => (
                        <div
                          key={vPkg.id || vIdx}
                          className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-wine/15 space-y-3"
                          id={`modal-video-pkg-${vIdx}`}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-brand-wine text-white">
                                Opção de Vídeo 0{vIdx + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                              <input
                                type="text"
                                value={vPkg.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const vPkgs = [...(prev.videoPackages || [])];
                                    vPkgs[vIdx].name = val;
                                    return { ...prev, videoPackages: vPkgs };
                                  });
                                }}
                                className="font-serif font-bold text-base text-brand-text bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 flex-1"
                                placeholder="Nome do Formato de Vídeo"
                              />

                              <input
                                type="text"
                                value={vPkg.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const vPkgs = [...(prev.videoPackages || [])];
                                    vPkgs[vIdx].price = val;
                                    return { ...prev, videoPackages: vPkgs };
                                  });
                                }}
                                className="font-bold text-brand-wine text-sm bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 w-32"
                                placeholder="Preço (Ex: R$ 560)"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const vPkgs = prev.videoPackages || [];
                                  return {
                                    ...prev,
                                    videoPackages: vPkgs.filter((_, i) => i !== vIdx)
                                  };
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir opção de vídeo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                                Formato / Quantidade de Vídeos
                              </label>
                              <input
                                type="text"
                                value={vPkg.duration}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const vPkgs = [...(prev.videoPackages || [])];
                                    vPkgs[vIdx].duration = val;
                                    return { ...prev, videoPackages: vPkgs };
                                  });
                                }}
                                className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                                placeholder="Ex: 02 vídeos até 1:30seg"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                                Forma de Pagamento
                              </label>
                              <input
                                type="text"
                                value={vPkg.paymentMethod}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const vPkgs = [...(prev.videoPackages || [])];
                                    vPkgs[vIdx].paymentMethod = val;
                                    return { ...prev, videoPackages: vPkgs };
                                  });
                                }}
                                className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                                placeholder="Ex: Pix ou Cartão em até 12x"
                              />
                            </div>
                          </div>

                          {/* Features list */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                              Itens Inclusos (um por linha)
                            </label>
                            <textarea
                              rows={3}
                              value={vPkg.features.join('\n')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n');
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const vPkgs = [...(prev.videoPackages || [])];
                                  vPkgs[vIdx].features = lines;
                                  return { ...prev, videoPackages: vPkgs };
                                });
                              }}
                              className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-brand-wine/20 font-sans leading-relaxed"
                              placeholder="Digite um item por linha"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs text-brand-text cursor-pointer">
                              <input
                                type="checkbox"
                                checked={vPkg.highlight || false}
                                onChange={(e) => {
                                  const isHigh = e.target.checked;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const vPkgs = [...(prev.videoPackages || [])];
                                    vPkgs[vIdx].highlight = isHigh;
                                    return { ...prev, videoPackages: vPkgs };
                                  });
                                }}
                                className="rounded text-brand-wine focus:ring-brand-wine"
                              />
                              <span>Destacar como &ldquo;Mais Escolhido / Recomendado&rdquo;</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Packages Section for other categories */
                <div className="pt-4 border-t border-brand-wine/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-serif text-lg text-brand-text font-semibold">
                        Pacotes de Investimento
                      </h4>
                      <p className="text-xs text-brand-text-soft">
                        Ajuste os valores, condições e itens que serão exibidos nesta proposta.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newPkg: ProposalPackage = {
                          id: `pkg-${Date.now()}`,
                          name: 'Novo Pacote',
                          price: 'R$ 400',
                          paymentMethod: 'Pix ou Cartão',
                          duration: 'Até 1h de sessão',
                          features: ['15 fotos tratadas em alta resolução', 'Galeria online privada'],
                        };
                        setEditingProposal((prev) => prev ? {
                          ...prev,
                          packages: [...prev.packages, newPkg]
                        } : null);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-brand-wine font-semibold hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Pacote
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingProposal.packages.map((pkg, pIdx) => (
                      <div
                        key={pkg.id || pIdx}
                        className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-wine/15 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="text"
                              value={pkg.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const pkgs = [...prev.packages];
                                  pkgs[pIdx].name = val;
                                  return { ...prev, packages: pkgs };
                                });
                              }}
                              className="font-serif font-bold text-base text-brand-text bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 flex-1"
                              placeholder="Nome do Pacote"
                            />

                            <input
                              type="text"
                              value={pkg.price}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const pkgs = [...prev.packages];
                                  pkgs[pIdx].price = val;
                                  return { ...prev, packages: pkgs };
                                });
                              }}
                              className="font-bold text-brand-wine text-sm bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 w-32"
                              placeholder="Preço (Ex: R$ 350)"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingProposal((prev) => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  packages: prev.packages.filter((_, i) => i !== pIdx)
                                };
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer"
                            title="Remover pacote"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                              Duração / Horas
                            </label>
                            <input
                              type="text"
                              value={pkg.duration}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const pkgs = [...prev.packages];
                                  pkgs[pIdx].duration = val;
                                  return { ...prev, packages: pkgs };
                                });
                              }}
                              className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                              placeholder="Ex: Até 01h30 de ensaio"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                              Forma de Pagamento
                            </label>
                            <input
                              type="text"
                              value={pkg.paymentMethod}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const pkgs = [...prev.packages];
                                  pkgs[pIdx].paymentMethod = val;
                                  return { ...prev, packages: pkgs };
                                });
                              }}
                              className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                              placeholder="Ex: Pix à vista ou Cartão"
                            />
                          </div>
                        </div>

                        {/* Features list */}
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                            Itens Inclusos (um por linha)
                          </label>
                          <textarea
                            rows={3}
                            value={pkg.features.join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n');
                              setEditingProposal((prev) => {
                                if (!prev) return null;
                                const pkgs = [...prev.packages];
                                pkgs[pIdx].features = lines;
                                return { ...prev, packages: pkgs };
                              });
                            }}
                            className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-brand-wine/20 font-sans leading-relaxed"
                            placeholder="Digite um item por linha"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-xs text-brand-text cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pkg.highlight || false}
                              onChange={(e) => {
                                const isHigh = e.target.checked;
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const pkgs = [...prev.packages];
                                  pkgs[pIdx].highlight = isHigh;
                                  return { ...prev, packages: pkgs };
                                });
                              }}
                              className="rounded text-brand-wine focus:ring-brand-wine"
                            />
                            <span>Destacar como &ldquo;Mais Escolhido / Recomendado&rdquo;</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commercial Conditions Note */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1.5">
                  Condições de Pagamento e Reserva
                </label>
                <textarea
                  rows={2}
                  value={editingProposal.investmentNote}
                  onChange={(e) => setEditingProposal((prev) => prev ? { ...prev, investmentNote: e.target.value } : null)}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-wine/30"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-brand-wine/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProposal(null);
                  }}
                  className="px-5 py-2.5 rounded-full border border-brand-wine/20 text-xs font-medium text-brand-text hover:bg-brand-wine/5"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Salvar e Ativar Proposta
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: Alterar Senha */}
      {isChangePasswordOpen && renderChangePasswordModal()}

    </div>
  );
}
