import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Proposal, STANDARD_TEMPLATES } from '@/lib/propostas';

const DATA_FILE = path.join(process.cwd(), 'data', 'propostas.json');

function ensureDataFile(): Proposal[] {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      // Seed with an example proposal so the user can see how it works right away
      const initial: Proposal[] = [
        {
          ...STANDARD_TEMPLATES.corporativo,
          id: 'sample-corp-01',
          clientName: 'Dra. Camila Santos',
          clientSlug: 'dra-camila-santos',
          isTemplate: false,
          createdAt: new Date().toISOString(),
          welcomeMessage: 'Olá Dra. Camila! Foi um prazer conversar com você. Esta proposta foi desenhada especialmente para elevar o posicionamento digital da sua clínica com fotos de autoridade e vídeos estratégicos.',
        }
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '[]');
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
    const found = list.find(
      (p) => p.category === category && p.clientSlug.toLowerCase() === cleanSlug
    );
    if (found) {
      return NextResponse.json({ success: true, proposal: found });
    }
    return NextResponse.json({ success: false, message: 'Proposta não encontrada' }, { status: 404 });
  }

  return NextResponse.json({ success: true, proposals: list });
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

    const newProposal: Proposal = {
      ...body,
      id: body.id || `prop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: body.createdAt || new Date().toISOString(),
      isTemplate: false,
    };

    if (existingIndex >= 0) {
      list[existingIndex] = newProposal;
    } else {
      list.unshift(newProposal);
    }

    writeDataFile(list);

    return NextResponse.json({ success: true, proposal: newProposal });
  } catch (err) {
    console.error('Error in POST /api/propostas:', err);
    return NextResponse.json({ success: false, message: 'Erro ao salvar proposta' }, { status: 500 });
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

    if (id) {
      list = list.filter((p) => p.id !== id);
    } else if (category && slug) {
      list = list.filter(
        (p) => !(p.category === category && p.clientSlug.toLowerCase() === slug.toLowerCase())
      );
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
