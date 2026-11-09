import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Proposal, calculateDefaultInstallments, slugify } from '@/lib/propostas';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_FILE = path.join(process.cwd(), 'data', 'propostas.json');

function enrichProposal(proposal: Proposal): Proposal {
  return {
    ...proposal,
    hidePhotoSection: proposal.hidePhotoSection ?? false,
    hideVideoSection: proposal.hideVideoSection ?? false,
    hideConteudoSection: proposal.hideConteudoSection ?? false,
    packages: (proposal.packages || []).map((pkg) => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price),
    })),
    videoPackages: (proposal.videoPackages || []).map((pkg) => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price),
    })),
    conteudoPackages: (proposal.conteudoPackages || []).map((pkg) => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price),
    })),
  };
}

function parseProposalRow(row: any): Proposal | null {
  if (!row) return null;
  let p = row.dados || row.data || row;
  if (typeof p === 'string') {
    try {
      p = JSON.parse(p);
    } catch {
      return null;
    }
  }
  if (!p || typeof p !== 'object') return null;
  if (!p.id && row.id) p.id = row.id;
  return enrichProposal(p);
}

function readLocalDataFile(): Proposal[] {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading propostas.json:', err);
    return [];
  }
}

function writeLocalDataFile(data: Proposal[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing propostas.json:', err);
  }
}

async function getSupabaseProposals(): Promise<{ success: boolean; proposals?: Proposal[]; error?: any }> {
  const supabase = getServerSupabase();
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { data, error } = await supabase
      .from('propostas')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return { success: false, error };
    }

    const proposals = (data || []).map(parseProposalRow).filter(Boolean) as Proposal[];
    return { success: true, proposals };
  } catch (err) {
    return { success: false, error: err };
  }
}

