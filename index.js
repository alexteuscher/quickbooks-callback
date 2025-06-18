const express = require('express');
const url = require('url');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse URL-encoded bodies (for OAuth callbacks)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'QuickBooks OAuth Callback Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      callback: '/callback',
      health: '/',
      redirect: '/redirect'
    }
  });
});

// QuickBooks OAuth callback handler
app.get('/callback', (req, res) => {
  console.log('=== QuickBooks OAuth Callback Received ===');
  console.log('Query Parameters:', req.query);
  console.log('Headers:', req.headers);
  
  // Extract OAuth parameters from QuickBooks callback
  const {
    code,
    state,
    realmId,
    error,
    error_description
  } = req.query;

  // Check for OAuth errors
  if (error) {
    console.error('OAuth Error:', error, error_description);
    return res.status(400).json({
      error: error,
      error_description: error_description,
      message: 'QuickBooks OAuth authentication failed'
    });
  }

  // Validate required parameters
  if (!code) {
    console.error('Missing authorization code in callback');
    return res.status(400).json({
      error: 'missing_code',
      message: 'Authorization code not received from QuickBooks'
    });
  }

  console.log('OAuth Success - Code received:', code);
  console.log('Company ID (realmId):', realmId);
  console.log('State:', state);

  // Build redirect URL to main application
  const redirectUrl = new URL('http://localhost:3001/auth/callback');
  
  // Forward all OAuth parameters to the main application
  if (code) redirectUrl.searchParams.set('code', code);
  if (state) redirectUrl.searchParams.set('state', state);
  if (realmId) redirectUrl.searchParams.set('realmId', realmId);

  console.log('Redirecting to main app:', redirectUrl.toString());

  // Redirect back to main application with OAuth data
  res.redirect(redirectUrl.toString());
});

// Alternative endpoint for manual parameter forwarding
app.get('/redirect', (req, res) => {
  const { code, state, realmId } = req.query;
  
  if (!code) {
    return res.status(400).json({
      error: 'missing_parameters',
      message: 'Required OAuth parameters not provided'
    });
  }

  const redirectUrl = `http://localhost:3001/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || '')}&realmId=${encodeURIComponent(realmId || '')}`;
  
  res.json({
    message: 'Parameters ready for redirect',
    redirectUrl: redirectUrl,
    parameters: { code, state, realmId }
  });
});

// Handle POST callbacks (if QuickBooks sends POST instead of GET)
app.post('/callback', (req, res) => {
  console.log('=== QuickBooks OAuth POST Callback Received ===');
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  
  // Combine body and query parameters
  const params = { ...req.body, ...req.query };
  
  const redirectUrl = new URL('http://localhost:3001/auth/callback');
  Object.keys(params).forEach(key => {
    if (params[key]) {
      redirectUrl.searchParams.set(key, params[key]);
    }
  });
  
  res.redirect(redirectUrl.toString());
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'server_error',
    message: 'Internal server error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`QuickBooks OAuth Callback Server running on port ${PORT}`);
  console.log(`Callback URL: http://localhost:${PORT}/callback`);
  console.log(`Redirect target: http://localhost:3001/auth/callback`);
});

module.exports = app;