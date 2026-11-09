'use client';

import { Proposal, ProposalCategory, STANDARD_TEMPLATES, calculateDefaultInstallments } from './propostas';

const STORAGE_KEY = 'modkovski_propostas_cache_v1';
const TOMBSTONE_STORAGE_KEY = 'modkovski_deleted_proposals_v1';
export const PROPOSAL_SYNC_CHANNEL = 'modkovski_proposals_broadcast_v1';
export const PROPOSAL_CUSTOM_EVENT = 'modkovski:proposal-update';

// Hardcoded permanently deleted proposals to prevent resurrection across browsers and caches
const INITIAL_DELETED_TOMBSTONES = [
  'sample-corp-01',
  'dra-camila-santos',
  'camila-santos',
  'corporativo:dra-camila-santos',
  'corporativo:camila-santos',
  'prop-sample-corp-01',
];

export function getTombstones(): string[] {
  if (typeof window === 'undefined') return INITIAL_DELETED_TOMBSTONES;
  try {
    const raw = localStorage.getItem(TOMBSTONE_STORAGE_KEY);
    const stored: string[] = raw ? JSON.parse(raw) : [];
    const set = new Set([...INITIAL_DELETED_TOMBSTONES, ...stored]);
    return Array.from(set);
  } catch {
    return INITIAL_DELETED_TOMBSTONES;
  }
}

export function addTombstone(id?: string, category?: string, slug?: string) {
  if (typeof window === 'undefined') return;
  try {
    const tombstones = new Set(getTombstones());
    if (id) tombstones.add(id.toLowerCase());
    if (slug) {
      tombstones.add(slug.toLowerCase());
      if (category) {
        tombstones.add(`${category.toLowerCase()}:${slug.toLowerCase()}`);
      }
    }
    localStorage.setItem(TOMBSTONE_STORAGE_KEY, JSON.stringify(Array.from(tombstones)));
  } catch {}
}

export function isTombstoned(p: { id?: string; category?: string; clientSlug?: string; clientName?: string }): boolean {
  const tombstones = getTombstones();
  const id = p.id?.toLowerCase() || '';
  const slug = p.clientSlug?.toLowerCase() || '';
  const category = p.category?.toLowerCase() || '';
  const name = p.clientName?.toLowerCase() || '';
  const catSlug = category && slug ? `${category}:${slug}` : '';

  // Permanent block for Camila Santos
  if (
    slug === 'dra-camila-santos' ||
    slug === 'camila-santos' ||
    id === 'sample-corp-01' ||
    name.includes('camila santos') ||
    catSlug === 'corporativo:dra-camila-santos'
  ) {
    return true;
  }

  for (const t of tombstones) {
    const lt = t.toLowerCase();
    if (id && id === lt) return true;
    if (slug && slug === lt) return true;
    if (catSlug && catSlug === lt) return true;
  }
  return false;
}

function enrichProposal(proposal: Proposal): Proposal {
  return {
    ...proposal,
    hidePhotoSection: proposal.hidePhotoSection ?? false,
    hideVideoSection: proposal.hideVideoSection ?? false,
    hideConteudoSection: proposal.hideConteudoSection ?? false,
    packages: (proposal.packages || []).map((pkg) => ({
      ...pkg,
      installments: pkg.installments || calculateDefaultInstallments(pkg.price),
    })),
    videoPackages: (proposal.videoPackages || []).map((pkg) => ({
      ...pkg,
      installments: pkg.installments || calculateDefaultInstallments(pkg.price),
    })),
    conteudoPackages: (proposal.conteudoPackages || []).map((pkg) => ({
      ...pkg,
      installments: pkg.installments || calculateDefaultInstallments(pkg.price),
    })),
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

  // Check if tombstoned
  if (isTombstoned({ category: cleanCategory, clientSlug: cleanSlug })) {
    return null;
  }

  // Check localStorage if in browser
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list: Proposal[] = JSON.parse(cached);
        const found = list.find(
          (p) =>
            !isTombstoned(p) &&
            p.category.toLowerCase() === cleanCategory &&
            p.clientSlug.toLowerCase() === cleanSlug
        );
        if (found) {
          return enrichProposal({
            ...template,
            ...found,
            hidePhotoSection: found.hidePhotoSection ?? false,
            hideVideoSection: found.hideVideoSection ?? false,
            hideConteudoSection: found.hideConteudoSection ?? false,
            packages: Array.isArray(found.packages) && found.packages.length > 0 ? found.packages : template.packages,
            videoPackages: Array.isArray(found.videoPackages) ? found.videoPackages : (template.videoPackages || []),
            conteudoPackages: Array.isArray(found.conteudoPackages) ? found.conteudoPackages : (template.conteudoPackages || []),
            proposalDate: found.proposalDate || template.proposalDate,
            title: found.title || template.title,
            subtitle: found.subtitle || template.subtitle,
            investmentNote: found.investmentNote !== undefined ? found.investmentNote : template.investmentNote,
            welcomeMessage: found.welcomeMessage !== undefined ? found.welcomeMessage : template.welcomeMessage,
            clientName: found.clientName || cleanSlug,
            clientSlug: found.clientSlug || cleanSlug,
          });
        }
      }
    } catch {}
  }

  // If not found in localStorage cache, return null so ProposalView waits for API/Supabase response
  return null;
}

