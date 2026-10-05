'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PanelNavigation from './PanelNavigation';
import { 
  ScrollText, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  FileSignature,
  Send,
  Eye,
  RefreshCw
} from 'lucide-react';
import { brandConfig } from '@/lib/config';

export interface ContractClause {
  title: string;
  content: string;
}

export interface ContractTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  clauses: ContractClause[];
}

export interface IssuedContract {
  id: string;
  templateId: string;
  title: string;
  category: string;
  status: 'rascunho' | 'enviado' | 'assinado' | 'concluido' | 'cancelado';
  clientName: string;
  clientDocument?: string;
  clientEmail?: string;
  clientPhone?: string;
  eventDate?: string;
  eventLocation?: string;
  packageName?: string;
  photoCount?: string;
  videoCount?: string;
  duration?: string;
  totalValue: string;
  paymentTerms?: string;
  deliveryTime?: string;
  selectionTime?: string;
  extraPhotoPrice?: string;
  createdAt: string;
  notes?: string;
  customClauses?: ContractClause[];
}

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  rascunho: { label: 'Rascunho', bg: 'bg-amber-100', text: 'text-amber-800' },
  enviado: { label: 'Enviado ao Cliente', bg: 'bg-blue-100', text: 'text-blue-800' },
  assinado: { label: 'Assinado', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  concluido: { label: 'Serviço Concluído', bg: 'bg-purple-100', text: 'text-purple-800' },
  cancelado: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-800' }
};

