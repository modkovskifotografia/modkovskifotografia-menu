import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Proposal } from '@/lib/propostas';
import { getServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_FILE = path.join(process.cwd(), 'data', 'propostas.json');

const SQL_EDITOR_SCRIPT = `-- ============================================================
-- SQL PARA CRIAR A TABELA NO SUPABASE (EDITOR SQL)
-- Copie e cole este código no SQL Editor do seu painel Supabase
-- ============================================================

-- 1. Cria a tabela 'propostas' onde todos os dados são salvos em uma única coluna JSONB (dados)
CREATE TABLE IF NOT EXISTS public.propostas (
  id TEXT PRIMARY KEY,
  dados JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Cria índices para acelerar a busca dentro da coluna JSON
CREATE INDEX IF NOT EXISTS idx_propostas_category ON public.propostas ((dados->>'category'));
CREATE INDEX IF NOT EXISTS idx_propostas_slug ON public.propostas ((dados->>'clientSlug'));

-- 3. Habilita a Segurança em Nível de Linha (RLS)
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- 4. Cria as políticas de acesso para leitura, criação, edição e exclusão
DROP POLICY IF EXISTS "Permitir leitura publica de propostas" ON public.propostas;
CREATE POLICY "Permitir leitura publica de propostas" 
ON public.propostas FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Permitir criacao de propostas" ON public.propostas;
CREATE POLICY "Permitir criacao de propostas" 
ON public.propostas FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir edicao de propostas" ON public.propostas;
CREATE POLICY "Permitir edicao de propostas" 
ON public.propostas FOR UPDATE 
TO public 
USING (true);

DROP POLICY IF EXISTS "Permitir exclusao de propostas" ON public.propostas;
CREATE POLICY "Permitir exclusao de propostas" 
ON public.propostas FOR DELETE 
TO public 
USING (true);
`;

export async function GET() {
  const configured = isSupabaseConfigured();
  const supabase = getServerSupabase();

  let tableExists = false;
  let count = 0;
  let errorMsg: string | null = null;

  if (supabase) {
    try {
      const { data, error, count: total } = await supabase
        .from('propostas')
        .select('id', { count: 'exact' });

      if (!error) {
        tableExists = true;
        count = total ?? (data?.length || 0);
      } else {
        errorMsg = error.message;
      }
    } catch (err: any) {
      errorMsg = err.message || String(err);
    }
  }

  let localCount = 0;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const list = JSON.parse(content || '[]');
      localCount = Array.isArray(list) ? list.length : 0;
    }
  } catch {}

  return NextResponse.json({
    success: true,
    configured,
    tableExists,
    supabaseProposalCount: count,
    localProposalCount: localCount,
    error: errorMsg,
    sqlEditorScript: SQL_EDITOR_SCRIPT,
  });
}

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase não está configurado. Verifique as variáveis de ambiente.',
      },
      { status: 400 }
    );
  }

  try {
    let localProposals: Proposal[] = [];
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      localProposals = JSON.parse(content || '[]');
    }

    if (!Array.isArray(localProposals) || localProposals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma proposta local encontrada para sincronizar.',
        synced: 0,
      });
    }

    const rows = localProposals.map((p) => ({
      id: p.id || `prop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      dados: p,
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString(),
    }));

    const { error } = await supabase.from('propostas').upsert(rows, { onConflict: 'id' });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao enviar propostas para a tabela 'propostas' no Supabase: ${error.message}. Verifique se executou o script SQL no Supabase.`,
          error: error.message,
          sqlEditorScript: SQL_EDITOR_SCRIPT,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${rows.length} propostas foram sincronizadas com sucesso para o banco de dados do Supabase!`,
      synced: rows.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Erro na sincronização: ' + err.message },
      { status: 500 }
    );
  }
}
