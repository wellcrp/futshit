import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { exec } from 'child_process';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '..', 'src', 'public');
const sourceDataFile = path.join(__dirname, '..', 'src', 'data', 'jogadoresEscalados.json');
const distDataFile = path.join(__dirname, 'data', 'jogadoresEscalados.json');
const dataFiles = Array.from(new Set([sourceDataFile, distDataFile]));
const ADMIN_USER = 'futi';
const ADMIN_PASS_HASH = 'ce4930aa34922b23c8fccaf1b3a9bcd578b0f5a50a1b881520882ed38e5ed5b4';
const AUTH_COOKIE_NAME = 'admin_session';
const AUTH_SECRET = 'secret-key-for-auth-token-change-if-needed';

interface JogoEntry {
  data: string;
  campo: string;
  lista: string[];
}

async function loadData(): Promise<JogoEntry[]> {
  for (const filePath of dataFiles) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      return JSON.parse(raw) as JogoEntry[];
    } catch (e) {
      // tenta o próximo arquivo enquanto algum deles não existir
    }
  }
  return [];
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
  const json = JSON.stringify(arr, null, 2);

  for (const filePath of dataFiles) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, json, 'utf8');
  }
}

function normalizeName(name: string) {
  if (!name) return '';
  // remover marcas de confirmação e normalizar
  return name.replace(/[✓✔✅]/g, '').trim().toLowerCase();
}

function parsePlayerLines(listaTexto: string) {
  return listaTexto
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map((line) => line.replace(/[^[\p{L}\s]+/gu, ' '))
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

app.post('/api/jogos', async (req, res) => {
  const { data, campo, listaTexto } = req.body as { data?: string; campo?: string; listaTexto?: string };
  if (!data || !campo || !listaTexto) return res.status(400).json({ error: 'Parâmetros inválidos' });

  const campoValue = String(campo).trim();
  if (!campoValue) return res.status(400).json({ error: 'Campo obrigatório' });

  const lista = parsePlayerLines(listaTexto);
  if (!lista.length) return res.status(400).json({ error: 'Nenhum jogador válido encontrado' });

  const arr = await loadData();
  arr.push({ data, campo: campoValue, lista });
  await saveData(arr);
  return res.json({ ok: true });
});

app.get('/api/jogos', async (_req, res) => {
  const arr = await loadData();
  return res.json(arr);
});

app.get('/api/jogos/:data', async (req, res) => {
  const { data } = req.params;
  const arr = await loadData();
  const jogo = arr.find((entry) => entry.data === data);
  if (!jogo) return res.status(404).json({ error: 'Jogo não encontrado' });
  return res.json(jogo);
});

app.put('/api/jogos/:data', async (req, res) => {
  const { data } = req.params;
  const { campo, listaTexto } = req.body as { campo?: string; listaTexto?: string };
  if (!campo || !listaTexto) return res.status(400).json({ error: 'Parâmetros inválidos' });

  const campoValue = String(campo).trim();
  if (!campoValue) return res.status(400).json({ error: 'Campo obrigatório' });

  const lista = parsePlayerLines(listaTexto);
  if (!lista.length) return res.status(400).json({ error: 'Nenhum jogador válido encontrado' });

  const arr = await loadData();
  const index = arr.findIndex((entry) => entry.data === data);
  if (index === -1) return res.status(404).json({ error: 'Jogo não encontrado' });

  arr[index].campo = campoValue;
  arr[index].lista = lista;
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
  res.sendFile(path.join(publicPath, 'admin', 'index.html'));
});

app.use('/admin/', requireAuth, express.static(path.join(publicPath, 'admin')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(express.static(publicPath));

app.get('/api/ranking', async (_req, res) => {
  const arr = await loadData();
  const totalGames = arr.length;
  const map = new Map<string, { nome: string; pontos: number; qtdeJogos: number; aproveitamento: number }>();

  for (const entry of arr) {
    if (!Array.isArray(entry.lista)) continue;
    for (const rawName of entry.lista) {
      const n = normalizeName(rawName);
      if (!n) continue;
      const existing = map.get(n) || { nome: rawName.trim(), pontos: 0, qtdeJogos: totalGames, aproveitamento: 0 };
      existing.pontos += 1;
      map.set(n, existing);
    }
  }

  const list = Array.from(map.values())
    .map((player) => ({
      ...player,
      qtdeJogos: totalGames,
      aproveitamento: totalGames ? Number(((player.pontos / totalGames) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.pontos - a.pontos || b.qtdeJogos - a.qtdeJogos);

  res.json(list);
});

app.use(express.static(path.join(__dirname, 'public')));

const defaultPort = process.env.NODE_ENV === 'production' ? 8080 : 3000;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : defaultPort;
app.listen(port, '0.0.0.0', () => {
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
