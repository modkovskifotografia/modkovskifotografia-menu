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

  // If asking for the standard template preview:
  if (cleanSlug === 'padrao' && STANDARD_TEMPLATES[cleanCategory as ProposalCategory]) {
    return STANDARD_TEMPLATES[cleanCategory as ProposalCategory];
  }

  try {
    const res = await fetch(`/api/propostas?category=${cleanCategory}&slug=${cleanSlug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.proposal) {
        return data.proposal;
      }
    }
  } catch (err) {
    console.warn('Could not fetch proposal by slug from API:', err);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list: Proposal[] = JSON.parse(cached);
        const found = list.find(
          (p) => p.category.toLowerCase() === cleanCategory && p.clientSlug.toLowerCase() === cleanSlug
        );
        if (found) return found;
      }
    } catch {}
  }

  return null;
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

export async function deleteProposalAction(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/propostas?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      deleteFromLocalCache(id);
      return true;
    }
  } catch (err) {
    console.warn('Error deleting proposal from API:', err);
  }

  deleteFromLocalCache(id);
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

function deleteFromLocalCache(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      let list: Proposal[] = JSON.parse(cached);
      list = list.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {}
}
