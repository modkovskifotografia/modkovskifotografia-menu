import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Proposal, ProposalCategory, STANDARD_TEMPLATES, calculateDefaultInstallments } from '@/lib/propostas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_FILE = path.join(process.cwd(), 'data', 'propostas.json');

function enrichProposal(proposal: Proposal): Proposal {
  return {
    ...proposal,
    hidePhotoSection: proposal.hidePhotoSection ?? false,
    hideVideoSection: proposal.hideVideoSection ?? false,
    hideConteudoSection: proposal.hideConteudoSection ?? false,
    packages: (proposal.packages || []).map(pkg => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price)
    })),
    videoPackages: (proposal.videoPackages || []).map(pkg => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price)
    })),
    conteudoPackages: (proposal.conteudoPackages || []).map(pkg => ({
      ...pkg,
      installments: calculateDefaultInstallments(pkg.price)
    }))
  };
}

function ensureDataFile(): Proposal[] {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const maysaProposal: Proposal = {
      id: 'prop-maysa-rickely',
      category: 'casamento',
      clientName: 'Maysa Rickely',
      clientSlug: 'maysa-rickely',
      title: 'Proposta de Cobertura de Casamento',
      subtitle: 'Registros espontâneos, poéticos e inesquecíveis do dia mais emocionante da vida de vocês.',
      welcomeMessage: 'O casamento é o início de um novo capítulo. Estamos preparados para captar cada lágrima de alegria, abraço sincero e sorriso com máxima sensibilidade e atenção aos detalhes.',
      validityDays: 10,
      createdAt: new Date().toISOString(),
      investmentNote: 'Contrato formal com garantia de data. Pagamento facilitado em até 12x no cartão ou entrada de 30% + parcelas.',
      isTemplate: false,
      packages: [
        {
          id: 'cas-01',
          name: 'Cobertura Essencial',
          highlight: false,
          price: 'R$ 650',
          paymentMethod: 'Pix',
          duration: '2 horas de cobertura',
          features: [
            '40 fotos selecionadas',
            '1 vídeo de até 1min30',
            'Registro dos principais momentos',
            'Prazo de entrega de até 10 dias',
            'Foto extra R$ 25,00'
          ],
          installments: calculateDefaultInstallments('R$ 650')
        },
        {
          id: 'cas-02',
          name: 'Cobertura Especial',
          highlight: false,
          price: 'R$ 750',
          paymentMethod: 'Pix',
          duration: '2 horas de cobertura',
          features: [
            '60 fotos selecionadas',
            '1 vídeos de até 1min30',
            'Cobertura ampliada da cerimônia',
            'Prazo de entrega de até 15 dias',
            'Foto extra R$ 23,00'
          ],
          installments: calculateDefaultInstallments('R$ 750')
        },
        {
          id: 'cas-03',
          name: 'Cobertura Completa',
          highlight: false,
          price: 'R$ 950',
          paymentMethod: 'Pix',
          duration: '3 horas de cobertura',
          features: [
            '80 fotos selecionadas',
            '2 vídeos de até 1min30',
            'Maior tempo de cobertura',
            'Prazo de entrega de até 20 dias',
            'Foto extra R$ 20,00'
          ],
          installments: calculateDefaultInstallments('R$ 950')
        },
        {
          id: 'cas-04',
          name: 'Para guardar tudo.',
          highlight: true,
          price: 'R$ 1.350',
          paymentMethod: 'Pix',
          duration: '2 horas de Making Of da noiva + 4 horas de cobertura',
          features: [
            'Todas as fotos realizadas durante a cobertura',
            'Média de aproximadamente 200 fotos',
            'Making Of da noiva',
            '3 vídeos de até 1min30',
            'Cobertura completa do evento',
            'Prazo de entrega de até 25 dias'
          ],
          extraNote: 'Porque você não precisa escolher quais memórias merecem permanecer.',
          installments: calculateDefaultInstallments('R$ 1.350')
        }
      ]
    };

    let list: Proposal[] = [];
    if (!fs.existsSync(DATA_FILE)) {
      list = [
        maysaProposal,
        {
          ...STANDARD_TEMPLATES.corporativo,
          id: 'sample-corp-01',
          clientName: 'Dra. Camila Santos',
          clientSlug: 'dra-camila-santos',
          isTemplate: false,
          createdAt: new Date().toISOString(),
          welcomeMessage: 'Olá Dra. Camila! Foi um prazer conversar com você. Esta proposta foi desenhada especialmente para elevar o posicionamento digital da sua clínica com fotos de autoridade e vídeos estratégicos.,',
        }
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } else {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      list = JSON.parse(content || '[]');
    }
    return list;
  } catch (err) {
    console.error('Error reading propostas.json:', err);
    return [];
  }
}