export async function fetchAllProposals(): Promise<Proposal[]> {
  let serverProposals: Proposal[] = [];
  let serverFetchSuccess = false;

  try {
    const res = await fetch(`/api/propostas?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.proposals)) {
        serverProposals = data.proposals.filter((p: Proposal) => !isTombstoned(p)).map(enrichProposal);
        serverFetchSuccess = true;
      }
    }
  } catch (err) {
    console.warn('Could not fetch proposals from API:', err);
  }

  let localProposals: Proposal[] = [];
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        localProposals = JSON.parse(cached)
          .filter((p: Proposal) => !isTombstoned(p))
          .map(enrichProposal);
      }
    } catch {}
  }

  const map = new Map<string, Proposal>();

  if (serverFetchSuccess) {
    // Server is authoritative source
    serverProposals.forEach((p) => {
      map.set(`${p.category}:${p.clientSlug.toLowerCase()}`, p);
    });

    // Check if any local proposals were created offline and have not yet synced
    localProposals.forEach((p) => {
      const key = `${p.category}:${p.clientSlug.toLowerCase()}`;
      if (!map.has(key) && !isTombstoned(p)) {
        // Only keep if created very recently (within 24 hours) as an unsaved draft
        const createdAtTime = p.createdAt ? new Date(p.createdAt).getTime() : 0;
        const now = Date.now();
        if (now - createdAtTime < 24 * 60 * 60 * 1000) {
          map.set(key, p);
        }
      }
    });
  } else {
    // If offline/server failed, fall back to local cached proposals
    localProposals.forEach((p) => {
      if (!isTombstoned(p)) {
        map.set(`${p.category}:${p.clientSlug.toLowerCase()}`, p);
      }
    });
  }

  const merged = Array.from(map.values());

  // Clean local storage cache: persist authoritative filtered list
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {}
  }

  return merged;
}

export async function fetchProposalBySlug(category: string, slug: string): Promise<Proposal | null> {
  const cleanCategory = category.toLowerCase();
  const cleanSlug = slug.toLowerCase();
  const template = STANDARD_TEMPLATES[cleanCategory as ProposalCategory] || STANDARD_TEMPLATES['individual'];

  // If permanently deleted/tombstoned, do not return or recreate
  if (isTombstoned({ category: cleanCategory, clientSlug: cleanSlug })) {
    return null;
  }

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
        Pragma: 'no-cache',
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.proposal) {
        if (!isTombstoned(data.proposal)) {
          foundProposal = data.proposal;
          updateLocalCache(data.proposal);
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch proposal by slug from API:', err);
  }

  // Fallback 1: localStorage
  if (!foundProposal && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list: Proposal[] = JSON.parse(cached);
        const found = list.find(
          (p) =>
            !isTombstoned(p) &&
            p.category.toLowerCase() === cleanCategory &&
            p.clientSlug.toLowerCase() === cleanSlug
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
      hidePhotoSection: foundProposal.hidePhotoSection ?? false,
      hideVideoSection: foundProposal.hideVideoSection ?? false,
      hideConteudoSection: foundProposal.hideConteudoSection ?? false,
      packages: Array.isArray(foundProposal.packages) ? foundProposal.packages : template.packages,
      videoPackages: Array.isArray(foundProposal.videoPackages) ? foundProposal.videoPackages : (template.videoPackages || []),
      conteudoPackages: Array.isArray(foundProposal.conteudoPackages)
        ? foundProposal.conteudoPackages
        : (template.conteudoPackages || []),
      proposalDate: foundProposal.proposalDate || template.proposalDate,
      title: foundProposal.title || template.title,
      subtitle: foundProposal.subtitle || template.subtitle,
      investmentNote:
        foundProposal.investmentNote !== undefined ? foundProposal.investmentNote : template.investmentNote,
      welcomeMessage:
        foundProposal.welcomeMessage !== undefined ? foundProposal.welcomeMessage : template.welcomeMessage,
      clientName: foundProposal.clientName || formattedName,
      clientSlug: foundProposal.clientSlug || cleanSlug,
    });
  }

  // If proposal is not found on server or local cache, return null so client doesn't see false default prices
  return null;
}

export async function saveProposalAction(proposal: Proposal): Promise<Proposal> {
  const proposalToSave: Proposal = {
    ...proposal,
    updatedAt: new Date().toISOString(),
  };

  try {
    const res = await fetch('/api/propostas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposalToSave),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.proposal) {
        updateLocalCache(data.proposal);
        return data.proposal;
      }
    }
  } catch (err) {
    console.warn('Error saving to API, updating localStorage only:', err);
  }

  // Local fallback save
  updateLocalCache(proposalToSave);
  return proposalToSave;
}

export async function updateProposalStatusAction(
  proposal: Proposal,
  status: Proposal['status']
): Promise<Proposal> {
  const updated: Proposal = {
    ...proposal,
    status,
    viewedAt: status === 'visualizada' && !proposal.viewedAt ? new Date().toISOString() : proposal.viewedAt,
  };

  try {
    const res = await fetch('/api/propostas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: proposal.id,
        category: proposal.category,
        slug: proposal.clientSlug,
        status,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.proposal) {
        updateLocalCache(data.proposal);
        return data.proposal;
      }
    }
  } catch (err) {
    console.warn('Error patching status to API, updating local cache only:', err);
  }

  updateLocalCache(updated);
  return updated;
}

export async function deleteProposalAction(id: string, category?: string, clientSlug?: string): Promise<boolean> {
  // 1. Immediately register tombstone to prevent resurrection
  addTombstone(id, category, clientSlug);

  // 2. Remove from local cache
  deleteFromLocalCache(id, category, clientSlug);

  // 3. Call backend API
  try {
    const query = new URLSearchParams();
    if (id) query.set('id', id);
    if (category) query.set('category', category);
    if (clientSlug) query.set('slug', clientSlug);

    const res = await fetch(`/api/propostas?${query.toString()}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Error deleting proposal from API:', err);
  }

  return true;
}

function updateLocalCache(proposal: Proposal) {
  if (typeof window === 'undefined') return;
  if (isTombstoned(proposal)) return;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    let list: Proposal[] = cached ? JSON.parse(cached) : [];
    list = list.filter((p) => !isTombstoned(p));
    const idx = list.findIndex(
      (p) =>
        p.id === proposal.id ||
        (p.category.toLowerCase() === proposal.category.toLowerCase() &&
          p.clientSlug.toLowerCase() === proposal.clientSlug.toLowerCase())
    );
    if (idx >= 0) {
      list[idx] = proposal;
    } else {
      list.unshift(proposal);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
        if (id && p.id === id) return false;
        if (
          category &&
          clientSlug &&
          p.category.toLowerCase() === category.toLowerCase() &&
          (p.clientSlug.toLowerCase() === clientSlug.toLowerCase() ||
            p.clientSlug.toLowerCase().includes(clientSlug.toLowerCase()) ||
            clientSlug.toLowerCase().includes(p.clientSlug.toLowerCase()))
        ) {
          return false;
        }
        if (isTombstoned(p)) return false;
        return true;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      broadcastProposalSync({
        action: 'delete',
        category,
        slug: clientSlug,
        timestamp: Date.now(),
      });
    }
  } catch {}
}
