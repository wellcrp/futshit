import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { exec } from 'child_process';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataFile = path.join(__dirname, 'data', 'jogadoresEscalados.json');
const ADMIN_USER = 'futi';
const ADMIN_PASS_HASH = 'ce4930aa34922b23c8fccaf1b3a9bcd578b0f5a50a1b881520882ed38e5ed5b4';
const AUTH_COOKIE_NAME = 'admin_session';
const AUTH_SECRET = 'secret-key-for-auth-token-change-if-needed';

async function loadData() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createSessionToken(user: string) {
  return crypto.createHmac('sha256', AUTH_SECRET).update(user).digest('hex');
}

function parseCookies(cookieHeader: string | undefined) {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').map(cookie => cookie.trim()).reduce((acc: Record<string,string>, cookie) => {
    const [name, ...rest] = cookie.split('=');
    acc[name] = rest.join('=');
    return acc;
  }, {});
}

function isAuthenticated(req: express.Request) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[AUTH_COOKIE_NAME];
  return token === createSessionToken(ADMIN_USER);
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (isAuthenticated(req)) {
    return next();
  }
  res.redirect('/login');
}

async function saveData(arr: any[]) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(arr, null, 2), 'utf8');
}

function normalizeName(name: string) {
  if (!name) return '';
  // remover marcas de confirmação e normalizar
  return name.replace(/[✓✔✅]/g, '').trim().toLowerCase();
}

app.post('/api/jogos', async (req, res) => {
  const { data, listaTexto } = req.body as { data?: string; listaTexto?: string };
  if (!data || !listaTexto) return res.status(400).json({ error: 'Parâmetros inválidos' });

  const lista = listaTexto
    .split(/\r?\n/)
    .map((l) => l.replace(/^[^\p{L}]+/u, ''))
    .map((l) => l.trim())
    .filter(Boolean);

  const arr = await loadData();
  arr.push({ data, lista });
  await saveData(arr);
  return res.json({ ok: true });
});

app.get('/login', (_req, res) => {
  res.send(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Login Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body class="bg-light">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <h4 class="card-title mb-3">Login do Painel Admin</h4>
              <p class="text-muted">Digite suas credenciais para acessar o admin.</p>
              <form method="POST" action="/login">
                <div class="mb-3">
                  <label class="form-label">Usuário</label>
                  <input name="username" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Senha</label>
                  <input name="password" type="password" class="form-control" required>
                </div>
                <button class="btn btn-primary">Entrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (username !== ADMIN_USER || hashPassword(password || '') !== ADMIN_PASS_HASH) {
    return res.status(401).send('Credenciais inválidas');
  }
  res.setHeader('Set-Cookie', `${AUTH_COOKIE_NAME}=${createSessionToken(ADMIN_USER)}; HttpOnly; Path=/`);
  res.redirect('/admin/');
});

app.get('/admin', requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.use('/admin/', requireAuth, express.static(path.join(__dirname, 'public', 'admin')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ranking', async (_req, res) => {
  const arr = await loadData();
  const map = new Map<string, { nome: string; pontos: number; qtdeJogos: number }>();

  for (const entry of arr) {
    if (!Array.isArray(entry.lista)) continue;
    for (const rawName of entry.lista) {
      const n = normalizeName(rawName);
      if (!n) continue;
      const existing = map.get(n) || { nome: rawName.trim(), pontos: 0, qtdeJogos: 0 };
      existing.pontos += 1;
      existing.qtdeJogos += 1;
      map.set(n, existing);
    }
  }
  const list = Array.from(map.values()).sort((a, b) => b.pontos - a.pontos || b.qtdeJogos - a.qtdeJogos);
  res.json(list);
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  const url = `http://localhost:${port}/admin/`;
  try {
    const platform = process.platform;
    if (platform === 'win32') exec(`start "" "${url}"`);
    else if (platform === 'darwin') exec(`open "${url}"`);
    else exec(`xdg-open "${url}"`);
  } catch (e) {
    console.error('Não foi possível abrir o navegador automaticamente:', e);
  }
});
