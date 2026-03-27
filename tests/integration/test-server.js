/**
 * Integration test server for BetaHub Widget submission token testing.
 *
 * Serves widget test pages and provides a /api/token endpoint that
 * proxies token generation to the local BetaHub backend.
 *
 * Usage: node tests/integration/test-server.js
 * Then open http://localhost:8787 in a browser.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Config — update these with your local dev values
const CONFIG = {
  PORT: 8877,
  BETAHUB_API: 'http://localhost:3000',
  PROJECT_ID: 'pr-6790810205',
  AUTH_TOKEN_JWT_REQUIRED: 'tkn-66d2cd9629cdd3f4c334a002f1a355910328b68f7a4f8b46a70cd35754baf446',
  AUTH_TOKEN_NO_JWT: '', // will be filled by setup
  PAT: 'pat-ca07280ae4e3e7aa47dcf2942bbb38bcbf5507126782ea8b1f089f28f3156f5d'
};

const WIDGET_JS_PATH = path.join(__dirname, '../../betahub-widget.js');

// Helper: generate a submission token via BetaHub API
async function generateSubmissionToken(email, custom, expiresIn) {
  const body = {};
  if (email) body.email = email;
  if (custom) body.custom = custom;
  if (expiresIn) body.expires_in = expiresIn;

  const response = await fetch(`${CONFIG.BETAHUB_API}/projects/${CONFIG.PROJECT_ID}/submission_tokens.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.PAT}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token generation failed (${response.status}): ${text}`);
  }

  return response.json();
}

// Serve static files
function serveFile(res, filePath, contentType) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
}

// Test page template
function testPage(title, widgetConfig, notes) {
  return `<!DOCTYPE html>
<html>
<head><title>${title}</title>
<style>
  body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
  h1 { color: #237390; }
  .config { background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
  .notes { background: #fff8e1; padding: 12px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #f8c060; }
  a { color: #237390; }
  .nav { margin: 20px 0; }
  .nav a { margin-right: 12px; }
</style>
</head>
<body>
  <div class="nav">
    <a href="/">Index</a> |
    <a href="/test/dynamic">Dynamic Token</a> |
    <a href="/test/static">Static Token</a> |
    <a href="/test/no-jwt">No JWT Required</a> |
    <a href="/test/missing-jwt">Missing JWT (Required)</a> |
    <a href="/test/mutual-exclusion">Mutual Exclusion Error</a> |
    <a href="/test/block-fallback">Block Fallback</a> |
    <a href="/test/allow-fallback">Allow Fallback</a> |
    <a href="/test/custom-fields">Custom Fields Override</a> |
    <a href="/test/email-prefill">Email Prefill</a> |
    <a href="/test/refetch">Token Re-fetch</a>
  </div>
  <h1>${title}</h1>
  ${notes ? `<div class="notes">${notes}</div>` : ''}
  <div class="config">${JSON.stringify(widgetConfig, null, 2)}</div>
  <script src="/betahub-widget.js"></script>
  <script>
    BetaHubWidget.init(${JSON.stringify(widgetConfig)});
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  // CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${CONFIG.PORT}`);

  // Serve widget JS
  if (url.pathname === '/betahub-widget.js') {
    serveFile(res, WIDGET_JS_PATH, 'application/javascript');
    return;
  }

  // Token endpoint — proxies to BetaHub API
  if (url.pathname === '/api/token') {
    try {
      const data = await generateSubmissionToken(
        'integration-test@example.com',
        { player_id: 'jwt-player-42' }
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token: data.token, email: 'integration-test@example.com' }));
    } catch (e) {
      console.error('Token generation error:', e.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Token endpoint without email in response
  if (url.pathname === '/api/token-no-email') {
    try {
      const data = await generateSubmissionToken(null, { player_id: 'jwt-anon-99' });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token: data.token }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Token endpoint with custom fields override test
  if (url.pathname === '/api/token-custom-fields') {
    try {
      const data = await generateSubmissionToken(
        'custom-fields-test@example.com',
        { player_id: 'jwt-override-value' }
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token: data.token, email: 'custom-fields-test@example.com' }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Failing token endpoint
  if (url.pathname === '/api/token-fail') {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Simulated failure' }));
    return;
  }

  // Static token endpoint — generates one and embeds it
  if (url.pathname === '/api/static-token') {
    try {
      const data = await generateSubmissionToken('static-test@example.com', { player_id: 'static-42' });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Base config shared by most tests
  const baseConfig = {
    projectId: CONFIG.PROJECT_ID,
    apiBaseUrl: CONFIG.BETAHUB_API,
    position: 'bottom-right'
  };

  // Index page
  if (url.pathname === '/') {
    const html = `<!DOCTYPE html>
<html><head><title>BetaHub Widget Integration Tests</title>
<style>body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
h1 { color: #237390; } a { color: #237390; display: block; margin: 8px 0; } .desc { color: #666; font-size: 14px; }</style>
</head><body>
<h1>Integration Test Pages</h1>
<a href="/test/dynamic">1. Dynamic Token (happy path)</a><span class="desc">Token fetched on open, email prefilled</span>
<a href="/test/static">2. Static Token (consumed after use)</a><span class="desc">Single-use token, shows consumed on second open</span>
<a href="/test/no-jwt">3. No JWT Required (backward compat)</a><span class="desc">Regular submission without any token</span>
<a href="/test/missing-jwt">4. Missing JWT (required but absent)</a><span class="desc">Should fail with 403</span>
<a href="/test/mutual-exclusion">5. Mutual Exclusion Error</a><span class="desc">Both token + URL set = config error</span>
<a href="/test/block-fallback">6. Block Fallback (fetch fails)</a><span class="desc">Submit disabled on token fetch failure</span>
<a href="/test/allow-fallback">7. Allow Fallback (fetch fails)</a><span class="desc">Submit allowed despite token fetch failure</span>
<a href="/test/custom-fields">8. Custom Fields Override</a><span class="desc">JWT custom fields overwrite widget custom fields</span>
<a href="/test/email-prefill">9. Email Prefill from Token</a><span class="desc">Token response email locks the email field</span>
<a href="/test/refetch">10. Token Re-fetch on Second Open</a><span class="desc">New token on each modal open after submission</span>
</body></html>`;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Test pages
  switch (url.pathname) {
    case '/test/dynamic':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 1: Dynamic Token', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
        submissionTokenUrl: `http://localhost:${CONFIG.PORT}/api/token`,
        submissionTokenMethod: 'POST'
      }, 'Opens widget -> fetches token -> submit should work. Email should be prefilled from token response.'));
      return;

    case '/test/static':
      // Need to generate token first, so this is async
      try {
        const tokenData = await generateSubmissionToken('static-test@example.com', { player_id: 'static-42' });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(testPage('Test 2: Static Token', {
          ...baseConfig,
          authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
          submissionToken: tokenData.token
        }, 'Submit once -> success. Open again -> should show "token consumed" message.'));
      } catch (e) {
        res.writeHead(500);
        res.end(`Token generation failed: ${e.message}`);
      }
      return;

    case '/test/no-jwt':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 3: No JWT Required', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED.replace('tkn-66d2', 'PLACEHOLDER'),
        // Will use the no-jwt token - need to fill this from setup
      }, 'NOTE: This test needs the no-JWT auth token. Check /api/setup first.'));
      return;

    case '/test/missing-jwt':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 4: Missing JWT (Required)', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED
        // No submissionToken or submissionTokenUrl — but auth token requires it
      }, 'Submit should fail with 403 "Submission token is required" because the auth token has require_submission_token=true but no JWT is provided.'));
      return;

    case '/test/mutual-exclusion':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 5: Mutual Exclusion Error', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
        submissionToken: 'eyJfake',
        submissionTokenUrl: `http://localhost:${CONFIG.PORT}/api/token`
      }, 'Both submissionToken and submissionTokenUrl set. Should show config error.'));
      return;

    case '/test/block-fallback':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 6: Block Fallback', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
        submissionTokenUrl: `http://localhost:${CONFIG.PORT}/api/token-fail`,
        submissionTokenFallback: 'block'
      }, 'Token fetch will fail. Submit should be disabled. Error banner should show with retry button.'));
      return;

    case '/test/allow-fallback':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 7: Allow Fallback', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
        submissionTokenUrl: `http://localhost:${CONFIG.PORT}/api/token-fail`,
        submissionTokenFallback: 'allow'
      }, 'Token fetch will fail. Submit should be ENABLED (fallback: allow). Submission will fail with 403 on backend since token is required.'));
      return;

    case '/test/custom-fields':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 8: Custom Fields Override', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
        submissionTokenUrl: `http://localhost:${CONFIG.PORT}/api/token-custom-fields`,
        customFields: { player_id: 'widget-value-should-be-overridden' }
      }, 'JWT has player_id: "jwt-override-value". Widget config has player_id: "widget-value-should-be-overridden". After submit, the issue should have player_id = "jwt-override-value" (JWT wins).'));
      return;

    case '/test/email-prefill':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 9: Email Prefill from Token', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
        submissionTokenUrl: `http://localhost:${CONFIG.PORT}/api/token`,
        showEmailField: 'always'
      }, 'Token response includes email. The email field should appear, be prefilled with "integration-test@example.com", and be readonly.'));
      return;

    case '/test/refetch':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(testPage('Test 10: Token Re-fetch', {
        ...baseConfig,
        authToken: CONFIG.AUTH_TOKEN_JWT_REQUIRED,
        submissionTokenUrl: `http://localhost:${CONFIG.PORT}/api/token`
      }, 'Submit once -> close -> reopen -> new token should be fetched -> submit again should work.'));
      return;

    default:
      res.writeHead(404);
      res.end('Not found');
  }
});

server.listen(CONFIG.PORT, () => {
  console.log(`Test server running at http://localhost:${CONFIG.PORT}`);
  console.log(`BetaHub API: ${CONFIG.BETAHUB_API}`);
  console.log(`Project: ${CONFIG.PROJECT_ID}`);
  console.log(`Auth Token (JWT required): ${CONFIG.AUTH_TOKEN_JWT_REQUIRED.substring(0, 20)}...`);
  console.log(`PAT: ${CONFIG.PAT.substring(0, 20)}...`);
});
