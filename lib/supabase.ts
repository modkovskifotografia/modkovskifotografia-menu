import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Valida se uma string é uma URL HTTP/HTTPS válida para o Supabase
 */
export function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.includes('your-project') || trimmed === 'MY_SUPABASE_URL') return false;
  try {
    const parsed = new URL(trimmed);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Retorna se o Supabase está adequadamente configurado com chaves válidas.
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    isValidSupabaseUrl(supabaseUrl) &&
    supabaseKey &&
    supabaseKey.trim().length > 10 &&
    !supabaseKey.includes('your-anon-key') &&
    !supabaseKey.includes('your-publishable-key')
  );
}

/**
 * Retorna o cliente Supabase inicializado com seguranca (Lazy Initialization).
 * Retorna null silenciosamente caso as chaves nao estejam configuradas ou sejam invalidas.
 */
export function getSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseKey || supabaseKey.length < 10) {
    return null;
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(supabaseUrl!, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });
    } catch {
      supabaseClient = null;
    }
  }

  return supabaseClient;
}

/**
 * Retorna o cliente Supabase para o lado do servidor (API routes),
 * utilizando a service role key se disponivel (para operacoes administrativas sem restricoes de RLS),
 * ou as chaves publicas/anon.
 */
export function getServerSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseKey || supabaseKey.length < 10) {
    return null;
  }

  try {
    return createClient(supabaseUrl!, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  } catch {
    return null;
  }
}

/**
 * Obtém a URL pública e uma Signed URL de reserva para arquivos no Supabase Storage.
 * A Signed URL permite carregar o vídeo mesmo se o bucket estiver configurado como privado.
 */
export async function getStorageMediaUrls(
  bucketName: string,
  fileName: string
): Promise<{ publicUrl: string; signedUrl?: string; isPrivate?: boolean }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { publicUrl: '' };
  }

  try {
    const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    const publicUrl = publicData?.publicUrl || '';

    let signedUrl: string | undefined;
    try {
      // Cria uma Signed URL com validade estendida (1 ano)
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, 60 * 60 * 24 * 365);

      if (!signedError && signedData?.signedUrl) {
        signedUrl = signedData.signedUrl;
      }
    } catch {
      // Ignora silenciosamente se o método não estiver disponível
    }

    return { publicUrl, signedUrl };
  } catch {
    return { publicUrl: '' };
  }
}
