import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isTokenValid } from '@/lib/auth';

const AUTH_FILE = path.join(process.cwd(), 'data', 'admin-auth.json');

interface AuthConfig {
  username: string;
  passwordHash: string;
  allowedEmails: string[];
}

const DEFAULT_AUTH: AuthConfig = {
  username: 'alessandra',
  passwordHash: '#0415',
  allowedEmails: ['alemodkovskifotografia@gmail.com', 'alessandra'],
};

function getAuthConfig(): AuthConfig {
  try {
    const dir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(AUTH_FILE)) {
      fs.writeFileSync(AUTH_FILE, JSON.stringify(DEFAULT_AUTH, null, 2), 'utf-8');
      return DEFAULT_AUTH;
    }
    const content = fs.readFileSync(AUTH_FILE, 'utf-8');
    return JSON.parse(content || '{}');
  } catch (err) {
    console.error('Error reading admin-auth.json:', err);
    return DEFAULT_AUTH;
  }
}

function saveAuthConfig(config: AuthConfig) {
  try {
    const dir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(AUTH_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin-auth.json:', err);
  }
}

// GET: Check if session cookie is active or validate a token
export async function GET(req: NextRequest) {
  const token = 
    req.nextUrl.searchParams.get('token') ||
    req.cookies.get('modkovski_admin_session')?.value ||
    req.cookies.get('modkovski_admin_session_lax')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '') ||
    req.headers.get('x-admin-token');

  if (token && isTokenValid(token)) {
    return NextResponse.json({ authenticated: true, user: 'alessandra', token });
  }
  return NextResponse.json({ authenticated: false, message: 'Sessão expirada ou não autenticada' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const config = getAuthConfig();

    // LOGIN ACTION
    if (action === 'login') {
      const { username, password } = body;
      const cleanUser = (username || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      const validUser = 
        cleanUser === config.username.toLowerCase() ||
        config.allowedEmails.map(e => e.toLowerCase()).includes(cleanUser) ||
        cleanUser === 'alessandra' ||
        cleanUser === 'admin' ||
        cleanUser === 'alemodkovskifotografia@gmail.com';

      // Strictly validate only against the configured password hash
      const validPass = cleanPass === config.passwordHash;

      if (validUser && validPass) {
        // Return session token with timestamp and salt
        const token = `modkovski_session_${config.username}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        const response = NextResponse.json({
          success: true,
          token,
          username: config.username,
          expiresInDays: 30,
          message: 'Login realizado com sucesso',
        });

        // Set auth session cookie compatible with both standalone browser and iframes
        response.cookies.set({
          name: 'modkovski_admin_session',
          value: token,
          path: '/',
          httpOnly: false,
          sameSite: 'none',
          secure: true,
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        // Additional fallback cookie for standard top-level browsing
        response.cookies.set({
          name: 'modkovski_admin_session_lax',
          value: token,
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
      }

      return NextResponse.json(
        { success: false, message: 'Usuário ou senha incorretos. Apenas a Alessandra possui acesso.' },
        { status: 401 }
      );
    }

    // LOGOUT ACTION
    if (action === 'logout') {
      const response = NextResponse.json({
        success: true,
        message: 'Sessão encerrada com sucesso',
      });

      response.cookies.set({
        name: 'modkovski_admin_session',
        value: '',
        path: '/',
        httpOnly: false,
        sameSite: 'none',
        secure: true,
        maxAge: 0,
      });

      response.cookies.set({
        name: 'modkovski_admin_session_lax',
        value: '',
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 0,
      });

      return response;
    }

    // CHANGE PASSWORD ACTION
    if (action === 'change-password') {
      const { currentPassword, newPassword, newUsername } = body;
      const cleanCurrent = (currentPassword || '').trim();
      const cleanNew = (newPassword || '').trim();

      const validCurrent = cleanCurrent === config.passwordHash;

      if (!validCurrent) {
        return NextResponse.json(
          { success: false, message: 'A senha atual informada está incorreta' },
          { status: 400 }
        );
      }

      if (!cleanNew || cleanNew.length < 4) {
        return NextResponse.json(
          { success: false, message: 'A nova senha deve ter no mínimo 4 caracteres' },
          { status: 400 }
        );
      }

      const updated: AuthConfig = {
        ...config,
        passwordHash: cleanNew,
        username: newUsername ? newUsername.trim() : config.username,
      };

      saveAuthConfig(updated);

      return NextResponse.json({
        success: true,
        message: 'Senha alterada com sucesso!',
        username: updated.username,
      });
    }

    return NextResponse.json({ success: false, message: 'Ação inválida' }, { status: 400 });
  } catch (err) {
    console.error('Error in /api/admin/auth:', err);
    return NextResponse.json({ success: false, message: 'Erro no servidor' }, { status: 500 });
  }
}
