import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'contratos.json');

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

interface ContratosData {
  templates: ContractTemplate[];
  contracts: IssuedContract[];
}

function ensureData(): ContratosData {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: ContratosData = {
        templates: [],
        contracts: []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '{"templates":[], "contracts":[]}');
  } catch (err) {
    console.error('Error reading contratos.json:', err);
    return { templates: [], contracts: [] };
  }
}

function saveData(data: ContratosData) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing contratos.json:', err);
  }
}

// GET: list templates and issued contracts
export async function GET(req: NextRequest) {
  const data = ensureData();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const found = data.contracts.find((c) => c.id === id);
    if (found) {
      return NextResponse.json({ success: true, contract: found });
    }
  }

  return NextResponse.json({
    success: true,
    templates: data.templates,
    contracts: data.contracts
  });
}

// POST: save or update contract or template
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = ensureData();
    const { action, item } = body;

    if (!item) {
      return NextResponse.json({ success: false, error: 'Dados não fornecidos' }, { status: 400 });
    }

    if (action === 'save_contract') {
      const id = item.id || `ctr-${Date.now()}`;
      const contract: IssuedContract = {
        ...item,
        id,
        createdAt: item.createdAt || new Date().toISOString(),
        status: item.status || 'rascunho'
      };

      const existingIndex = data.contracts.findIndex((c) => c.id === id);
      if (existingIndex >= 0) {
        data.contracts[existingIndex] = contract;
      } else {
        data.contracts.unshift(contract);
      }

      saveData(data);
      return NextResponse.json({ success: true, contract, contracts: data.contracts });
    }

    if (action === 'save_template') {
      const id = item.id || `tpl-${Date.now()}`;
      const template: ContractTemplate = {
        ...item,
        id
      };

      const existingIndex = data.templates.findIndex((t) => t.id === id);
      if (existingIndex >= 0) {
        data.templates[existingIndex] = template;
      } else {
        data.templates.push(template);
      }

      saveData(data);
      return NextResponse.json({ success: true, template, templates: data.templates });
    }

    return NextResponse.json({ success: false, error: 'Ação desconhecida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: delete contract or template
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json({ success: false, error: 'Parâmetros ausentes' }, { status: 400 });
    }

    const data = ensureData();

    if (type === 'contract') {
      data.contracts = data.contracts.filter((c) => c.id !== id);
      saveData(data);
      return NextResponse.json({ success: true, contracts: data.contracts });
    }

    if (type === 'template') {
      data.templates = data.templates.filter((t) => t.id !== id);
      saveData(data);
      return NextResponse.json({ success: true, templates: data.templates });
    }

    return NextResponse.json({ success: false, error: 'Tipo inválido' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