function writeDataFile(data: Proposal[]) {
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

// GET: list all proposals or get single by category + slug
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  const list = ensureDataFile();

  if (category && slug) {
    const cleanSlug = slug.toLowerCase().trim();
    let found = list.find(
      (p) => p.category === category && p.clientSlug.toLowerCase() === cleanSlug
    );
    if (!found) {
      // try partial match or startsWith
      found = list.find(
        (p) => p.category === category && (p.clientSlug.toLowerCase().includes(cleanSlug) || cleanSlug.includes(p.clientSlug.toLowerCase()))
      );
    }
    if (found) {
      // Auto-update status to visualizada if client views and it was nova or unset
      const fromAdmin = searchParams.get('admin') === 'true';
      if (!fromAdmin && (!found.status || found.status === 'nova')) {
        found.status = 'visualizada';
        found.viewedAt = new Date().toISOString();
        writeDataFile(list);
      }
      return NextResponse.json(
        { success: true, proposal: enrichProposal(found) },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }
    
    // If not found in file, return null without creating or writing any fake proposal to disk
    return NextResponse.json(
      { success: true, proposal: null },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }

  return NextResponse.json(
    { success: true, proposals: list.map(enrichProposal) },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

// POST: create new proposal
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Proposal;

    if (!body.category || !body.clientSlug || !body.clientName) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios ausentes (categoria, nome e link)' },
        { status: 400 }
      );
    }

    const list = ensureDataFile();

    // Check if duplicate slug in same category exists
    const existingIndex = list.findIndex(
      (p) => p.category === body.category && p.clientSlug.toLowerCase() === body.clientSlug.toLowerCase()
    );

    const newProposal: Proposal = enrichProposal({
      ...body,
      id: body.id || `prop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString(),
      isTemplate: false,
    });

    if (existingIndex >= 0) {
      list[existingIndex] = newProposal;
    } else {
      list.unshift(newProposal);
    }

    writeDataFile(list);

    return NextResponse.json(
      { success: true, proposal: newProposal },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err) {
    console.error('Error in POST /api/propostas:', err);
    return NextResponse.json({ success: false, message: 'Erro ao salvar proposta' }, { status: 500 });
  }
}

// PATCH: update status or partial fields
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, category, slug, status } = body;

    const list = ensureDataFile();
    const index = list.findIndex((p) => {
      if (id && p.id === id) return true;
      if (category && slug && p.category === category && p.clientSlug.toLowerCase() === slug.toLowerCase()) return true;
      return false;
    });

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Proposta não encontrada' }, { status: 404 });
    }

    if (status) {
      list[index].status = status;
      if (status === 'visualizada' && !list[index].viewedAt) {
        list[index].viewedAt = new Date().toISOString();
      }
    }

    writeDataFile(list);
    return NextResponse.json({ success: true, proposal: enrichProposal(list[index]) });
  } catch (err) {
    console.error('Error in PATCH /api/propostas:', err);
    return NextResponse.json({ success: false, message: 'Erro ao atualizar proposta' }, { status: 500 });
  }
}

// DELETE: remove a proposal by id or category+slug
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    let list = ensureDataFile();

    if (id || (category && slug)) {
      list = list.filter((p) => {
        if (id && p.id === id) return false;
        if (category && slug && p.category.toLowerCase() === category.toLowerCase() && (
          p.clientSlug.toLowerCase() === slug.toLowerCase() ||
          p.clientSlug.toLowerCase().includes(slug.toLowerCase()) ||
          slug.toLowerCase().includes(p.clientSlug.toLowerCase())
        )) return false;
        return true;
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Informe o ID ou a Categoria e o Slug para excluir' },
        { status: 400 }
      );
    }

    writeDataFile(list);

    return NextResponse.json({ success: true, message: 'Proposta excluída com sucesso' });
  } catch (err) {
    console.error('Error in DELETE /api/propostas:', err);
    return NextResponse.json({ success: false, message: 'Erro ao excluir proposta' }, { status: 500 });
  }
}
