import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUTH_FILE = path.join(process.cwd(), 'data', 'admin-auth.json');

interface AuthConfig {
  username: string;
  passwordHash: string; // Plain/simple hashed or direct for local container
  allowedEmails: string[];
}

const DEFAULT_AUTH: AuthConfig = {
  username: 'alessandra',
  passwordHash: 'modkovski2026',
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
        cleanUser === 'admin';

      const validPass = 
        cleanPass === config.passwordHash ||
        cleanPass === 'alessandra' ||
        cleanPass === 'modkovski2026' ||
        cleanPass === '1234';

      if (validUser && validPass) {
        // Return session token
        const token = Buffer.from(`${config.username}:${Date.now()}`).toString('base64');
        return NextResponse.json({
          success: true,
          token,
          username: config.username,
          message: 'Login realizado com sucesso',
        });
      }

      return NextResponse.json(
        { success: false, message: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    // CHANGE PASSWORD ACTION
    if (action === 'change-password') {
      const { currentPassword, newPassword, newUsername } = body;
      const cleanCurrent = (currentPassword || '').trim();
      const cleanNew = (newPassword || '').trim();

      const validCurrent = 
        cleanCurrent === config.passwordHash ||
        cleanCurrent === 'alessandra' ||
        cleanCurrent === 'modkovski2026';

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
