'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  Calendar,
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
  Video,
  Download,
  FileSpreadsheet,
  X,
  Filter
} from 'lucide-react';
import { 
  Proposal, 
  ProposalCategory, 
  ProposalPackage, 
  ProposalStatus,
  STANDARD_TEMPLATES, 
  CATEGORY_LABELS, 
  CATEGORY_DESCRIPTIONS, 
  STATUS_LABELS,
  slugify 
} from '@/lib/propostas';
import { 
  fetchAllProposals, 
  saveProposalAction, 
  deleteProposalAction,
  updateProposalStatusAction
} from '@/lib/propostas-service';
import { brandConfig } from '@/lib/config';
import Logo from '@/components/Logo';
import PanelNavigation from '@/components/panel/PanelNavigation';

export default function ProposalManager() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

  // Delete modal confirmation state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    id: string;
    category: string;
    clientSlug: string;
    clientName: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Feedback and Filter states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name' | 'status'>('recent');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadProposals = () => {
    setLoading(true);
    fetchAllProposals().then((data) => {
      setProposals(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      loadProposals();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
      proposalDate: new Date().toLocaleDateString('pt-BR'),
      isTemplate: false,
      status: 'nova',
      hidePhotoSection: false,
      hideVideoSection: false,
      hideConteudoSection: false,
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
    if (cat === 'casamento') {
      newProposal.title = template.title;
      newProposal.subtitle = template.subtitle;
      newProposal.welcomeMessage = template.welcomeMessage;
      newProposal.investmentNote = template.investmentNote;
      newProposal.validityDays = template.validityDays || 10;
      newProposal.packages = JSON.parse(JSON.stringify(template.packages));
      newProposal.videoPackages = [];
    }
    if (cat === 'personalizado') {
      newProposal.title = template.title;
      newProposal.subtitle = template.subtitle;
      newProposal.welcomeMessage = template.welcomeMessage;
      newProposal.investmentNote = template.investmentNote;
      newProposal.validityDays = template.validityDays || 10;
      newProposal.packages = JSON.parse(JSON.stringify(template.packages));
      newProposal.videoPackages = template.videoPackages ? JSON.parse(JSON.stringify(template.videoPackages)) : [];
    }
    if (cat === 'corporativo') {
      newProposal.title = template.title;
      newProposal.subtitle = template.subtitle;
      newProposal.welcomeMessage = template.welcomeMessage;
      newProposal.investmentNote = template.investmentNote;
      newProposal.validityDays = template.validityDays || 10;
      newProposal.beforeImage = template.beforeImage || '/images/corporativoantes.jpeg';
      newProposal.afterImage = template.afterImage || '/images/corporativodepois.jpeg';
      newProposal.packages = JSON.parse(JSON.stringify(template.packages));
      newProposal.videoPackages = template.videoPackages ? JSON.parse(JSON.stringify(template.videoPackages)) : [];
      newProposal.conteudoPackages = template.conteudoPackages ? JSON.parse(JSON.stringify(template.conteudoPackages)) : [];
    }
    setEditingProposal(newProposal);
    setIsModalOpen(true);
  };

  // Open edit modal for existing proposal
  const handleEditProposal = (p: Proposal) => {
    const cloned: Proposal = JSON.parse(JSON.stringify(p));
    const tmpl = STANDARD_TEMPLATES[cloned.category];
    if (!cloned.beforeImage && tmpl?.beforeImage) cloned.beforeImage = tmpl.beforeImage;
    if (!cloned.afterImage && tmpl?.afterImage) cloned.afterImage = tmpl.afterImage;
    if (cloned.hidePhotoSection === undefined) cloned.hidePhotoSection = false;
    if (cloned.hideVideoSection === undefined) cloned.hideVideoSection = false;
    if (cloned.hideConteudoSection === undefined) cloned.hideConteudoSection = false;
    if (!cloned.proposalDate) {
      cloned.proposalDate = cloned.createdAt 
        ? new Date(cloned.createdAt).toLocaleDateString('pt-BR') 
        : new Date().toLocaleDateString('pt-BR');
    }

    if (cloned.category === 'individual') {
      if (!cloned.packages || cloned.packages.length === 0) {
        cloned.packages = JSON.parse(JSON.stringify(STANDARD_TEMPLATES.individual.packages || []));
      }
      if (!cloned.videoPackages || cloned.videoPackages.length === 0) {
        cloned.videoPackages = JSON.parse(JSON.stringify(STANDARD_TEMPLATES.individual.videoPackages || []));
      }
    }
    if (cloned.category === 'corporativo') {
      if (!cloned.packages || cloned.packages.length === 0) {
        cloned.packages = JSON.parse(JSON.stringify(STANDARD_TEMPLATES.corporativo.packages || []));
      }
      if (!cloned.videoPackages || cloned.videoPackages.length === 0) {
        cloned.videoPackages = JSON.parse(JSON.stringify(STANDARD_TEMPLATES.corporativo.videoPackages || []));
      }
      if (!cloned.conteudoPackages || cloned.conteudoPackages.length === 0) {
        cloned.conteudoPackages = JSON.parse(JSON.stringify(STANDARD_TEMPLATES.corporativo.conteudoPackages || []));
      }
    }
    if (!cloned.status) cloned.status = 'nova';
    setEditingProposal(cloned);
    setIsModalOpen(true);
  };

  // Delete proposal handlers (Modal confirmation instead of window.confirm for reliable execution in all environments)
  const openDeleteModal = (id: string, category: string, clientSlug: string, clientName: string) => {
    setDeleteConfirmTarget({ id, category, clientSlug, clientName });
  };

  const confirmDeleteProposal = async () => {
    if (!deleteConfirmTarget) return;
    setDeleteLoading(true);
    const { id, category, clientSlug } = deleteConfirmTarget;
    try {
      await deleteProposalAction(id, category, clientSlug);
      setProposals((prev) => prev.filter((p) => p.id !== id && !(p.category === category && p.clientSlug === clientSlug)));
      loadProposals();
    } catch (err) {
      console.error('Erro ao excluir proposta:', err);
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmTarget(null);
    }
  };

  // Update proposal status (Nova, Visualizada, Assinada, Pendente, Desistiu)
  const handleUpdateStatus = async (p: Proposal, newStatus: ProposalStatus) => {
    const updated = await updateProposalStatusAction(p, newStatus);
    setProposals((prev) =>
      prev.map((item) => (item.id === p.id || (item.category === p.category && item.clientSlug === p.clientSlug) ? updated : item))
    );
  };

  // Copy full URL to clipboard
  const handleCopyLink = (p: Proposal) => {
    if (typeof window === 'undefined') return;
    const origin = 'https://www.modkovskifotografia.com.br';
    const fullUrl = `${origin}/propostas/${p.category}/${p.clientSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Generate WhatsApp sending URL
  const getWhatsAppSendUrl = (p: Proposal) => {
    const origin = 'https://www.modkovskifotografia.com.br';
    const fullUrl = `${origin}/propostas/${p.category}/${p.clientSlug}`;
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

  // Status counts for filters and statistics
  const statusCounts = {
    all: proposals.filter((p) => !p.isTemplate).length,
    nova: proposals.filter((p) => !p.isTemplate && (p.status === 'nova' || !p.status)).length,
    visualizada: proposals.filter((p) => !p.isTemplate && p.status === 'visualizada').length,
    assinada: proposals.filter((p) => !p.isTemplate && (p.status === 'assinada' || p.status === 'fechado')).length,
    pendente: proposals.filter((p) => !p.isTemplate && p.status === 'pendente').length,
    desistiu: proposals.filter((p) => !p.isTemplate && p.status === 'desistiu').length,
  };

  // Filtered and sorted list
  const filteredProposals = proposals
    .filter((p) => {
      if (p.isTemplate) return false;

      // Status check
      const currentStatus = p.status || 'nova';
      let matchesStatus = true;
      if (filterStatus !== 'all') {
        if (filterStatus === 'assinada') {
          matchesStatus = currentStatus === 'assinada' || currentStatus === 'fechado';
        } else if (filterStatus === 'nova') {
          matchesStatus = currentStatus === 'nova' || !p.status;
        } else {
          matchesStatus = currentStatus === filterStatus;
        }
      }

      // Category check
      const matchesCat = filterCategory === 'all' || p.category === filterCategory;

      // Search query check (Client name, slug, title, packages, or ID)
      const q = searchQuery.toLowerCase().trim();
      const packagesNames = (p.packages || []).map((pkg) => pkg.name).join(' ').toLowerCase();
      const matchesSearch =
        !q ||
        p.clientName.toLowerCase().includes(q) ||
        p.clientSlug.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        packagesNames.includes(q) ||
        (p.id && p.id.toLowerCase().includes(q));

      return matchesStatus && matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.clientName.localeCompare(b.clientName);
      }
      if (sortBy === 'status') {
        const sA = a.status || 'nova';
        const sB = b.status || 'nova';
        return sA.localeCompare(sB);
      }
      return 0;
    });

  // Export proposals to CSV file
  const exportToCSV = () => {
    const listToExport = filteredProposals.length > 0 ? filteredProposals : proposals.filter((p) => !p.isTemplate);
    if (listToExport.length === 0) {
      alert('Não há propostas disponíveis para exportar no momento.');
      return;
    }

    const headers = [
      'Nome do Cliente',
      'Título da Proposta',
      'Categoria',
      'Status',
      'Data de Criação',
      'Validade (dias)',
      'Link da Proposta',
      'Pacotes e Valores'
    ];

    const escapeCSV = (value: string | number | undefined | null) => {
      const stringValue = String(value ?? '');
      if (stringValue.includes(';') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const rows = listToExport.map((p) => {
      const formattedDate = new Date(p.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const currentStatus = p.status || 'nova';
      const statusLabel = 
        currentStatus === 'nova' ? 'Nova' :
        currentStatus === 'visualizada' ? 'Visualizada' :
        currentStatus === 'assinada' || currentStatus === 'fechado' ? 'Assinada' :
        currentStatus === 'desistiu' ? 'Desistiu' : 'Pendente';
      const categoryLabel = CATEGORY_LABELS[p.category] || p.category;
      const packagesSummary = p.packages.map((pkg) => `${pkg.name} (${pkg.price})`).join(' | ');
      const proposalUrl = `https://www.modkovskifotografia.com.br/propostas/${p.category}/${p.clientSlug}`;

      return [
        escapeCSV(p.clientName),
        escapeCSV(p.title),
        escapeCSV(categoryLabel),
        escapeCSV(statusLabel),
        escapeCSV(formattedDate),
        escapeCSV(p.validityDays || 10),
        escapeCSV(proposalUrl),
        escapeCSV(packagesSummary)
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `propostas-modkovski-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-text selection:bg-brand-wine selection:text-white pb-24">
      
      {/* Top Header Navigation */}
      <PanelNavigation 
        onOpenChangePassword={() => {
          setIsChangePasswordOpen(true);
          setChangePasswordError('');
          setChangePasswordSuccess('');
        }}
        activeCount={{
          proposals: proposals.filter(p => !p.isTemplate).length
        }}
      />

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
                Aqui você pode copiar qualquer modelo padrão, personalizar com o nome do seu cliente e os valores acordados, gerar o link exclusivo (ex: <span className="font-mono text-xs bg-brand-cream px-1.5 py-0.5 rounded text-brand-wine">/corporativo/nome</span>). As propostas permanecem salvas no sistema por tempo indeterminado e só são excluídas quando você apagá-las manualmente.
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
                      href={`/propostas/${cat}/padrao`}
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

        {/* Section: Resumo e Gráfico dos Últimos 30 Dias */}
        <section className="mb-14 bg-white rounded-3xl p-6 sm:p-8 border border-brand-wine/15 shadow-sm">
          {(() => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const last30DaysProposals = proposals.filter((p) => {
              const d = new Date(p.createdAt || new Date());
              return d >= thirtyDaysAgo;
            });

            const chartData = Object.keys(CATEGORY_LABELS).map((catKey) => {
              const count = last30DaysProposals.filter((p) => p.category === catKey).length;
              return {
                name: CATEGORY_LABELS[catKey as ProposalCategory],
                key: catKey,
                count,
              };
            });

            const categoryColors: Record<string, string> = {
              individual: '#4A1525',   // Wine
              casal: '#8C2D43',        // Deep Rose
              corporativo: '#D4AF37',  // Gold
              casamento: '#B8860B',    // Dark Gold
              evento: '#6B4226',       // Bronze
              personalizado: '#9E7B66' // Taupe
            };

            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-text font-medium">
                      Resumo por Categoria (Últimos 30 Dias)
                    </h2>
                    <p className="text-xs text-brand-text-soft">
                      Quantidade de propostas geradas recentemente divididas por segmento.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 bg-brand-wine/5 px-3 py-1.5 rounded-xl border border-brand-wine/10 text-xs text-brand-wine font-medium">
                      <Sparkles className="w-4 h-4" />
                      <span>Total no período: {last30DaysProposals.length} propostas</span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 bg-brand-wine text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-brand-wine-dark transition-all shadow-sm cursor-pointer"
                      title="Exportar ou imprimir relatório mensal em PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar PDF</span>
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="inline-flex items-center gap-1.5 bg-brand-cream border border-brand-wine/20 text-brand-wine px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-brand-wine hover:text-white transition-all shadow-xs cursor-pointer"
                      title="Exportar lista de propostas para planilha CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Chart */}
                  <div className="lg:col-span-2 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B4226' }} stroke="#D4AF37" />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B4226' }} stroke="#D4AF37" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderColor: '#4A1525', borderRadius: '12px', fontSize: '12px' }}
                          formatter={(value: any) => [`${value} propostas`, 'Quantidade']}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry) => (
                            <Cell key={`cell-${entry.key}`} fill={categoryColors[entry.key] || '#4A1525'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sums / Legend next to chart */}
                  <div className="bg-brand-sand/30 rounded-2xl p-5 border border-brand-wine/10 space-y-3">
                    <h3 className="font-serif text-sm font-bold text-brand-text uppercase tracking-wider mb-2 border-b border-brand-wine/10 pb-2">
                      Soma por Categoria
                    </h3>
                    {chartData.map((item) => (
                      <div key={item.key} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full shrink-0" 
                            style={{ backgroundColor: categoryColors[item.key] }}
                          />
                          <span className="text-brand-text font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold px-2 py-0.5 rounded-md bg-white border border-brand-wine/15 text-brand-wine">
                          {item.count} {item.count === 1 ? 'proposta' : 'propostas'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </section>

        {/* Section 2: Active Proposals List */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-serif text-xl sm:text-2xl text-brand-text font-medium">
                  Propostas Cadastradas
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-wine/10 text-brand-wine font-bold">
                  {filteredProposals.length} {filteredProposals.length === 1 ? 'proposta' : 'propostas'}
                </span>
              </div>
              <p className="text-xs text-brand-text-soft">
                Gerencie todos os orçamentos emitidos, monitore status de visualização e assinatura.
              </p>
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-brand-wine text-white shadow-xs'
                    : 'bg-white border border-brand-wine/15 text-brand-text hover:bg-brand-cream/60'
                }`}
              >
                <span>Todas</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterStatus === 'all' ? 'bg-white/20 text-white' : 'bg-brand-cream text-brand-wine'}`}>
                  {statusCounts.all}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('nova')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === 'nova'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100'
                }`}
              >
                <Sparkles className="w-3 h-3 text-sky-500" />
                <span>Novas</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterStatus === 'nova' ? 'bg-white/20 text-white' : 'bg-sky-200/70 text-sky-800'}`}>
                  {statusCounts.nova}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('visualizada')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === 'visualizada'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                <Eye className="w-3 h-3 text-indigo-500" />
                <span>Visualizadas</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterStatus === 'visualizada' ? 'bg-white/20 text-white' : 'bg-indigo-200/70 text-indigo-800'}`}>
                  {statusCounts.visualizada}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('assinada')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === 'assinada'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Assinadas</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterStatus === 'assinada' ? 'bg-white/20 text-white' : 'bg-emerald-200/70 text-emerald-800'}`}>
                  {statusCounts.assinada}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('pendente')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === 'pendente'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Pendentes</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterStatus === 'pendente' ? 'bg-white/20 text-white' : 'bg-amber-200/70 text-amber-800'}`}>
                  {statusCounts.pendente}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('desistiu')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === 'desistiu'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <AlertCircle className="w-3 h-3 text-rose-600" />
                <span>Desistiram</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterStatus === 'desistiu' ? 'bg-white/20 text-white' : 'bg-rose-200/70 text-rose-800'}`}>
                  {statusCounts.desistiu}
                </span>
              </button>
            </div>
          </div>

          {/* Search and Granular Filter Bar */}
          <div className="bg-white rounded-2xl p-3.5 border border-brand-wine/15 shadow-2xs mb-5 flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-brand-text-soft absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por cliente, documento, link ou pacote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 rounded-xl border border-brand-wine/20 bg-brand-cream/30 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-wine"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-soft hover:text-brand-text text-xs p-0.5"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Select */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-brand-wine/20 bg-brand-cream/30 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-wine cursor-pointer font-medium"
              >
                <option value="all">Todos os Status ({statusCounts.all})</option>
                <option value="nova">✦ Nova ({statusCounts.nova})</option>
                <option value="visualizada">👁 Visualizada ({statusCounts.visualizada})</option>
                <option value="assinada">✍ Assinada ({statusCounts.assinada})</option>
                <option value="pendente">⏳ Pendente ({statusCounts.pendente})</option>
                <option value="desistiu">❌ Desistiu ({statusCounts.desistiu})</option>
              </select>
            </div>

            {/* Category Select */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-brand-wine/20 bg-brand-cream/30 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-wine cursor-pointer font-medium"
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

            {/* Order Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-brand-wine/20 bg-brand-cream/30 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-wine cursor-pointer font-medium"
              >
                <option value="recent">Mais Recentes</option>
                <option value="oldest">Mais Antigas</option>
                <option value="name">Nome (A-Z)</option>
                <option value="status">Por Status</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {(searchQuery || filterStatus !== 'all' || filterCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setFilterCategory('all');
                }}
                className="px-2.5 py-2 rounded-xl border border-brand-wine/20 text-brand-wine hover:bg-brand-wine/10 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title="Limpar todos os filtros"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}

            {/* Exportar CSV */}
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-wine/25 bg-white hover:bg-brand-wine hover:text-white text-xs text-brand-wine font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer ml-auto"
              title="Exportar lista de propostas filtradas para planilha CSV (Excel / Planilhas Google)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {filteredProposals.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-brand-wine/10">
              <FileText className="w-10 h-10 text-brand-wine/30 mx-auto mb-3" />
              <h3 className="font-serif text-lg text-brand-text font-medium mb-1">
                Nenhuma proposta encontrada com os filtros selecionados
              </h3>
              <p className="text-xs text-brand-text-soft max-w-md mx-auto mb-4">
                Tente alterar os termos da busca ou redefinir os filtros de status e categoria.
              </p>
              {(searchQuery || filterStatus !== 'all' || filterCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                    setFilterCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wine-dark transition-all shadow-xs cursor-pointer"
                >
                  Limpar Filtros de Busca
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProposals.map((p, pIdx) => {
                const isCopied = copiedId === p.id;
                const formattedDate = new Date(p.createdAt).toLocaleDateString('pt-BR');
                const pathUrl = `/propostas/${p.category}/${p.clientSlug}`;
                const currentStatus = p.status || 'nova';

                return (
                  <div
                    key={`${p.id || 'prop'}-${p.category || ''}-${p.clientSlug || ''}-${pIdx}`}
                    className="bg-white rounded-2xl p-5 border border-brand-wine/15 shadow-sm hover:border-brand-wine/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-wine text-white">
                          {CATEGORY_LABELS[p.category]}
                        </span>
                        <span className="text-sm font-semibold text-brand-text font-serif">
                          {p.clientName}
                        </span>
                        
                        {/* Status Badge */}
                        {currentStatus === 'nova' ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-sky-600" /> Nova ✦
                          </span>
                        ) : currentStatus === 'visualizada' ? (
                          <span 
                            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1 shadow-2xs" 
                            title={p.viewedAt ? `Visualizada pelo cliente em ${new Date(p.viewedAt).toLocaleDateString('pt-BR')} às ${new Date(p.viewedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Visualizada pelo cliente'}
                          >
                            <Eye className="w-3 h-3 text-indigo-600" /> Visualizada 👁
                          </span>
                        ) : currentStatus === 'assinada' || currentStatus === 'fechado' ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Assinada ✍
                          </span>
                        ) : currentStatus === 'desistiu' ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 shadow-2xs">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Desistiu ❌
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-2xs">
                            <Clock className="w-3 h-3 text-amber-600" /> Pendente ⏳
                          </span>
                        )}

                        <span className="text-[11px] text-brand-text-soft font-mono bg-brand-cream/80 px-2 py-0.5 rounded border border-brand-wine/10">
                          www.modkovskifotografia.com.br/propostas/{p.category}/{p.clientSlug}
                        </span>

                        {p.hidePhotoSection && (
                          <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Foto Desativada
                          </span>
                        )}
                        {p.hideVideoSection && (
                          <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Vídeo Desativado
                          </span>
                        )}
                        {p.hideConteudoSection && (
                          <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Conteúdo Desativado
                          </span>
                        )}

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
                      {/* Status Selector Dropdown */}
                      <div className="relative">
                        <select
                          value={currentStatus === 'fechado' ? 'assinada' : currentStatus}
                          onChange={(e) => handleUpdateStatus(p, e.target.value as ProposalStatus)}
                          className={`text-xs font-semibold rounded-xl px-2.5 py-1.5 border transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-wine ${
                            currentStatus === 'nova'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : currentStatus === 'visualizada'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                              : currentStatus === 'assinada' || currentStatus === 'fechado'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : currentStatus === 'desistiu'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                          title="Alterar status desta proposta"
                        >
                          <option value="nova">✦ Nova</option>
                          <option value="visualizada">👁 Visualizada</option>
                          <option value="assinada">✍ Assinada</option>
                          <option value="pendente">⏳ Pendente</option>
                          <option value="desistiu">❌ Desistiu</option>
                        </select>
                      </div>
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

                      {/* Visualizar Prévia Imediata */}
                      <Link
                        href={`/propostas/${p.category}/${p.clientSlug}`}
                        target="_blank"
                        className="p-1.5 rounded-xl border border-brand-wine/20 text-brand-wine hover:bg-brand-wine/10 transition-colors"
                        title="Ver proposta atualizada em tempo real (neste ambiente)"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Abrir no Domínio Oficial */}
                      <a
                        href={`https://www.modkovskifotografia.com.br/propostas/${p.category}/${p.clientSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl border border-brand-wine/20 text-brand-text hover:bg-brand-wine/5 transition-colors"
                        title="Abrir no domínio oficial www.modkovskifotografia.com.br"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

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
                        type="button"
                        onClick={() => openDeleteModal(p.id, p.category, p.clientSlug, p.clientName)}
                        className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
              
              {/* Client Name, Slug, Date and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <span className="text-[11px] text-brand-text-soft bg-brand-cream/80 px-2.5 py-2.5 rounded-l-xl border border-r-0 border-brand-wine/20 font-mono">
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-wine" />
                    Data da Proposta
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 06/10/2026"
                    value={editingProposal.proposalDate || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingProposal((prev) => prev ? { ...prev, proposalDate: val } : null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-wine/30 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-text mb-1.5">
                    Status da Proposta
                  </label>
                  <select
                    value={editingProposal.status || 'nova'}
                    onChange={(e) => {
                      const st = e.target.value as ProposalStatus;
                      setEditingProposal((prev) => prev ? { ...prev, status: st } : null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-wine/20 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-wine/30 bg-white cursor-pointer"
                  >
                    <option value="nova">✦ Nova (Recém criada)</option>
                    <option value="visualizada">👁 Visualizada (Cliente abriu)</option>
                    <option value="assinada">✍ Assinada (Fechada)</option>
                    <option value="pendente">⏳ Pendente (Negociação)</option>
                    <option value="desistiu">❌ Desistiu (Cancelada)</option>
                  </select>
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

              {/* Packages Section: Organized exclusively for Individual and Corporativo Proposals, or generic for others */}
              {editingProposal.category === 'individual' ? (
                <>
                  {/* 1. Opções de Ensaio Fotográfico */}
                  <div className="pt-4 border-t border-brand-wine/10" id="section-modal-foto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Camera className="w-4 h-4 text-brand-wine" />
                          <h4 className="font-serif text-lg text-brand-text font-semibold">
                            1. Ensaio Fotográfico (Proposta Fotográfica)
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            editingProposal.hidePhotoSection
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {editingProposal.hidePhotoSection ? '✕ Desativada' : `✓ Ativa (${editingProposal.packages.length} opções)`}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-soft mt-0.5">
                          Opções de ensaio fotográfico. Você pode desativar para não exibir nesta proposta, sem alterar o padrão.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {/* Botão de Ativar/Desativar Seção */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProposal((prev) => prev ? { ...prev, hidePhotoSection: !prev.hidePhotoSection } : null);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                            editingProposal.hidePhotoSection
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={editingProposal.hidePhotoSection ? 'Clique para reativar esta seção na proposta' : 'Clique para desativar esta seção na proposta'}
                        >
                          {editingProposal.hidePhotoSection ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                              <span>Seção Desativada</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Seção Ativa</span>
                            </>
                          )}
                        </button>

                        {!editingProposal.hidePhotoSection && (
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
                        )}
                      </div>
                    </div>

                    {editingProposal.hidePhotoSection ? (
                      <div className="bg-rose-50/80 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-rose-600 shrink-0" />
                          <span><strong>Esta seção está desativada.</strong> A seção de ensaio fotográfico não será exibida na proposta criada para o cliente.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProposal((prev) => prev ? { ...prev, hidePhotoSection: false } : null)}
                          className="text-xs font-bold text-rose-900 underline hover:text-rose-950 shrink-0 cursor-pointer"
                        >
                          Ativar Seção
                        </button>
                      </div>
                    ) : (
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
                  )}
                  </div>

                  {/* 2. Opções de Produção de Vídeo */}
                  <div className="pt-6 border-t border-brand-wine/10" id="section-modal-video">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Video className="w-4 h-4 text-brand-wine" />
                          <h4 className="font-serif text-lg text-brand-text font-semibold">
                            2. Produção de Vídeo (Proposta de Vídeos)
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            editingProposal.hideVideoSection
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {editingProposal.hideVideoSection ? '✕ Desativada' : `✓ Ativa (${(editingProposal.videoPackages || []).length} opções)`}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-soft mt-0.5">
                          Formatos de produção de vídeo. Você pode desativar para não exibir nesta proposta, sem alterar o padrão.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {/* Botão de Ativar/Desativar Seção */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProposal((prev) => prev ? { ...prev, hideVideoSection: !prev.hideVideoSection } : null);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                            editingProposal.hideVideoSection
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={editingProposal.hideVideoSection ? 'Clique para reativar esta seção na proposta' : 'Clique para desativar esta seção na proposta'}
                        >
                          {editingProposal.hideVideoSection ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                              <span>Seção Desativada</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Seção Ativa</span>
                            </>
                          )}
                        </button>

                        {!editingProposal.hideVideoSection && (
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
                        )}
                      </div>
                    </div>

                    {editingProposal.hideVideoSection ? (
                      <div className="bg-rose-50/80 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-rose-600 shrink-0" />
                          <span><strong>Esta seção está desativada.</strong> A seção de produção de vídeo não será exibida na proposta criada para o cliente.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProposal((prev) => prev ? { ...prev, hideVideoSection: false } : null)}
                          className="text-xs font-bold text-rose-900 underline hover:text-rose-950 shrink-0 cursor-pointer"
                        >
                          Ativar Seção
                        </button>
                      </div>
                    ) : (
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
                                placeholder="Preço (Ex: R$ 350)"
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
                  )}
                  </div>
                </>
              ) : editingProposal.category === 'corporativo' ? (
                <>
                  {/* 1. Ensaio Fotográfico */}
                  <div className="pt-4 border-t border-brand-wine/10" id="section-modal-corp-foto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Camera className="w-4 h-4 text-brand-wine" />
                          <h4 className="font-serif text-lg text-brand-text font-semibold">
                            1. Ensaio Fotográfico
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            editingProposal.hidePhotoSection
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {editingProposal.hidePhotoSection ? '✕ Desativada' : `✓ Ativa (${editingProposal.packages.length} opções)`}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-soft mt-0.5">
                          Opções de ensaio fotográfico corporativo (Essencial, Clássico, Especial e Completo).
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {/* Botão de Ativar/Desativar Seção */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProposal((prev) => prev ? { ...prev, hidePhotoSection: !prev.hidePhotoSection } : null);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                            editingProposal.hidePhotoSection
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={editingProposal.hidePhotoSection ? 'Clique para reativar esta seção na proposta' : 'Clique para desativar esta seção na proposta'}
                        >
                          {editingProposal.hidePhotoSection ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                              <span>Seção Desativada</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Seção Ativa</span>
                            </>
                          )}
                        </button>

                        {!editingProposal.hidePhotoSection && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProposal((prev) => {
                                if (!prev) return null;
                                const nextNum = prev.packages.length + 1;
                                const newPkg: ProposalPackage = {
                                  id: `corp-foto-${Date.now()}`,
                                  name: `Ensaio Opção 0${nextNum}`,
                                  price: 'R$ 450',
                                  paymentMethod: 'Pix',
                                  duration: 'Duração de até 01 hora',
                                  features: [
                                    '15 fotos selecionadas',
                                    '01 vídeo brinde Making Of',
                                    'Prazo de entrega de até 15 dias',
                                    'Foto extra R$ 22,00'
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
                            id="btn-add-corp-foto-option"
                          >
                            <Plus className="w-3.5 h-3.5" /> Adicionar Opção de Foto
                          </button>
                        )}
                      </div>
                    </div>

                    {editingProposal.hidePhotoSection ? (
                      <div className="bg-rose-50/80 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-rose-600 shrink-0" />
                          <span><strong>Esta seção está desativada.</strong> A seção de ensaio fotográfico não será exibida na proposta criada para o cliente. O modelo padrão permanece inalterado.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProposal((prev) => prev ? { ...prev, hidePhotoSection: false } : null)}
                          className="text-xs font-bold text-rose-900 underline hover:text-rose-950 shrink-0 cursor-pointer"
                        >
                          Ativar Seção
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editingProposal.packages.map((pkg, pIdx) => (
                        <div
                          key={pkg.id || pIdx}
                          className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-wine/15 space-y-3"
                          id={`modal-corp-foto-pkg-${pIdx}`}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-brand-wine text-white">
                                Foto 0{pIdx + 1}
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
                                placeholder="Preço (Ex: R$ 257)"
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
                                placeholder="Ex: Pix"
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
                  )}
                  </div>

                  {/* 2. Produção de Vídeo */}
                  <div className="pt-6 border-t border-brand-wine/10" id="section-modal-corp-video">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Video className="w-4 h-4 text-brand-wine" />
                          <h4 className="font-serif text-lg text-brand-text font-semibold">
                            2. Produção de Vídeo
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            editingProposal.hideVideoSection
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {editingProposal.hideVideoSection ? '✕ Desativada' : `✓ Ativa (${(editingProposal.videoPackages || []).length} opções)`}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-soft mt-0.5">
                          4 formatos de produção de vídeo (Prático, Essencial, Presença e Autoridade).
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {/* Botão de Ativar/Desativar Seção */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProposal((prev) => prev ? { ...prev, hideVideoSection: !prev.hideVideoSection } : null);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                            editingProposal.hideVideoSection
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={editingProposal.hideVideoSection ? 'Clique para reativar esta seção na proposta' : 'Clique para desativar esta seção na proposta'}
                        >
                          {editingProposal.hideVideoSection ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                              <span>Seção Desativada</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Seção Ativa</span>
                            </>
                          )}
                        </button>

                        {!editingProposal.hideVideoSection && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProposal((prev) => {
                                if (!prev) return null;
                                const currentVideos = prev.videoPackages || [];
                                const nextNum = currentVideos.length + 1;
                                const newVideo: ProposalPackage = {
                                  id: `corp-video-${Date.now()}`,
                                  name: `Formato de Vídeo 0${nextNum}`,
                                  price: 'R$ 587',
                                  paymentMethod: 'Pix',
                                  duration: '04 vídeos até 1:30seg',
                                  features: [
                                    '04 vídeos até 1:30seg',
                                    '04 capas pra vídeo',
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
                            id="btn-add-corp-video-option"
                          >
                            <Plus className="w-3.5 h-3.5" /> Adicionar Opção de Vídeo
                          </button>
                        )}
                      </div>
                    </div>

                    {editingProposal.hideVideoSection ? (
                      <div className="bg-rose-50/80 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-rose-600 shrink-0" />
                          <span><strong>Esta seção está desativada.</strong> A seção de produção de vídeo não será exibida na proposta criada para o cliente. O modelo padrão permanece inalterado.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProposal((prev) => prev ? { ...prev, hideVideoSection: false } : null)}
                          className="text-xs font-bold text-rose-900 underline hover:text-rose-950 shrink-0 cursor-pointer"
                        >
                          Ativar Seção
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(editingProposal.videoPackages || []).map((vPkg, vIdx) => (
                        <div
                          key={vPkg.id || vIdx}
                          className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-wine/15 space-y-3"
                          id={`modal-corp-video-pkg-${vIdx}`}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-brand-wine text-white">
                                Vídeo 0{vIdx + 1}
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
                                placeholder="Preço (Ex: R$ 587)"
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
                                placeholder="Ex: 04 vídeos até 1:30seg"
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
                                placeholder="Ex: Pix"
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
                  )}
                  </div>

                  {/* 3. Produção de Conteúdo */}
                  <div className="pt-6 border-t border-brand-wine/10" id="section-modal-corp-conteudo">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Sparkles className="w-4 h-4 text-brand-wine" />
                          <h4 className="font-serif text-lg text-brand-text font-semibold">
                            3. Produção de Conteúdo
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            editingProposal.hideConteudoSection
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {editingProposal.hideConteudoSection ? '✕ Desativada' : `✓ Ativa (${(editingProposal.conteudoPackages || []).length} opções)`}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-soft mt-0.5">
                          4 formatos de produção de conteúdo recorrente (Prático, Essencial, Presença e Autoridade).
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {/* Botão de Ativar/Desativar Seção */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProposal((prev) => prev ? { ...prev, hideConteudoSection: !prev.hideConteudoSection } : null);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                            editingProposal.hideConteudoSection
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={editingProposal.hideConteudoSection ? 'Clique para reativar esta seção na proposta' : 'Clique para desativar esta seção na proposta'}
                        >
                          {editingProposal.hideConteudoSection ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                              <span>Seção Desativada</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Seção Ativa</span>
                            </>
                          )}
                        </button>

                        {!editingProposal.hideConteudoSection && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProposal((prev) => {
                                if (!prev) return null;
                                const currentConteudo = prev.conteudoPackages || [];
                                const nextNum = currentConteudo.length + 1;
                                const newConteudo: ProposalPackage = {
                                  id: `corp-cont-${Date.now()}`,
                                  name: `Plano de Conteúdo 0${nextNum}`,
                                  price: 'R$ 777',
                                  paymentMethod: 'Pix',
                                  duration: 'Entrega mensal',
                                  features: [
                                    '04 vídeos até 1:30seg (Feed)',
                                    'Capas para vídeos (Feed)',
                                    '08 vídeos até 20seg ou cards (Story)',
                                    'Gerenciamento de postagens e análise dos melhores dias e horários',
                                    'Acompanhamento, roteirização, direção e posicionamento',
                                    'Edição dinâmica, cortes essenciais, legenda e trilha sonora',
                                    'Entrega mensal'
                                  ],
                                  highlight: false,
                                };
                                return {
                                  ...prev,
                                  conteudoPackages: [...currentConteudo, newConteudo]
                                };
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wine-dark transition-colors self-start sm:self-auto shrink-0 cursor-pointer shadow-xs"
                            id="btn-add-corp-conteudo-option"
                          >
                            <Plus className="w-3.5 h-3.5" /> Adicionar Opção de Conteúdo
                          </button>
                        )}
                      </div>
                    </div>

                    {editingProposal.hideConteudoSection ? (
                      <div className="bg-rose-50/80 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-rose-600 shrink-0" />
                          <span><strong>Esta seção está desativada.</strong> A seção de produção de conteúdo não será exibida na proposta criada para o cliente. O modelo padrão permanece inalterado.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProposal((prev) => prev ? { ...prev, hideConteudoSection: false } : null)}
                          className="text-xs font-bold text-rose-900 underline hover:text-rose-950 shrink-0 cursor-pointer"
                        >
                          Ativar Seção
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(editingProposal.conteudoPackages || []).map((cPkg, cIdx) => (
                        <div
                          key={cPkg.id || cIdx}
                          className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-wine/15 space-y-3"
                          id={`modal-corp-conteudo-pkg-${cIdx}`}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-brand-wine text-white">
                                Conteúdo 0{cIdx + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                              <input
                                type="text"
                                value={cPkg.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const cPkgs = [...(prev.conteudoPackages || [])];
                                    cPkgs[cIdx].name = val;
                                    return { ...prev, conteudoPackages: cPkgs };
                                  });
                                }}
                                className="font-serif font-bold text-base text-brand-text bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 flex-1"
                                placeholder="Nome do Plano de Conteúdo"
                              />

                              <input
                                type="text"
                                value={cPkg.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const cPkgs = [...(prev.conteudoPackages || [])];
                                    cPkgs[cIdx].price = val;
                                    return { ...prev, conteudoPackages: cPkgs };
                                  });
                                }}
                                className="font-bold text-brand-wine text-sm bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20 w-32"
                                placeholder="Preço (Ex: R$ 777)"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const cPkgs = prev.conteudoPackages || [];
                                  return {
                                    ...prev,
                                    conteudoPackages: cPkgs.filter((_, i) => i !== cIdx)
                                  };
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir opção de conteúdo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                                Frequência / Entrega
                              </label>
                              <input
                                type="text"
                                value={cPkg.duration}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const cPkgs = [...(prev.conteudoPackages || [])];
                                    cPkgs[cIdx].duration = val;
                                    return { ...prev, conteudoPackages: cPkgs };
                                  });
                                }}
                                className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                                placeholder="Ex: Entrega mensal"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-brand-text-soft mb-1">
                                Forma de Pagamento
                              </label>
                              <input
                                type="text"
                                value={cPkg.paymentMethod}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const cPkgs = [...(prev.conteudoPackages || [])];
                                    cPkgs[cIdx].paymentMethod = val;
                                    return { ...prev, conteudoPackages: cPkgs };
                                  });
                                }}
                                className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-brand-wine/20"
                                placeholder="Ex: Pix"
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
                              value={cPkg.features.join('\n')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n');
                                setEditingProposal((prev) => {
                                  if (!prev) return null;
                                  const cPkgs = [...(prev.conteudoPackages || [])];
                                  cPkgs[cIdx].features = lines;
                                  return { ...prev, conteudoPackages: cPkgs };
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
                                checked={cPkg.highlight || false}
                                onChange={(e) => {
                                  const isHigh = e.target.checked;
                                  setEditingProposal((prev) => {
                                    if (!prev) return null;
                                    const cPkgs = [...(prev.conteudoPackages || [])];
                                    cPkgs[cIdx].highlight = isHigh;
                                    return { ...prev, conteudoPackages: cPkgs };
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
                  )}
                  </div>
                </>
              ) : (
                /* Packages Section for other categories */
                <div className="pt-4 border-t border-brand-wine/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Camera className="w-4 h-4 text-brand-wine" />
                        <h4 className="font-serif text-lg text-brand-text font-semibold">
                          Pacotes de Investimento
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          editingProposal.hidePhotoSection
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {editingProposal.hidePhotoSection ? '✕ Desativada' : `✓ Ativa (${editingProposal.packages.length} opções)`}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-soft mt-0.5">
                        Ajuste os valores, condições e itens que serão exibidos nesta proposta.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {/* Botão de Ativar/Desativar Seção */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProposal((prev) => prev ? { ...prev, hidePhotoSection: !prev.hidePhotoSection } : null);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                          editingProposal.hidePhotoSection
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                        title={editingProposal.hidePhotoSection ? 'Clique para reativar esta seção na proposta' : 'Clique para desativar esta seção na proposta'}
                      >
                        {editingProposal.hidePhotoSection ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                            <span>Seção Desativada</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Seção Ativa</span>
                          </>
                        )}
                      </button>

                      {!editingProposal.hidePhotoSection && (
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-wine/10 text-brand-wine text-xs font-semibold hover:bg-brand-wine hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Pacote
                        </button>
                      )}
                    </div>
                  </div>

                  {editingProposal.hidePhotoSection ? (
                    <div className="bg-rose-50/80 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-rose-600 shrink-0" />
                        <span><strong>Esta seção está desativada.</strong> Os pacotes de investimento não serão exibidos na proposta criada para o cliente.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProposal((prev) => prev ? { ...prev, hidePhotoSection: false } : null)}
                        className="text-xs font-bold text-rose-900 underline hover:text-rose-950 shrink-0 cursor-pointer"
                      >
                        Ativar Seção
                      </button>
                    </div>
                  ) : (
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
                  )}
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

      {/* MODAL: Confirmação de Exclusão de Proposta */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 text-left">
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-rose-100">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-brand-text font-bold">
                  Excluir Proposta
                </h3>
                <p className="text-xs text-brand-text-soft">
                  Esta ação removerá a proposta permanentemente.
                </p>
              </div>
            </div>

            <p className="text-sm text-brand-text mb-4 leading-relaxed">
              Tem certeza que deseja excluir a proposta de <strong className="text-brand-wine font-semibold">&ldquo;{deleteConfirmTarget.clientName}&rdquo;</strong>?
            </p>

            <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-2xl border border-rose-200 mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção:</strong> O link <code className="font-mono font-bold bg-white/70 px-1 py-0.5 rounded text-[11px]">/propostas/{deleteConfirmTarget.category}/{deleteConfirmTarget.clientSlug}</code> deixará de funcionar imediatamente para o cliente.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                disabled={deleteLoading}
                className="px-5 py-2.5 rounded-full border border-brand-wine/20 text-brand-text hover:bg-brand-cream text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteProposal}
                disabled={deleteLoading}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sim, Excluir Proposta</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