export default function ContractManager() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');

  const [contracts, setContracts] = useState<IssuedContract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Preview Modal
  const [previewContract, setPreviewContract] = useState<IssuedContract | null>(null);

  // Contract Form Modal
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<IssuedContract | null>(null);
  const [contractForm, setContractForm] = useState<Partial<IssuedContract>>({
    title: '',
    category: 'casamento',
    templateId: 'tpl-casamento',
    status: 'rascunho',
    clientName: '',
    clientDocument: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventLocation: '',
    packageName: 'Cobertura Completa',
    photoCount: '80 fotos selecionadas',
    videoCount: '2 vídeos de até 1min30',
    duration: '3 horas de cobertura',
    totalValue: 'R$ 950,00',
    paymentTerms: 'Sinal de 30% na reserva e saldo em até 12x no cartão de crédito',
    deliveryTime: '20 dias',
    selectionTime: '5 dias',
    extraPhotoPrice: 'R$ 20,00',
    notes: ''
  });

  // Template Form Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState<Partial<ContractTemplate>>({
    category: 'casamento',
    name: '',
    description: '',
    clauses: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contratos?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setContracts(data.contracts || []);
          setTemplates(data.templates || []);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar contratos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Generate full contract text representation
  const generateContractText = (c: IssuedContract) => {
    const matchedTemplate = templates.find(t => t.id === c.templateId) || templates[0];
    const clauses = c.customClauses && c.customClauses.length > 0 ? c.customClauses : (matchedTemplate?.clauses || []);

    let text = `====================================================\n`;
    text += `${c.title.toUpperCase()}\n`;
    text += `MODKOVSKI FOTOGRAFIA · CNPJ / PROFISSIONAL\n`;
    text += `====================================================\n\n`;
    text += `CONTRATANTE: ${c.clientName}\n`;
    if (c.clientDocument) text += `CPF/CNPJ: ${c.clientDocument}\n`;
    if (c.clientPhone) text += `TELEFONE: ${c.clientPhone}\n`;
    if (c.clientEmail) text += `E-MAIL: ${c.clientEmail}\n`;
    if (c.eventDate) text += `DATA DO EVENTO/ENSAIO: ${c.eventDate}\n`;
    if (c.eventLocation) text += `LOCAL: ${c.eventLocation}\n`;
    text += `PACOTE: ${c.packageName || 'Personalizado'}\n`;
    text += `VALOR TOTAL: ${c.totalValue}\n`;
    text += `CONDIÇÕES DE PAGAMENTO: ${c.paymentTerms || 'Conforme acordado'}\n\n`;
    text += `----------------------------------------------------\n`;
    text += `CLÁUSULAS CONTRATUAIS\n`;
    text += `----------------------------------------------------\n\n`;

    clauses.forEach((cl) => {
      let content = cl.content
        .replace(/{{PACOTE_NOME}}/g, c.packageName || 'Personalizado')
        .replace(/{{QUANTIDADE_FOTOS}}/g, c.photoCount || 'definida em proposta')
        .replace(/{{QUANTIDADE_VIDEOS}}/g, c.videoCount || 'definida em proposta')
        .replace(/{{DURACAO_HORAS}}/g, c.duration || 'acordada')
        .replace(/{{VALOR_TOTAL}}/g, c.totalValue || 'R$ 0,00')
        .replace(/{{CONDICOES_PAGAMENTO}}/g, c.paymentTerms || 'Pix ou cartão')
        .replace(/{{PRAZO_SELECAO}}/g, c.selectionTime || '5')
        .replace(/{{PRAZO_ENTREGA}}/g, c.deliveryTime || '20')
        .replace(/{{VALOR_FOTO_EXTRA}}/g, c.extraPhotoPrice || 'R$ 20,00');

      text += `${cl.title}\n${content}\n\n`;
    });

    text += `_____________________________________\n`;
    text += `ALESSANDRA MODKOVSKI · MODKOVSKI FOTOGRAFIA\n\n`;
    text += `_____________________________________\n`;
    text += `${c.clientName} (CONTRATANTE)\n`;

    return text;
  };

  const handleCopyContract = (c: IssuedContract) => {
    const text = generateContractText(c);
    navigator.clipboard.writeText(text);
    showToast('Texto do contrato copiado para a área de transferência!');
  };

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractForm.clientName || !contractForm.totalValue) {
      showToast('Preencha ao menos o nome do cliente e o valor.', 'error');
      return;
    }

    try {
      const itemToSave: IssuedContract = {
        id: editingContract ? editingContract.id : `ctr-${Date.now()}`,
        templateId: contractForm.templateId || 'tpl-casamento',
        title: contractForm.title || `Contrato - ${contractForm.clientName}`,
        category: contractForm.category || 'casamento',
        status: contractForm.status || 'rascunho',
        clientName: contractForm.clientName || '',
        clientDocument: contractForm.clientDocument || '',
        clientEmail: contractForm.clientEmail || '',
        clientPhone: contractForm.clientPhone || '',
        eventDate: contractForm.eventDate || '',
        eventLocation: contractForm.eventLocation || '',
        packageName: contractForm.packageName || '',
        photoCount: contractForm.photoCount || '',
        videoCount: contractForm.videoCount || '',
        duration: contractForm.duration || '',
        totalValue: contractForm.totalValue || 'R$ 0,00',
        paymentTerms: contractForm.paymentTerms || '',
        deliveryTime: contractForm.deliveryTime || '',
        selectionTime: contractForm.selectionTime || '',
        extraPhotoPrice: contractForm.extraPhotoPrice || '',
        createdAt: editingContract?.createdAt || new Date().toISOString(),
        notes: contractForm.notes || ''
      };

      const res = await fetch('/api/contratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_contract', item: itemToSave })
      });

      const data = await res.json();
      if (data.success) {
        setContracts(data.contracts);
        setIsContractModalOpen(false);
        setEditingContract(null);
        showToast(editingContract ? 'Contrato atualizado com sucesso!' : 'Novo contrato gerado!');
      } else {
        showToast(data.error || 'Erro ao salvar', 'error');
      }
    } catch {
      showToast('Erro ao salvar contrato', 'error');
    }
  };

  const handleDeleteContract = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir o contrato de "${name}"?`)) return;

    try {
      const res = await fetch(`/api/contratos?type=contract&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setContracts(data.contracts);
        showToast('Contrato excluído.');
      }
    } catch {
      showToast('Erro ao excluir contrato', 'error');
    }
  };

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = 
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.packageName && c.packageName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-brand-cream text-brand-text selection:bg-brand-wine selection:text-white">
      <PanelNavigation 
        activeCount={{
          contracts: contracts.length,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Toast Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-4 sm:right-8 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : 'bg-red-900 text-white border-red-700'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <AlertCircle className="w-4 h-4 text-red-300" />}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-wine/10 mb-8">
          <div>
            <span className="text-[10px] font-bold text-brand-wine tracking-[0.25em] uppercase block mb-1">
              GESTÃO JURÍDICA & COMERCIAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text tracking-tight">
              Modelos & Emissão de Contratos
            </h1>
            <p className="text-xs text-brand-text-soft mt-1">
              Gere contratos personalizados para cada serviço, imprima em PDF ou compartilhe com os clientes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-brand-wine/15 bg-white hover:bg-brand-cream text-brand-text text-xs transition-colors"
              title="Recarregar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingContract(null);
                setContractForm({
                  title: '',
                  category: 'casamento',
                  templateId: 'tpl-casamento',
                  status: 'rascunho',
                  clientName: '',
                  clientDocument: '',
                  clientEmail: '',
                  clientPhone: '',
                  eventDate: '',
                  eventLocation: '',
                  packageName: 'Cobertura Especial',
                  photoCount: '60 fotos selecionadas',
                  videoCount: '1 vídeo de até 1min30',
                  duration: '2 horas de cobertura',
                  totalValue: 'R$ 750,00',
                  paymentTerms: 'Sinal de 30% na reserva e saldo em até 12x no cartão de crédito',
                  deliveryTime: '15 dias',
                  selectionTime: '5 dias',
                  extraPhotoPrice: 'R$ 23,00',
                  notes: ''
                });
                setIsContractModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Gerar Novo Contrato</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-brand-wine/10 max-w-md shadow-xs">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contracts'
                ? 'bg-brand-wine text-white shadow-xs'
                : 'text-brand-text-soft hover:text-brand-wine'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>Contratos Gerados ({contracts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-brand-wine text-white shadow-xs'
                : 'text-brand-text-soft hover:text-brand-wine'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span>Modelos Padrão ({templates.length})</span>
          </button>
        </div>

        {/* ================= SECTION 1: CONTRATOS GERADOS ================= */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-brand-wine/10 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-wine/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente, pacote ou serviço..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-cream/60 border border-brand-wine/10 text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-brand-cream/60 border border-brand-wine/10 text-xs text-brand-text font-medium focus:outline-none focus:ring-2 focus:ring-brand-wine"
              >
                <option value="all">Todos os Status</option>
                <option value="rascunho">Rascunho</option>
                <option value="enviado">Enviado</option>
                <option value="assinado">Assinado</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* List */}
            {loading ? (
              <div className="py-16 text-center text-xs text-brand-text-soft">Carregando contratos...</div>
            ) : filteredContracts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-wine/10">
                <ScrollText className="w-10 h-10 text-brand-wine/30 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-brand-text">Nenhum contrato gerado ainda</h3>
                <p className="text-xs text-brand-text-soft mt-1">
                  Clique no botão &quot;Gerar Novo Contrato&quot; para criar o primeiro contrato personalizado.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredContracts.map((c) => {
                  const statusInfo = STATUS_LABELS[c.status] || STATUS_LABELS.rascunho;
                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-3xl p-6 border border-brand-wine/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusInfo.bg} ${statusInfo.text}`}>
                            {statusInfo.label}
                          </span>
                          <span className="text-[11px] font-bold text-brand-wine">
                            {c.totalValue}
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-brand-text mb-1 line-clamp-1">
                          {c.clientName}
                        </h4>
                        <span className="text-[11px] text-brand-wine font-semibold block mb-3">
                          {c.packageName || 'Pacote Personalizado'}
                        </span>

                        <div className="space-y-1.5 text-xs text-brand-text-soft bg-brand-cream/40 p-3 rounded-2xl border border-brand-wine/5 mb-4">
                          {c.eventDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-brand-wine/70 shrink-0" />
                              <span>{c.eventDate}</span>
                            </div>
                          )}
                          {c.eventLocation && (
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-semibold text-brand-text">Local:</span>
                              <span className="truncate">{c.eventLocation}</span>
                            </div>
                          )}
                          {c.duration && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-brand-text">Duração:</span>
                              <span>{c.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-brand-wine/10">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setPreviewContract(c)}
                            className="p-2 rounded-xl bg-brand-cream hover:bg-brand-wine hover:text-white text-brand-wine border border-brand-wine/15 transition-all"
                            title="Visualizar e Imprimir Contrato"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyContract(c)}
                            className="p-2 rounded-xl bg-brand-cream hover:bg-brand-wine hover:text-white text-brand-wine border border-brand-wine/15 transition-all"
                            title="Copiar texto completo"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingContract(c);
                              setContractForm(c);
                              setIsContractModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-wine/15 text-brand-text text-xs font-medium hover:bg-brand-cream transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-brand-wine" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteContract(c.id, c.clientName)}
                            className="p-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                            title="Excluir contrato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 2: MODELOS PADRÃO ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white rounded-3xl p-6 border border-brand-wine/15 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-brand-wine/10 text-brand-wine text-[10px] font-bold tracking-wider uppercase block w-fit mb-3">
                      {tpl.category.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-brand-text mb-2">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-brand-text-soft mb-4 leading-relaxed">
                      {tpl.description}
                    </p>

                    <div className="text-xs text-brand-wine font-semibold mb-4">
                      {tpl.clauses.length} Cláusulas Padrão Inclusas
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingContract(null);
                      setContractForm({
                        title: `Contrato - ${tpl.name}`,
                        category: tpl.category,
                        templateId: tpl.id,
                        status: 'rascunho',
                        clientName: '',
                        clientDocument: '',
                        clientEmail: '',
                        clientPhone: '',
                        eventDate: '',
                        eventLocation: '',
                        packageName: '',
                        photoCount: '',
                        videoCount: '',
                        duration: '',
                        totalValue: 'R$ 0,00',
                        paymentTerms: 'Sinal de 30% na reserva e saldo em até 12x no cartão',
                        deliveryTime: '20 dias',
                        selectionTime: '5 dias',
                        extraPhotoPrice: 'R$ 20,00',
                        notes: ''
                      });
                      setIsContractModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-brand-cream border border-brand-wine/20 text-brand-wine font-bold text-xs hover:bg-brand-wine hover:text-white transition-all text-center"
                  >
                    Usar este Modelo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL NOVO/EDITAR CONTRATO ================= */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-brand-wine/20 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-brand-text mb-1">
              {editingContract ? 'Editar Contrato' : 'Gerar Novo Contrato'}
            </h3>
            <p className="text-xs text-brand-text-soft mb-6">
              Preencha os dados do cliente e as especificações para gerar o documento formal.
            </p>

            <form onSubmit={handleSaveContract} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Modelo Base
                  </label>
                  <select
                    value={contractForm.templateId}
                    onChange={(e) => setContractForm({ ...contractForm, templateId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Status do Contrato
                  </label>
                  <select
                    value={contractForm.status}
                    onChange={(e) => setContractForm({ ...contractForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="enviado">Enviado ao Cliente</option>
                    <option value="assinado">Assinado</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Nome Completo do Contratante
                  </label>
                  <input
                    type="text"
                    value={contractForm.clientName || ''}
                    onChange={(e) => setContractForm({ ...contractForm, clientName: e.target.value })}
                    placeholder="Ex: Maysa Rickely"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    CPF ou CNPJ
                  </label>
                  <input
                    type="text"
                    value={contractForm.clientDocument || ''}
                    onChange={(e) => setContractForm({ ...contractForm, clientDocument: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={contractForm.clientPhone || ''}
                    onChange={(e) => setContractForm({ ...contractForm, clientPhone: e.target.value })}
                    placeholder="(69) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    E-mail do Cliente
                  </label>
                  <input
                    type="email"
                    value={contractForm.clientEmail || ''}
                    onChange={(e) => setContractForm({ ...contractForm, clientEmail: e.target.value })}
                    placeholder="cliente@exemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Data do Evento / Ensaio
                  </label>
                  <input
                    type="date"
                    value={contractForm.eventDate || ''}
                    onChange={(e) => setContractForm({ ...contractForm, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Local da Realização
                  </label>
                  <input
                    type="text"
                    value={contractForm.eventLocation || ''}
                    onChange={(e) => setContractForm({ ...contractForm, eventLocation: e.target.value })}
                    placeholder="Espaço, endereço ou cidade"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Nome do Pacote
                  </label>
                  <input
                    type="text"
                    value={contractForm.packageName || ''}
                    onChange={(e) => setContractForm({ ...contractForm, packageName: e.target.value })}
                    placeholder="Ex: Cobertura Completa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Valor Total do Contrato
                  </label>
                  <input
                    type="text"
                    value={contractForm.totalValue || ''}
                    onChange={(e) => setContractForm({ ...contractForm, totalValue: e.target.value })}
                    placeholder="Ex: R$ 950,00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Duração da Cobertura
                  </label>
                  <input
                    type="text"
                    value={contractForm.duration || ''}
                    onChange={(e) => setContractForm({ ...contractForm, duration: e.target.value })}
                    placeholder="Ex: 3 horas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Quantidade de Fotos Entregues
                  </label>
                  <input
                    type="text"
                    value={contractForm.photoCount || ''}
                    onChange={(e) => setContractForm({ ...contractForm, photoCount: e.target.value })}
                    placeholder="Ex: 80 fotos selecionadas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                    Vídeos Inclusos
                  </label>
                  <input
                    type="text"
                    value={contractForm.videoCount || ''}
                    onChange={(e) => setContractForm({ ...contractForm, videoCount: e.target.value })}
                    placeholder="Ex: 2 vídeos até 1min30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Condições e Forma de Pagamento
                </label>
                <input
                  type="text"
                  value={contractForm.paymentTerms || ''}
                  onChange={(e) => setContractForm({ ...contractForm, paymentTerms: e.target.value })}
                  placeholder="Ex: Sinal de 30% na reserva e saldo em até 12x no cartão de crédito"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-wine/10">
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text hover:bg-brand-cream font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-wine text-white font-bold hover:bg-brand-wine-dark shadow-sm"
                >
                  Salvar e Gerar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL PREVIEW CONTRATO (PRINT / PDF) ================= */}
      {previewContract && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-brand-wine/20 my-8 max-h-[92vh] overflow-y-auto">
            
            {/* Header Controls */}
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-brand-wine/15 mb-6 print:hidden">
              <div>
                <span className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.25em]">
                  VISUALIZAÇÃO DE CONTRATO
                </span>
                <h3 className="font-serif text-xl font-bold text-brand-text">
                  {previewContract.clientName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContract(previewContract)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-cream border border-brand-wine/20 text-xs font-semibold text-brand-wine hover:bg-brand-wine hover:text-white transition-all"
                  title="Copiar texto"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Texto</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-wine text-white text-xs font-bold hover:bg-brand-wine-dark transition-all shadow-sm"
                  title="Imprimir ou Salvar em PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Salvar PDF</span>
                </button>

                <button
                  onClick={() => setPreviewContract(null)}
                  className="p-2 rounded-xl text-brand-text-soft hover:text-brand-wine"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contract Formal Document */}
            <div className="font-serif text-brand-text space-y-6 text-sm leading-relaxed p-4 sm:p-8 bg-brand-cream/30 rounded-2xl border border-brand-wine/10">
              <div className="text-center pb-6 border-b border-brand-wine/20">
                <h2 className="text-xl sm:text-2xl font-bold text-brand-wine">
                  MODKOVSKI FOTOGRAFIA
                </h2>
                <p className="text-xs text-brand-text-soft uppercase tracking-widest mt-1">
                  CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS E AUDIOVISUAIS
                </p>
              </div>

              <div className="space-y-2 text-xs bg-white p-4 rounded-xl border border-brand-wine/10 font-sans">
                <div><strong>CONTRATANTE:</strong> {previewContract.clientName}</div>
                {previewContract.clientDocument && <div><strong>CPF/CNPJ:</strong> {previewContract.clientDocument}</div>}
                {previewContract.clientPhone && <div><strong>TELEFONE:</strong> {previewContract.clientPhone}</div>}
                {previewContract.clientEmail && <div><strong>E-MAIL:</strong> {previewContract.clientEmail}</div>}
                {previewContract.eventDate && <div><strong>DATA DO EVENTO/ENSAIO:</strong> {previewContract.eventDate}</div>}
                {previewContract.eventLocation && <div><strong>LOCAL:</strong> {previewContract.eventLocation}</div>}
                <div><strong>PACOTE ESCOLHIDO:</strong> {previewContract.packageName || 'Personalizado'}</div>
                <div><strong>VALOR TOTAL:</strong> <span className="text-brand-wine font-bold">{previewContract.totalValue}</span></div>
                {previewContract.paymentTerms && <div><strong>FORMA DE PAGAMENTO:</strong> {previewContract.paymentTerms}</div>}
              </div>

              {/* Clauses */}
              <div className="space-y-4 pt-2 font-sans text-xs text-brand-text leading-relaxed">
                {((templates.find(t => t.id === previewContract.templateId) || templates[0])?.clauses || []).map((cl, idx) => {
                  let content = cl.content
                    .replace(/{{PACOTE_NOME}}/g, previewContract.packageName || 'Personalizado')
                    .replace(/{{QUANTIDADE_FOTOS}}/g, previewContract.photoCount || 'definida em proposta')
                    .replace(/{{QUANTIDADE_VIDEOS}}/g, previewContract.videoCount || 'definida em proposta')
                    .replace(/{{DURACAO_HORAS}}/g, previewContract.duration || 'acordada')
                    .replace(/{{VALOR_TOTAL}}/g, previewContract.totalValue || 'R$ 0,00')
                    .replace(/{{CONDICOES_PAGAMENTO}}/g, previewContract.paymentTerms || 'Pix ou cartão')
                    .replace(/{{PRAZO_SELECAO}}/g, previewContract.selectionTime || '5')
                    .replace(/{{PRAZO_ENTREGA}}/g, previewContract.deliveryTime || '20')
                    .replace(/{{VALOR_FOTO_EXTRA}}/g, previewContract.extraPhotoPrice || 'R$ 20,00');

                  return (
                    <div key={idx} className="space-y-1">
                      <h4 className="font-bold text-brand-wine">{cl.title}</h4>
                      <p className="text-brand-text-soft text-justify">{content}</p>
                    </div>
                  );
                })}
              </div>

              {/* Signatures */}
              <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs font-sans">
                <div className="border-t border-brand-text/30 pt-2">
                  <div className="font-bold">MODKOVSKI FOTOGRAFIA</div>
                  <div className="text-[11px] text-brand-text-soft">CONTRATADA</div>
                </div>
                <div className="border-t border-brand-text/30 pt-2">
                  <div className="font-bold">{previewContract.clientName}</div>
                  <div className="text-[11px] text-brand-text-soft">CONTRATANTE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
