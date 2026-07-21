/**
 * ZapClin — cliente OAuth Google Sheets (Desktop).
 *
 * Reusa o mesmo token do projeto:
 *   C:\Users\riboc\Projects\google-drive-sheets-auth
 *
 * Credenciais esperadas (igual Movi):
 *   %USERPROFILE%\.config\google-api\token.json
 *   %USERPROFILE%\.config\google-api\client_secret.json  (ou credentials.json)
 *
 * Pré-requisito: npm run auth na pasta google-drive-sheets-auth
 * Escopo necessário para escrita: spreadsheets (não só readonly).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

/** Planilha produção ZapClin */
const ZAPCLIN_SS_ID = '1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug';

const AUTH_PROJECT_CANDIDATES = [
  path.join(process.cwd()),
  path.join(os.homedir(), 'Projects', 'google-drive-sheets-auth'),
  path.join('C:', 'Users', 'riboc', 'Projects', 'google-drive-sheets-auth'),
];

function loadGoogleapis() {
  const candidates = AUTH_PROJECT_CANDIDATES.map((base) =>
    path.join(base, 'node_modules', 'googleapis')
  );
  for (const p of candidates) {
    try {
      return require(p);
    } catch (_) {
      /* next */
    }
  }
  try {
    return require('googleapis');
  } catch (_) {
    console.error(
      'googleapis nao encontrado. Rode a partir de google-drive-sheets-auth (onde ha node_modules):\n' +
        '  cd C:\\Users\\riboc\\Projects\\google-drive-sheets-auth\n' +
        '  node <caminho-do-script>'
    );
    process.exit(1);
  }
}

function loadCredentials() {
  const base = path.join(os.homedir(), '.config', 'google-api');
  const tokenPath = path.join(base, 'token.json');
  const secretCandidates = [
    path.join(base, 'client_secret.json'),
    path.join(base, 'credentials.json'),
  ];

  if (!fs.existsSync(tokenPath)) {
    console.error('Token ausente:', tokenPath);
    console.error('Rode: cd google-drive-sheets-auth && npm run auth');
    process.exit(1);
  }

  const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  let secret = null;
  for (const s of secretCandidates) {
    if (fs.existsSync(s)) {
      secret = JSON.parse(fs.readFileSync(s, 'utf8'));
      break;
    }
  }
  return { token, secret, tokenPath };
}

function buildOAuth2Client() {
  const { google } = loadGoogleapis();
  const { token, secret, tokenPath } = loadCredentials();

  const cfg = (secret && (secret.installed || secret.web || secret)) || {};
  const creds = token.tokens || token;

  const oauth2 = new google.auth.OAuth2(
    cfg.client_id || creds.client_id || process.env.GOOGLE_CLIENT_ID,
    cfg.client_secret || creds.client_secret || process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost'
  );

  oauth2.setCredentials({
    access_token: creds.access_token,
    refresh_token: creds.refresh_token,
    expiry_date: creds.expiry_date,
    token_type: creds.token_type || 'Bearer',
  });

  oauth2.on('tokens', (fresh) => {
    try {
      const merged = Object.assign({}, creds, fresh);
      const out = token.tokens ? Object.assign({}, token, { tokens: merged }) : merged;
      fs.writeFileSync(tokenPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    } catch (e) {
      console.warn('Aviso: nao foi possivel persistir refresh do token:', e.message);
    }
  });

  return { google, oauth2 };
}

function getSheetsClient() {
  const { google, oauth2 } = buildOAuth2Client();
  return google.sheets({ version: 'v4', auth: oauth2 });
}

function spreadsheetUrl(ssId, sheetGid) {
  const base = 'https://docs.google.com/spreadsheets/d/' + ssId + '/edit';
  return sheetGid != null ? base + '#gid=' + sheetGid : base;
}

module.exports = {
  ZAPCLIN_SS_ID,
  loadGoogleapis,
  loadCredentials,
  buildOAuth2Client,
  getSheetsClient,
  spreadsheetUrl,
};
