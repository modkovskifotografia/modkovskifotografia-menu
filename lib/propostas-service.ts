'use client';

import { Proposal, ProposalCategory, STANDARD_TEMPLATES } from './propostas';

const STORAGE_KEY = 'modkovski_propostas_cache_v1';

export async function fetchAllProposals(): Promise<Proposal[]> {
  try {
    const res = await fetch('/api/propostas', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.proposals)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.proposals));
        }
        return data.proposals;
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
        return JSON.parse(cached);
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
    return template;
  }

  let foundProposal: Proposal | null = null;

  try {
    const res = await fetch(`/api/propostas?category=${cleanCategory}&slug=${cleanSlug}`, {
      cache: 'no-store',
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
    return {
      ...template,
      ...foundProposal,
      packages: cleanCategory === 'casamento' 
        ? template.packages 
        : (foundProposal.packages && foundProposal.packages.length > 0 ? foundProposal.packages : template.packages),
      videoPackages: cleanCategory === 'casamento' 
        ? [] 
        : (foundProposal.videoPackages !== undefined ? foundProposal.videoPackages : template.videoPackages),
      title: cleanCategory === 'casamento' ? template.title : (foundProposal.title || template.title),
      subtitle: cleanCategory === 'casamento' ? template.subtitle : (foundProposal.subtitle || template.subtitle),
      investmentNote: cleanCategory === 'casamento' ? template.investmentNote : (foundProposal.investmentNote || template.investmentNote),
      welcomeMessage: cleanCategory === 'casamento' ? template.welcomeMessage : (foundProposal.welcomeMessage || template.welcomeMessage),
      clientName: foundProposal.clientName || formattedName,
      clientSlug: cleanSlug,
    };
  }

  // Fallback: Always return a valid personalized proposal based on template if not found in DB/localStorage
  return {
    ...template,
    id: `dynamic-${cleanCategory}-${cleanSlug}`,
    category: (cleanCategory as ProposalCategory) || 'individual',
    clientName: formattedName || 'Cliente',
    clientSlug: cleanSlug,
    isTemplate: false,
    packages: template.packages,
    videoPackages: cleanCategory === 'casamento' ? [] : template.videoPackages,
  };
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
        // update local cache
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
    }
  } catch {}
}
