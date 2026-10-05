'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PanelNavigation from './PanelNavigation';
import { 
  MessageSquareQuote, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Sparkles,
  Image as ImageIcon,
  Link2,
  Eye,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';

interface TestimonialItem {
  id: string;
  category: string;
  occasion: string;
  client: string;
  quote: string;
  rating?: number;
  featured?: boolean;
  createdAt?: string;
  avatarUrl?: string;
}

interface PartnerItem {
  id: string;
  name: string;
  category?: string;
  imageUrl: string;
  link?: string;
  order?: number;
  active?: boolean;
}

const CATEGORY_MAP: Record<string, string> = {
  casamento: 'Casamento',
  corporativo: 'Corporativo & Marca',
  casal: 'Casal & Família',
  evento: 'Eventos & Aniversários',
  individual: 'Individual & Posicionamento',
};

function cleanImageSrc(src?: string): string {
  if (!src) return '/images/portfolio-01.jpg';
  const trimmed = src.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('app/painel/depoimentos/')) {
    return '/' + trimmed.replace('app/painel/depoimentos/', 'depoimentos/');
  }
  if (!trimmed.startsWith('/')) {
    return `/${trimmed}`;
  }
  return trimmed;
}

export default function TestimonialManager() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'testimonials' | 'partners'>('testimonials');

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [testForm, setTestForm] = useState<Partial<TestimonialItem>>({
    category: 'casamento',
    occasion: '',
    client: '',
    quote: '',
    rating: 5,
    featured: true
  });

  // Partner Modal State
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [partnerForm, setPartnerForm] = useState<Partial<PartnerItem>>({
    name: '',
    category: '',
    imageUrl: '',
    link: '',
    order: 1,
    active: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/depoimentos?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.testimonials || []);
          setPartners(data.partners || []);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
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

  // Save Testimonial
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.client || !testForm.quote) {
      showToast('Preencha o nome do cliente e o depoimento.', 'error');
      return;
    }

    try {
      const itemToSave: TestimonialItem = {
        id: editingTestimonial ? editingTestimonial.id : `dep-${Date.now()}`,
        category: testForm.category || 'casamento',
        occasion: testForm.occasion || '',
        client: testForm.client || '',
        quote: testForm.quote || '',
        rating: testForm.rating ?? 5,
        featured: testForm.featured ?? true,
        createdAt: editingTestimonial?.createdAt || new Date().toISOString(),
        avatarUrl: testForm.avatarUrl || ''
      };

      const res = await fetch('/api/depoimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_testimonial', item: itemToSave })
      });

      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
        setIsTestimonialModalOpen(false);
        setEditingTestimonial(null);
        showToast(editingTestimonial ? 'Depoimento atualizado com sucesso!' : 'Novo depoimento adicionado!');
      } else {
        showToast(data.error || 'Erro ao salvar', 'error');
      }
    } catch {
      showToast('Erro de conexão ao salvar', 'error');
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir o depoimento de "${name}"?`)) return;

    try {
      const res = await fetch(`/api/depoimentos?type=testimonial&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
        showToast('Depoimento excluído com sucesso.');
      }
    } catch {
      showToast('Erro ao excluir depoimento', 'error');
    }
  };

  // Save Partner
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name) {
      showToast('Preencha o nome do parceiro.', 'error');
      return;
    }

    try {
      const itemToSave: PartnerItem = {
        id: editingPartner ? editingPartner.id : `part-${Date.now()}`,
        name: partnerForm.name || '',
        category: partnerForm.category || '',
        imageUrl: cleanImageSrc(partnerForm.imageUrl),
        link: partnerForm.link || '',
        order: Number(partnerForm.order) || (partners.length + 1),
        active: partnerForm.active ?? true
      };

      const res = await fetch('/api/depoimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_partner', item: itemToSave })
      });

      const data = await res.json();
      if (data.success) {
        setPartners(data.partners);
        setIsPartnerModalOpen(false);
        setEditingPartner(null);
        showToast(editingPartner ? 'Parceiro atualizado com sucesso!' : 'Novo parceiro adicionado!');
      } else {
        showToast(data.error || 'Erro ao salvar parceiro', 'error');
      }
    } catch {
      showToast('Erro de conexão ao salvar parceiro', 'error');
    }
  };

  // Delete Partner
  const handleDeletePartner = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente remover o parceiro "${name}"?`)) return;

    try {
      const res = await fetch(`/api/depoimentos?type=partner&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPartners(data.partners);
        showToast('Parceiro removido com sucesso.');
      }
    } catch {
      showToast('Erro ao remover parceiro', 'error');
    }
  };

  const filteredTestimonials = testimonials.filter((item) => {
    const matchesSearch = 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quote.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-brand-cream text-brand-text selection:bg-brand-wine selection:text-white">
      <PanelNavigation 
        activeCount={{
          testimonials: testimonials.length,
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
              PROVA SOCIAL & REDE DE PARCEIROS
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text tracking-tight">
              Depoimentos & Principais Parceiros
            </h1>
            <p className="text-xs text-brand-text-soft mt-1">
              Gerencie os relatos de clientes e as marcas que aparecem nas páginas do site.
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

            {activeTab === 'testimonials' ? (
              <button
                onClick={() => {
                  setEditingTestimonial(null);
                  setTestForm({
                    category: 'casamento',
                    occasion: '',
                    client: '',
                    quote: '',
                    rating: 5,
                    featured: true
                  });
                  setIsTestimonialModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Depoimento</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingPartner(null);
                  setPartnerForm({
                    name: '',
                    category: '',
                    imageUrl: '',
                    link: '',
                    order: partners.length + 1,
                    active: true
                  });
                  setIsPartnerModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-wine-dark transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Parceiro</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-brand-wine/10 max-w-md shadow-xs">
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-brand-wine text-white shadow-xs'
                : 'text-brand-text-soft hover:text-brand-wine'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Depoimentos ({testimonials.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'partners'
                ? 'bg-brand-wine text-white shadow-xs'
                : 'text-brand-text-soft hover:text-brand-wine'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Principais Parceiros ({partners.length})</span>
          </button>
        </div>

        {/* ================= SECTION 1: DEPOIMENTOS ================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-brand-wine/10 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-wine/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente, ocasião ou palavra-chave..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-cream/60 border border-brand-wine/10 text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-brand-cream/60 border border-brand-wine/10 text-xs text-brand-text font-medium focus:outline-none focus:ring-2 focus:ring-brand-wine"
              >
                <option value="all">Todas as Categorias</option>
                <option value="casamento">Casamentos</option>
                <option value="corporativo">Corporativo & Posicionamento</option>
                <option value="casal">Casal & Família</option>
                <option value="evento">Eventos & Aniversários</option>
                <option value="individual">Individual</option>
              </select>
            </div>

            {/* Testimonials List */}
            {loading ? (
              <div className="py-16 text-center text-xs text-brand-text-soft">Carregando depoimentos...</div>
            ) : filteredTestimonials.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-wine/10">
                <MessageSquareQuote className="w-10 h-10 text-brand-wine/30 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-brand-text">Nenhum depoimento encontrado</h3>
                <p className="text-xs text-brand-text-soft mt-1">
                  Clique em &quot;Novo Depoimento&quot; para cadastrar as avaliações dos seus clientes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredTestimonials.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-brand-wine/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-brand-wine/10 text-brand-wine text-[10px] font-bold tracking-wider uppercase">
                          {CATEGORY_MAP[item.category] || item.category}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-brand-wine tracking-wider uppercase block mb-1">
                        {item.occasion}
                      </span>
                      <h4 className="font-serif text-base font-bold text-brand-text mb-3">
                        {item.client}
                      </h4>

                      <p className="text-xs text-brand-text-soft leading-relaxed italic bg-brand-cream/50 p-3.5 rounded-2xl border border-brand-wine/5">
                        {item.quote}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-brand-wine/10">
                      <button
                        onClick={() => {
                          setEditingTestimonial(item);
                          setTestForm(item);
                          setIsTestimonialModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-wine/15 text-brand-text text-xs font-medium hover:bg-brand-cream transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-wine" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(item.id, item.client)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 text-red-700 text-xs font-medium hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 2: PRINCIPAIS PARCEIROS ================= */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-brand-wine/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-text">
                    Círculos de Parceiros no Site
                  </h3>
                  <p className="text-xs text-brand-text-soft">
                    Estes logotipos e fotos são exibidos na animação de carrossel contínuo (&quot;Rede de Confiança / Principais Parceiros&quot;) na página inicial.
                  </p>
                </div>
              </div>

              {/* Visual Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex flex-col items-center text-center p-4 rounded-2xl bg-brand-cream/50 border border-brand-wine/10 hover:border-brand-wine/30 transition-all group"
                  >
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-wine/25 shadow-xs mb-3 bg-white">
                      {partner.imageUrl ? (
                        <Image
                          src={cleanImageSrc(partner.imageUrl)}
                          alt={partner.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-wine/10 text-brand-wine font-serif font-bold text-xl">
                          {partner.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <h4 className="font-serif text-xs font-bold text-brand-text truncate w-full">
                      {partner.name}
                    </h4>
                    <span className="text-[10px] text-brand-wine/80 truncate w-full mb-3">
                      {partner.category || 'Parceiro'}
                    </span>

                    <div className="flex items-center gap-1.5 mt-auto">
                      <button
                        onClick={() => {
                          setEditingPartner(partner);
                          setPartnerForm(partner);
                          setIsPartnerModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white hover:bg-brand-wine hover:text-white text-brand-wine border border-brand-wine/15 transition-all"
                        title="Editar parceiro"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id, partner.name)}
                        className="p-1.5 rounded-lg bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition-all"
                        title="Excluir parceiro"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL TESTIMONIAL ================= */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-wine/20">
            <h3 className="font-serif text-xl font-bold text-brand-text mb-4">
              {editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
            </h3>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Categoria do Serviço
                </label>
                <select
                  value={testForm.category}
                  onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                >
                  <option value="casamento">Casamento</option>
                  <option value="corporativo">Corporativo & Marca</option>
                  <option value="casal">Casal & Família</option>
                  <option value="evento">Eventos & Aniversários</option>
                  <option value="individual">Individual</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Ocasião / Tipo de Trabalho
                </label>
                <input
                  type="text"
                  value={testForm.occasion || ''}
                  onChange={(e) => setTestForm({ ...testForm, occasion: e.target.value })}
                  placeholder="Ex: 1 ANO DE CASADOS ou ENSAIO FOTOGRÁFICO"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Nome do Cliente / Empresa
                </label>
                <input
                  type="text"
                  value={testForm.client || ''}
                  onChange={(e) => setTestForm({ ...testForm, client: e.target.value })}
                  placeholder="Ex: ANDRESSA E DEIVISON ou DRA. CAMILA SANTOS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Depoimento / Mensagem Completa
                </label>
                <textarea
                  rows={4}
                  value={testForm.quote || ''}
                  onChange={(e) => setTestForm({ ...testForm, quote: e.target.value })}
                  placeholder="“Escreva ou cole aqui as palavras do cliente...”"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-wine/10">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-wine/20 text-brand-text hover:bg-brand-cream font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-wine text-white font-bold hover:bg-brand-wine-dark shadow-sm"
                >
                  Salvar Depoimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL PARTNER ================= */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-brand-wine/20">
            <h3 className="font-serif text-xl font-bold text-brand-text mb-4">
              {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
            </h3>

            <form onSubmit={handleSavePartner} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Nome do Parceiro / Marca
                </label>
                <input
                  type="text"
                  value={partnerForm.name || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  placeholder="Ex: Mamtur Viagens"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Ramo de Atuação / Segmento
                </label>
                <input
                  type="text"
                  value={partnerForm.category || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                  placeholder="Ex: Cerimonial, Buffet, Vestidos, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  URL da Imagem / Logo (ou caminho local)
                </label>
                <input
                  type="text"
                  value={partnerForm.imageUrl || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, imageUrl: e.target.value })}
                  placeholder="Ex: /images/portfolio-01.jpg ou https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                />
                <p className="text-[10px] text-brand-text-soft mt-1">
                  Pode usar caminhos de imagens do portfólio (como `/images/portfolio-01.jpg` a `/images/portfolio-06.jpg`) ou links externos.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1 uppercase tracking-wider text-[11px]">
                  Link do Instagram / Site (Opcional)
                </label>
                <input
                  type="url"
                  value={partnerForm.link || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, link: e.target.value })}
                  placeholder="https://www.instagram.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-wine/20 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-wine/10">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-wine/20 text-brand-text hover:bg-brand-cream font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-wine text-white font-bold hover:bg-brand-wine-dark shadow-sm"
                >
                  Salvar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