async function autoMigrateLocalToSupabase(supabase: any, localList: Proposal[]) {
  if (!localList || localList.length === 0) return;
  try {
    const rows = localList.map((p) => ({
      id: p.id || `prop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      dados: p,
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString(),
    }));

    await supabase.from('propostas').upsert(rows, { onConflict: 'id' });
    console.log(`Auto-migrated ${rows.length} proposals to Supabase propostas table.`);
  } catch (err) {
    console.warn('Auto-migration notice:', err);
  }
}

// GET: list all proposals or get single by category + slug
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  const supabase = getServerSupabase();
  let list: Proposal[] = [];
  let source: 'supabase' | 'local' = 'local';

  if (supabase) {
    const sbResult = await getSupabaseProposals();
    if (sbResult.success && sbResult.proposals) {
      list = sbResult.proposals;
      source = 'supabase';

      // If Supabase table is empty but local disk has existing proposals, auto-migrate!
      if (list.length === 0) {
        const localList = readLocalDataFile();
        if (localList.length > 0) {
          await autoMigrateLocalToSupabase(supabase, localList);
          const recheck = await getSupabaseProposals();
          if (recheck.success && recheck.proposals && recheck.proposals.length > 0) {
            list = recheck.proposals;
          } else {
            list = localList;
          }
        }
      } else {
        // Keep local backup synced with fresh Supabase data
        writeLocalDataFile(list);
      }
    } else {
      console.warn('Supabase query failed or table not created yet, using local data backup:', sbResult.error);
      list = readLocalDataFile();
    }
  } else {
    list = readLocalDataFile();
  }

  // Filter single proposal by id OR category + slug
  if (id || (category && slug)) {
    let found: Proposal | undefined;
    if (id) {
      found = list.find((p) => p.id === id);
    }
    if (!found && category && slug) {
      const cleanCategory = decodeURIComponent(category).toLowerCase().trim();
      const rawSlug = decodeURIComponent(slug).toLowerCase().trim();
      const normSlug = slugify(rawSlug);

      found = list.find((p) => {
        const pCat = p.category.toLowerCase().trim();
        const pSlug = p.clientSlug.toLowerCase().trim();
        const pNormSlug = slugify(pSlug);
        return (pCat === cleanCategory || slugify(pCat) === slugify(cleanCategory)) && (pSlug === rawSlug || pNormSlug === normSlug);
      });

      if (!found) {
        found = list.find((p) => {
          const pCat = p.category.toLowerCase().trim();
          const pNormSlug = slugify(p.clientSlug || '');
          return (pCat === cleanCategory || slugify(pCat) === slugify(cleanCategory)) && (pNormSlug.includes(normSlug) || normSlug.includes(pNormSlug));
        });
      }

      if (!found) {
        found = list.find((p) => slugify(p.clientSlug || '') === normSlug);
      }
    }

    if (found) {
      const fromAdmin = searchParams.get('admin') === 'true';
      if (!fromAdmin && (!found.status || found.status === 'nova')) {
        found.status = 'visualizada';
        found.viewedAt = new Date().toISOString();
        found.updatedAt = new Date().toISOString();

        // Update status in Supabase if connected
        if (supabase) {
          try {
            await supabase.from('propostas').update({
              dados: found,
              updated_at: found.updatedAt,
            }).eq('id', found.id);
          } catch {}
        }
        writeLocalDataFile(list);
      }

      return NextResponse.json(
        { success: true, proposal: enrichProposal(found), source },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, proposal: null, source },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }

  return NextResponse.json(
    { success: true, proposals: list.map(enrichProposal), source },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

// POST: create or edit proposal
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Proposal;

    if (!body.category || !body.clientSlug || !body.clientName) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios ausentes (categoria, nome e link)' },
        { status: 400 }
      );
    }

    const cleanCategory = body.category.toLowerCase().trim();
    const cleanSlug = body.clientSlug.toLowerCase().trim();
    const now = new Date().toISOString();

    const supabase = getServerSupabase();
    let targetId = body.id;
    let existingDbRowIds: string[] = [];

    // Lookup existing Supabase rows to match ID and remove duplicates
    if (supabase) {
      try {
        const { data: rows } = await supabase.from('propostas').select('*');
        if (rows && rows.length > 0) {
          const matchingRows = rows.filter((r) => {
            if (r.id === body.id) return true;
            const p = parseProposalRow(r);
            if (!p) return false;
            return (
              p.category.toLowerCase() === cleanCategory &&
              p.clientSlug.toLowerCase() === cleanSlug
            );
          });

          if (matchingRows.length > 0) {
            targetId = matchingRows[0].id;
            existingDbRowIds = matchingRows.map((r) => r.id);
          }
        }
      } catch (err) {
        console.warn('Error querying existing rows in Supabase POST:', err);
      }
    }

    // Lookup in local file backup if targetId still not set
    if (!targetId) {
      const localList = readLocalDataFile();
      const localFound = localList.find(
        (p) =>
          p.id === body.id ||
          (p.category.toLowerCase() === cleanCategory &&
            p.clientSlug.toLowerCase() === cleanSlug)
      );
      if (localFound) {
        targetId = localFound.id;
      }
    }

    const finalId = targetId || `prop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const newProposal: Proposal = enrichProposal({
      ...body,
      id: finalId,
      createdAt: body.createdAt || now,
      updatedAt: now,
      isTemplate: false,
    });

    let savedInSupabase = false;
    let supabaseError: any = null;

    if (supabase) {
      try {
        // First upsert the target row
        const { error } = await supabase.from('propostas').upsert({
          id: newProposal.id,
          dados: newProposal,
          updated_at: newProposal.updatedAt,
        }, { onConflict: 'id' });

        if (!error) {
          savedInSupabase = true;
          // Clean up any duplicate rows if they existed with different IDs
          const duplicateIds = existingDbRowIds.filter((id) => id !== finalId);
          if (duplicateIds.length > 0) {
            await supabase.from('propostas').delete().in('id', duplicateIds);
          }
        } else {
          supabaseError = error;
          console.warn('Erro ao salvar no Supabase:', error);
        }
      } catch (err) {
        supabaseError = err;
        console.warn('Exceção ao salvar no Supabase:', err);
      }
    }

    // Always update local disk backup as well
    const list = readLocalDataFile();
    const existingIndex = list.findIndex(
      (p) =>
        p.id === newProposal.id ||
        (p.category.toLowerCase() === cleanCategory &&
          p.clientSlug.toLowerCase() === cleanSlug)
    );
    if (existingIndex >= 0) {
      list[existingIndex] = newProposal;
    } else {
      list.unshift(newProposal);
    }
    writeLocalDataFile(list);

    return NextResponse.json(
      {
        success: true,
        proposal: newProposal,
        source: savedInSupabase ? 'supabase' : 'local',
        supabaseError: supabaseError ? (supabaseError.message || String(supabaseError)) : null,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('Error in POST /api/propostas:', err);
    return NextResponse.json({ success: false, message: 'Erro ao salvar proposta: ' + err.message }, { status: 500 });
  }
}

// PATCH: update status or partial fields
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, category, slug, status } = body;

    const supabase = getServerSupabase();
    let updatedProposal: Proposal | null = null;
    let savedInSupabase = false;

    // Check local disk backup
    const list = readLocalDataFile();
    const index = list.findIndex((p) => {
      if (id && p.id === id) return true;
      if (category && slug && p.category.toLowerCase() === category.toLowerCase() && p.clientSlug.toLowerCase() === slug.toLowerCase()) return true;
      return false;
    });

    if (index >= 0) {
      if (status) {
        list[index].status = status;
        if (status === 'visualizada' && !list[index].viewedAt) {
          list[index].viewedAt = new Date().toISOString();
        }
      }
      list[index].updatedAt = new Date().toISOString();
      updatedProposal = list[index];
      writeLocalDataFile(list);
    }

    // Update in Supabase
    if (supabase) {
      try {
        let targetId = id;
        const { data: rows } = await supabase.from('propostas').select('*');
        const foundRow = (rows || []).find((r) => {
          if (id && r.id === id) return true;
          const p = parseProposalRow(r);
          if (!p) return false;
          return (
            (id && p.id === id) ||
            (category && slug && p.category.toLowerCase() === category.toLowerCase() && p.clientSlug.toLowerCase() === slug.toLowerCase())
          );
        });

        if (foundRow) {
          targetId = foundRow.id;
          const parsed = parseProposalRow(foundRow);
          if (parsed) {
            if (status) {
              parsed.status = status;
              if (status === 'visualizada' && !parsed.viewedAt) parsed.viewedAt = new Date().toISOString();
            }
            parsed.updatedAt = new Date().toISOString();
            updatedProposal = parsed;
          }
        }

        if (targetId && updatedProposal) {
          const { error } = await supabase
            .from('propostas')
            .update({
              dados: updatedProposal,
              updated_at: updatedProposal.updatedAt || new Date().toISOString(),
            })
            .eq('id', targetId);

          if (!error) savedInSupabase = true;
        }
      } catch (err) {
        console.warn('Erro ao atualizar status no Supabase:', err);
      }
    }

    if (!updatedProposal) {
      return NextResponse.json({ success: false, message: 'Proposta não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      proposal: enrichProposal(updatedProposal),
      source: savedInSupabase ? 'supabase' : 'local',
    });
  } catch (err: any) {
    console.error('Error in PATCH /api/propostas:', err);
    return NextResponse.json({ success: false, message: 'Erro ao atualizar proposta: ' + err.message }, { status: 500 });
  }
}

// DELETE: remove a proposal by id or category+slug
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    if (!id && (!category || !slug)) {
      return NextResponse.json(
        { success: false, message: 'Informe o ID ou a Categoria e o Slug para excluir' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    let deletedFromSupabase = false;

    if (supabase) {
      try {
        const { data: rows } = await supabase.from('propostas').select('*');
        const idsToDelete = new Set<string>();

        (rows || []).forEach((r) => {
          if (id && r.id === id) {
            idsToDelete.add(r.id);
          }
          const p = parseProposalRow(r);
          if (p) {
            if (id && p.id === id) {
              idsToDelete.add(r.id);
            }
            if (category && slug) {
              const cleanCategory = category.toLowerCase().trim();
              const cleanSlug = slug.toLowerCase().trim();
              if (
                p.category.toLowerCase() === cleanCategory &&
                p.clientSlug.toLowerCase() === cleanSlug
              ) {
                idsToDelete.add(r.id);
              }
            }
          }
        });

        if (idsToDelete.size > 0) {
          const idList = Array.from(idsToDelete);
          const { error } = await supabase.from('propostas').delete().in('id', idList);
          if (!error) {
            deletedFromSupabase = true;
          } else {
            console.warn('Supabase delete in error:', error);
          }
        }
      } catch (err) {
        console.warn('Erro ao excluir no Supabase:', err);
      }
    }

    // Always remove from local disk backup
    let list = readLocalDataFile();
    list = list.filter((p) => {
      if (id && p.id === id) return false;
      if (
        category &&
        slug &&
        p.category.toLowerCase() === category.toLowerCase() &&
        p.clientSlug.toLowerCase() === slug.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
    writeLocalDataFile(list);

    return NextResponse.json({
      success: true,
      message: 'Proposta excluída com sucesso',
      source: deletedFromSupabase ? 'supabase' : 'local',
    });
  } catch (err: any) {
    console.error('Error in DELETE /api/propostas:', err);
    return NextResponse.json({ success: false, message: 'Erro ao excluir proposta: ' + err.message }, { status: 500 });
  }
}

