import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';

const resolveDns = promisify(dns.resolve);

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!supabaseUrl) {
    return NextResponse.json({
      connected: false,
      status: 'missing_url',
      message: 'A variável NEXT_PUBLIC_SUPABASE_URL não está configurada.',
      details: { supabaseUrl: null, hasKey: Boolean(supabaseKey) }
    });
  }

  let hostname = '';
  try {
    const parsed = new URL(supabaseUrl);
    hostname = parsed.hostname;
  } catch {
    return NextResponse.json({
      connected: false,
      status: 'invalid_url_format',
      message: `A URL do Supabase "${supabaseUrl}" é inválida. Formato esperado: https://[project-ref].supabase.co`,
      details: { supabaseUrl, hostname: null }
    });
  }

  // 1. Teste de Resolução DNS
  let dnsOk = false;
  let dnsError: string | null = null;
  try {
    await resolveDns(hostname);
    dnsOk = true;
  } catch (err: any) {
    dnsError = err?.code || err?.message || 'DNS_FAILED';
  }

  if (!dnsOk) {
    return NextResponse.json({
      connected: false,
      status: 'project_paused_or_dns_not_found',
      message:
        'O endereço do Supabase não foi encontrado na internet. No plano gratuito do Supabase, projetos ficam PAUSADOS após 7 dias de inatividade.',
      actionNeeded:
        'Para reativar: acesse https://supabase.com/dashboard, abra o seu projeto e clique no botão "Restore project" / "Unpause project". Leva cerca de 1 a 2 minutos para reativar.',
      details: {
        supabaseUrl,
        hostname,
        dnsError,
        isPausedLikely: dnsError === 'ENOTFOUND'
      }
    });
  }

  // 2. Teste de Conexão com a Chave de API
  if (!supabaseKey) {
    return NextResponse.json({
      connected: false,
      status: 'missing_key',
      message: 'A chave NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada.',
      details: { supabaseUrl, hostname, dnsOk: true }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // Testar lista de arquivos no bucket 'portfolio'
    const targetBuckets = ['portfolio', 'videos', 'midias', 'media'];
    let foundBucket: string | null = null;
    let files: { name: string; id?: string | null }[] = [];

    for (const b of targetBuckets) {
      const { data, error } = await supabase.storage.from(b).list('', { limit: 20 });
      if (!error && data && data.length > 0) {
        foundBucket = b;
        files = data.map((f) => ({ name: f.name, id: f.id }));
        break;
      }
    }

    if (foundBucket && files.length > 0) {
      return NextResponse.json({
        connected: true,
        status: 'ok',
        message: `Conexão bem-sucedida! Encontrados ${files.length} arquivos no bucket "${foundBucket}".`,
        details: {
          supabaseUrl,
          bucket: foundBucket,
          filesCount: files.length,
          filesList: files.map((f) => f.name)
        }
      });
    }

    // Se o bucket não tiver arquivos ou não foi encontrado
    return NextResponse.json({
      connected: true,
      status: 'bucket_empty_or_private',
      message: 'Conectado ao Supabase, mas nenhum arquivo foi encontrado nos buckets de mídia (portfolio/videos).',
      details: {
        supabaseUrl,
        testedBuckets: targetBuckets
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      status: 'connection_error',
      message: `Erro ao conectar com a API do Supabase: ${err?.message || err}`,
      details: { supabaseUrl, error: err?.message || String(err) }
    });
  }
}
