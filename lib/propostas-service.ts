'use client';

import { Proposal, ProposalCategory, STANDARD_TEMPLATES, calculateDefaultInstallments } from './propostas';

const STORAGE_KEY = 'modkovski_propostas_cache_v1';
export const PROPOSAL_SYNC_CHANNEL = 'modkovski_proposals_broadcast_v1';
export const PROPOSAL_CUSTOM_EVENT = 'modkovski:proposal-update';

function enrichProposal(proposal: Proposal): Proposal {
  return {
    ...proposal,
    packages: (proposal.packages || []).map(pkg => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price)
    })),
    videoPackages: (proposal.videoPackages || []).map(pkg => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price)
    }))
  };
}

export interface ProposalSyncMessage {
  action: 'save' | 'delete' | 'revalidate';
  category?: string;
  slug?: string;
  proposal?: Proposal;
  timestamp: number;
}

export function broadcastProposalSync(msg: ProposalSyncMessage) {
  if (typeof window === 'undefined') return;

  // 1. Dispatch custom event for same window / tab
  try {
    window.dispatchEvent(new CustomEvent(PROPOSAL_CUSTOM_EVENT, { detail: msg }));
  } catch {}

  // 2. BroadcastChannel for cross-tab instant synchronization
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const channel = new BroadcastChannel(PROPOSAL_SYNC_CHANNEL);
      channel.postMessage(msg);
      channel.close();
    } catch {}
  }
}

export function getInitialProposalSnapshot(category: string, slug: string): Proposal | null {
  const cleanCategory = category.toLowerCase();
  const cleanSlug = slug.toLowerCase();
  const template = STANDARD_TEMPLATES[cleanCategory as ProposalCategory] || STANDARD_TEMPLATES['individual'];

  if (cleanSlug === 'padrao') {
    return template;
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list: Proposal[] = JSON.parse(cached);
        const found = list.find(
          (p) => p.category.toLowerCase() === cleanCategory && p.clientSlug.toLowerCase() === cleanSlug
        );
        if (found) {
          return enrichProposal({
            ...template,
            ...found,
            packages: found.packages && found.packages.length > 0 ? found.packages : template.packages,
            videoPackages: found.videoPackages !== undefined ? found.videoPackages : template.videoPackages,
            title: found.title || template.title,
            subtitle: found.subtitle || template.subtitle,
            investmentNote: found.investmentNote || template.investmentNote,
            welcomeMessage: found.welcomeMessage || template.welcomeMessage,
            clientName: found.clientName || cleanSlug,
            clientSlug: cleanSlug,
          });
        }
      }
    } catch {}
  }

  return null;
}

export async function fetchAllProposals(): Promise<Proposal[]> {
  try {
    const res = await fetch(`/api/propostas?_t=${Date.now()}`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.proposals)) {
        const enriched = data.proposals.map(enrichProposal);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
        }
        return enriched;
      }
    }
  } catch (err) {
    console.warn('Could not fetch proposals from API, falling back to localStorage:', err);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list: Proposal[] = JSON.parse(cached);
        return list.map(enrichProposal);
      }
    } catch {}
  }

  return [];
}

export async function fetchProposalBySlug(
  category: string,
  slug: string
): Promise<Proposal | null> {
  const cleanCategory = category.toLowerCase();
  const cleanSlug = slug.toLowerCase();
  const template = STANDARD_TEMPLATES[cleanCategory as ProposalCategory] || STANDARD_TEMPLATES['individual'];

  // If asking for the standard template preview:
  if (cleanSlug === 'padrao' && template) {
    return enrichProposal(template);
  }

  let foundProposal: Proposal | null = null;

  try {
    const res = await fetch(`/api/propostas?category=${cleanCategory}&slug=${cleanSlug}&_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.proposal) {
        foundProposal = data.proposal;
      }
    }
  } catch (err) {
    console.warn('Could not fetch proposal by slug from API:', err);
  }

  // Fallback to localStorage if not found from API
  if (!foundProposal && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list: Proposal[] = JSON.parse(cached);
        const found = list.find(
          (p) => p.category.toLowerCase() === cleanCategory && p.clientSlug.toLowerCase() === cleanSlug
        );
        if (found) {
          foundProposal = found;
        }
      }
    } catch {}
  }

  const formattedName = cleanSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (foundProposal) {
    return enrichProposal({
      ...template,
      ...foundProposal,
      packages: foundProposal.packages && foundProposal.packages.length > 0 ? foundProposal.packages : template.packages,
      videoPackages: foundProposal.videoPackages !== undefined ? foundProposal.videoPackages : template.videoPackages,
      title: foundProposal.title || template.title,
      subtitle: foundProposal.subtitle || template.subtitle,
      investmentNote: foundProposal.investmentNote || template.investmentNote,
      welcomeMessage: foundProposal.welcomeMessage || template.welcomeMessage,
      clientName: foundProposal.clientName || formattedName,
      clientSlug: cleanSlug,
    });
  }

  // Fallback: Always return a valid personalized proposal based on template if not found in DB/localStorage
  const fallbackProp: Proposal = enrichProposal({
    ...template,
    id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    category: (cleanCategory as ProposalCategory) || 'individual',
    clientName: formattedName || 'Cliente',
    clientSlug: cleanSlug,
    isTemplate: false,
    createdAt: new Date().toISOString(),
    packages: template.packages,
    videoPackages: cleanCategory === 'casamento' ? [] : template.videoPackages,
  });
  updateLocalCache(fallbackProp);
  return fallbackProp;
}

export async function saveProposalAction(proposal: Proposal): Promise<Proposal> {
  try {
    const res = await fetch('/api/propostas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.proposal) {
        // update local cache and broadcast
        updateLocalCache(data.proposal);
        return data.proposal;
      }
    }
  } catch (err) {
    console.warn('Error saving to API, updating localStorage only:', err);
  }

  // Local fallback save
  updateLocalCache(proposal);
  return proposal;
}

export async function deleteProposalAction(id: string, category?: string, clientSlug?: string): Promise<boolean> {
  try {
    const query = new URLSearchParams();
    if (id) query.set('id', id);
    if (category) query.set('category', category);
    if (clientSlug) query.set('slug', clientSlug);

    const res = await fetch(`/api/propostas?${query.toString()}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      deleteFromLocalCache(id, category, clientSlug);
      return true;
    }
  } catch (err) {
    console.warn('Error deleting proposal from API:', err);
  }

  deleteFromLocalCache(id, category, clientSlug);
  return true;
}

function updateLocalCache(proposal: Proposal) {
  if (typeof window === 'undefined') return;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    let list: Proposal[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex((p) => p.id === proposal.id || (p.category === proposal.category && p.clientSlug === proposal.clientSlug));
    if (idx >= 0) {
      list[idx] = proposal;
    } else {
      list.unshift(proposal);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Broadcast instant update across tabs and windows
    broadcastProposalSync({
      action: 'save',
      category: proposal.category,
      slug: proposal.clientSlug,
      proposal,
      timestamp: Date.now(),
    });
  } catch {}
}

function deleteFromLocalCache(id: string, category?: string, clientSlug?: string) {
  if (typeof window === 'undefined') return;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      let list: Proposal[] = JSON.parse(cached);
      list = list.filter((p) => {
        if (p.id === id) return false;
        if (category && clientSlug && p.category === category && p.clientSlug.toLowerCase() === clientSlug.toLowerCase()) return false;
        return true;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      // Broadcast instant delete
      broadcastProposalSync({
        action: 'delete',
        category,
        slug: clientSlug,
        timestamp: Date.now(),
      });
    }
  } catch {}
}
