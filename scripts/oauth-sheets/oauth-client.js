/**
 * ZapClin — cliente OAuth Google Sheets.
 *
 * Ordem de credenciais:
 *   1) Env (Cloud Agent / CI): GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN
 *   2) Desktop: %USERPROFILE%\.config\google-api\token.json + client_secret.json
 *
 * Reusa o mesmo projeto:
 *   C:\Users\riboc\Projects\google-drive-sheets-auth
 *
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
      'googleapis nao encontrado.\n' +
        'Desktop: cd google-drive-sheets-auth && npm install\n' +
        'Cloud: npm install googleapis  (ou NODE_PATH apontando para node_modules)'
    );
    process.exit(1);
  }
}

function hasEnvCredentials() {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    (process.env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_ACCESS_TOKEN)
  );
}

function loadCredentials() {
  if (hasEnvCredentials()) {
    return {
      source: 'env',
      tokenPath: null,
      secret: {
        installed: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
      token: {
        access_token: process.env.GOOGLE_ACCESS_TOKEN || undefined,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN || undefined,
        token_type: 'Bearer',
      },
    };
  }

  const base = path.join(os.homedir(), '.config', 'google-api');
  const tokenPath = path.join(base, 'token.json');
  const secretCandidates = [
    path.join(base, 'client_secret.json'),
    path.join(base, 'credentials.json'),
  ];

  if (!fs.existsSync(tokenPath)) {
    console.error('Token ausente:', tokenPath);
    console.error('Desktop: cd google-drive-sheets-auth && npm run auth');
    console.error(
      'Cloud: defina GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN no Environment'
    );
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
  return { source: 'file', token, secret, tokenPath };
}

function buildOAuth2Client() {
  const { google } = loadGoogleapis();
  const { token, secret, tokenPath, source } = loadCredentials();

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

  if (source === 'file' && tokenPath) {
    oauth2.on('tokens', (fresh) => {
      try {
        const merged = Object.assign({}, creds, fresh);
        const out = token.tokens ? Object.assign({}, token, { tokens: merged }) : merged;
        fs.writeFileSync(tokenPath, JSON.stringify(out, null, 2), { mode: 0o600 });
      } catch (e) {
        console.warn('Aviso: nao foi possivel persistir refresh do token:', e.message);
      }
    });
  }

  return { google, oauth2, source };
}

function getSheetsClient() {
  const { google, oauth2, source } = buildOAuth2Client();
  if (process.env.ZAPCLIN_OAUTH_DEBUG) {
    console.error('[oauth-client] source=' + source);
  }
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
  hasEnvCredentials,
};
