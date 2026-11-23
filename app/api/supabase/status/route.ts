import { NextResponse } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const configured = isSupabaseConfigured();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  if (!configured) {
    return NextResponse.json({
      connected: false,
      configured: false,
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : null,
      message: 'Supabase não está configurado. As variáveis NEXT_PUBLIC_SUPABASE_URL e as chaves de acesso não foram definidas ou são inválidas.',
      actionRequired: 'Configure as chaves do Supabase no painel de Secrets/Ambiente ou utilize o sistema com o backup local automático (propostas.json).'
    });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({
      connected: false,
      configured: true,
      message: 'Falha ao inicializar o cliente Supabase.'
    });
  }

  try {
    const { data, error } = await supabase.from('propostas').select('id').limit(1);

    if (error) {
      return NextResponse.json({
        connected: false,
        configured: true,
        tableExists: false,
        error: error.message,
        code: error.code,
        instructions: 'A conexão com o Supabase foi estabelecida, mas a tabela "propostas" não foi encontrada ou não possui permissão. Crie a tabela no SQL Editor do Supabase executando o script SQL fornecido na aba de Sincronização.'
      });
    }

    return NextResponse.json({
      connected: true,
      configured: true,
      tableExists: true,
      sampleCount: data?.length || 0,
      message: 'Supabase conectado com sucesso e tabela "propostas" pronta para uso!'
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      configured: true,
      error: err.message || String(err),
      instructions: 'Erro de conexão de rede ou DNS com o Supabase. Verifique se a URL do projeto está correta e ativa.'
    });
  }
}
