# QuickBooks OAuth Callback Server

A lightweight Express.js server designed to handle QuickBooks OAuth callbacks and forward them to your main application. Perfect for deployment on Vercel or other serverless platforms.

## 🚀 Features

- **OAuth Callback Handling**: Receives QuickBooks OAuth responses
- **Parameter Forwarding**: Redirects to your main application with OAuth data
- **Error Handling**: Manages OAuth errors and missing parameters
- **Dual Support**: Handles both GET and POST callbacks
- **Serverless Ready**: Optimized for Vercel deployment
- **Comprehensive Logging**: Debug output for OAuth flow

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/` | GET | Health check and server status |
| `/callback` | GET/POST | Main QuickBooks OAuth callback handler |
| `/redirect` | GET | Manual parameter forwarding |

## 🔄 OAuth Flow

1. **QuickBooks Redirect**: QuickBooks redirects to your deployed callback URL
2. **Parameter Extraction**: Server extracts `code`, `state`, `realmId` from callback
3. **Forward to Main App**: Redirects to your main application with OAuth parameters
4. **Token Exchange**: Your main app completes the OAuth flow

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Server runs on `http://localhost:3001`

### Environment Variables

No environment variables required for basic operation. The server forwards OAuth parameters to `http://localhost:3000/auth/callback` by default.

## 🌐 Deployment

### Vercel Deployment

1. **Connect to GitHub**: Import this repository to Vercel
2. **Deploy**: Vercel will automatically deploy from the main branch
3. **Get URL**: Note your deployed URL (e.g., `https://your-app.vercel.app`)
4. **Update QuickBooks App**: Set redirect URI to `https://your-app.vercel.app/callback`

### Configuration

Update your main application's OAuth configuration to expect callbacks from your deployed URL.

## 📝 Usage Example

### QuickBooks App Settings
```
Redirect URI: https://your-deployed-app.vercel.app/callback
```

### OAuth Parameters Forwarded
- `code` - Authorization code from QuickBooks
- `state` - OAuth state parameter
- `realmId` - QuickBooks company ID

### Callback Response
```javascript
// GET /callback?code=xxx&state=yyy&realmId=zzz
// Redirects to: http://localhost:3000/auth/callback?code=xxx&state=yyy&realmId=zzz
```

## 🛠️ Development

### Project Structure
```
├── index.js          # Main Express server
├── package.json      # Dependencies and scripts
├── README.md         # Documentation
└── .gitignore        # Git ignore rules
```

### Local Testing
```bash
# Test health endpoint
curl http://localhost:3001

# Test callback with parameters
curl "http://localhost:3001/callback?code=test&state=test&realmId=123"
```

## 📦 Dependencies

- **express**: Web framework for Node.js
- **Node.js**: Runtime environment

## 🔒 Security

- Server validates required OAuth parameters
- Error handling prevents information leakage
- No sensitive data stored on the server
- All OAuth data is immediately forwarded

## 📄 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🆘 Support

For issues with:
- **OAuth Flow**: Check QuickBooks app configuration
- **Deployment**: Check Vercel logs and configuration
- **Parameters**: Enable logging to debug OAuth callbacks

---

Built for seamless QuickBooks OAuth integration 🚀Trigger deployment
