import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'depoimentos.json');

export interface TestimonialItem {
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

export interface PartnerItem {
  id: string;
  name: string;
  category?: string;
  imageUrl: string;
  link?: string;
  order?: number;
  active?: boolean;
}

interface DepoimentosData {
  testimonials: TestimonialItem[];
  partners: PartnerItem[];
}

function ensureData(): DepoimentosData {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: DepoimentosData = {
        testimonials: [],
        partners: []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '{"testimonials":[], "partners":[]}');
  } catch (err) {
    console.error('Error reading depoimentos.json:', err);
    return { testimonials: [], partners: [] };
  }
}

function saveData(data: DepoimentosData) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing depoimentos.json:', err);
  }
}

// GET: fetch testimonials and partners
export async function GET(req: NextRequest) {
  const data = ensureData();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type === 'testimonials') {
    return NextResponse.json({ success: true, testimonials: data.testimonials });
  }
  if (type === 'partners') {
    return NextResponse.json({ success: true, partners: data.partners });
  }

  return NextResponse.json({
    success: true,
    testimonials: data.testimonials,
    partners: data.partners
  });
}

// POST: create or update testimonial or partner
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = ensureData();
    const { action, item } = body;

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item não fornecido' }, { status: 400 });
    }

    if (action === 'save_testimonial') {
      const id = item.id || `dep-${Date.now()}`;
      const testimonial: TestimonialItem = {
        ...item,
        id,
        createdAt: item.createdAt || new Date().toISOString()
      };

      const existingIndex = data.testimonials.findIndex((t) => t.id === id);
      if (existingIndex >= 0) {
        data.testimonials[existingIndex] = testimonial;
      } else {
        data.testimonials.unshift(testimonial);
      }

      saveData(data);
      return NextResponse.json({ success: true, testimonial, testimonials: data.testimonials });
    }

    if (action === 'save_partner') {
      const id = item.id || `part-${Date.now()}`;
      const partner: PartnerItem = {
        ...item,
        id,
        order: item.order ?? (data.partners.length + 1),
        active: item.active ?? true
      };

      const existingIndex = data.partners.findIndex((p) => p.id === id);
      if (existingIndex >= 0) {
        data.partners[existingIndex] = partner;
      } else {
        data.partners.push(partner);
      }

      saveData(data);
      return NextResponse.json({ success: true, partner, partners: data.partners });
    }

    return NextResponse.json({ success: false, error: 'Ação inválida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: delete testimonial or partner
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json({ success: false, error: 'Parâmetros ausentes' }, { status: 400 });
    }

    const data = ensureData();

    if (type === 'testimonial') {
      data.testimonials = data.testimonials.filter((t) => t.id !== id);
      saveData(data);
      return NextResponse.json({ success: true, testimonials: data.testimonials });
    }

    if (type === 'partner') {
      data.partners = data.partners.filter((p) => p.id !== id);
      saveData(data);
      return NextResponse.json({ success: true, partners: data.partners });
    }

    return NextResponse.json({ success: false, error: 'Tipo inválido' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
