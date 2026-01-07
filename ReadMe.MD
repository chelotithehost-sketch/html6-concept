# HTML-6X: The Future of Web Development

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/html-6x/html-6x)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/html-6x/html-6x)

> **Single-file web applications with atomic components, declarative data, and security by design.**

---

## 🚀 What is HTML-6X?

HTML-6X is a revolutionary approach to web development that makes building secure, maintainable applications as simple as writing HTML. Inspired by atomic physics, HTML-6X treats UI components as atoms that combine to form complex applications—all in a single HTML file.

### The Problem

Modern web development has become unnecessarily complex:

```
Simple TODO app in React:
├── node_modules/ (200MB)
├── src/
│   ├── components/ (15 files)
│   ├── hooks/ (5 files)
│   ├── utils/ (8 files)
├── package.json
├── webpack.config.js
└── babel.config.js

Total: 28 files, 200MB, 15 dependencies
Build time: 30 seconds
```

### The Solution

```html
<!-- TODO app in HTML-6X -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>TODO App</title>
  <style>/* 20 lines */</style>
</head>
<body>
  <h6x-app name="TODO">
    <h6x-data name="tasks">[...]</h6x-data>
    <h6x-atom type="list" source="tasks"></h6x-atom>
  </h6x-app>
  <script src="h6x-runtime.js"></script>
</body>
</html>

Total: 1 file, 5KB
Build time: 0 seconds
```

---

## ✨ Key Features

### 🔒 Security by Default
- Strict Content Security Policy enforcement
- No arbitrary code execution (no eval, no Function constructor)
- Automatic XSS prevention
- Memory-safe operations

### 📦 Single-File Deployment
- Entire application in one HTML file
- No build process required
- No dependency hell
- Works offline immediately

### 🎯 Declarative Simplicity
- Define data in JSON
- Compose UI with atoms
- No imperative code needed
- Easy to understand and maintain

### ⚡ Performance
- < 20KB runtime (minified)
- < 100ms initialization
- 60 FPS rendering
- Minimal memory footprint

### 🧪 Atomic Design
- Predefined, tested components
- Table, Form, Card, Stat, List atoms
- Composable and reusable
- Consistent behavior

---

## 🎯 Quick Start

### 1. Create Your First App

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>My First H6X App</title>
  
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self';
                 script-src 'self';
                 style-src 'self';
                 object-src 'none';
                 base-uri 'none'">
  
  <style>
    :root {
      --bg: #0b1220;
      --fg: #e5e7eb;
      font-family: system-ui, sans-serif;
    }
    body { margin: 0; background: var(--bg); color: var(--fg); }
    h6x-app, h6x-data, h6x-layout, h6x-panel, h6x-atom { display: none; }
  </style>
</head>
<body>

<h6x-app name="Hello World" mode="deterministic">
  
  <h6x-data name="greeting">
    {"message": "Welcome to HTML-6X!"}
  </h6x-data>

  <h6x-layout type="centered">
    <h6x-panel slot="main">
      <h6x-atom type="card">
        {"title": "Hello World", "content": "Your first H6X app is running!"}
      </h6x-atom>
    </h6x-panel>
  </h6x-layout>

</h6x-app>

<script src="h6x-runtime.js"></script>

</body>
</html>
```

### 2. Open in Browser

That's it! No npm install, no webpack, no build process. Just open the HTML file in your browser.

---

## 📚 Examples

### Dashboard with Stats

```html
<h6x-app name="Dashboard" mode="deterministic">
  
  <h6x-data name="users">
    [
      {"id": 1, "name": "Alice", "active": true},
      {"id": 2, "name": "Bob", "active": true},
      {"id": 3, "name": "Eve", "active": false}
    ]
  </h6x-data>

  <h6x-data name="activeCount" compute="users.filter(active=true).count">
  </h6x-data>

  <h6x-layout type="dashboard">
    <h6x-panel slot="sidebar">
      Overview
      Users
      Settings
    </h6x-panel>
    
    <h6x-panel slot="main">
      <h6x-atom type="stat" compute="users.count" label="Total Users">
      </h6x-atom>
      
      <h6x-atom type="table" source="users">
      </h6x-atom>
    </h6x-panel>
  </h6x-layout>

</h6x-app>
```

### Form with Validation

```html
<h6x-atom type="form">
  {
    "fields": [
      {
        "name": "email",
        "label": "Email Address",
        "type": "email",
        "required": true
      },
      {
        "name": "password",
        "label": "Password",
        "type": "password",
        "required": true
      }
    ],
    "submitLabel": "Sign In"
  }
</h6x-atom>
```

### Computed Data

```html
<!-- Filter active users -->
<h6x-data name="activeUsers" compute="users.filter(active=true)">
</h6x-data>

<!-- Count total items -->
<h6x-data name="totalTasks" compute="tasks.count">
</h6x-data>

<!-- Sum revenue -->
<h6x-data name="totalRevenue" compute="sales.sum(amount)">
</h6x-data>
```

---

## 🏗️ Architecture

### The Atomic Model

HTML-6X is based on atomic design principles:

```
Atoms (h6x-atom)
  ↓
Molecules (h6x-panel)
  ↓
Organisms (h6x-layout)
  ↓
Pages (h6x-app)
```

### Data Flow

```
Data Sources → Store → Computed Data → Atoms → DOM
                 ↓
            State Management
```

### Security Layers

```
1. CSP Header      → Blocks unauthorized resources
2. Declarative     → No code in markup
3. Runtime         → Sandboxed execution
4. Validation      → Type checking
5. Escaping        → Automatic XSS prevention
```

---

## 🛠️ Available Atoms

| Atom | Purpose | Example |
|------|---------|---------|
| `table` | Display tabular data | User lists, reports |
| `form` | Data input | Registration, settings |
| `card` | Information display | Dashboards, summaries |
| `stat` | Numeric displays | KPIs, metrics |
| `list` | Item lists | Notifications, tasks |
| `chart` | Data visualization | Graphs, analytics (v0.2) |

---

## 📖 Documentation

- **[Full Specification](HTML-6X-SPECIFICATION.md)** - Complete technical specification
- **[API Reference](docs/API.md)** - Runtime API documentation
- **[Security Guide](docs/SECURITY.md)** - Security best practices
- **[Migration Guide](docs/MIGRATION.md)** - Migrate from React/Vue/etc.

---

## 🔧 Tools

### Validator

Check your HTML-6X files for compliance:

```bash
node h6x-validator.js myapp.html
```

Output:
```
HTML-6X Validator

Validating: myapp.html

Info:
  ✓ Valid DOCTYPE found
  ✓ CSP meta tag found
  ✓ Found 1 app(s)
  ✓ Found 3 data source(s)

============================================================
✓ PASSED - No issues found
```

### Development Server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/demo-app.html`

---

## 🎯 Use Cases

### ✅ Perfect For

- **Admin Dashboards** - Quick data visualization
- **Internal Tools** - CRUD applications
- **Prototypes** - Rapid application development
- **MVPs** - Launch fast, iterate quickly
- **Forms** - Data collection interfaces
- **Reports** - Read-only data displays

### ⚠️ Not Ideal For

- **Real-time Games** - Use canvas/WebGL
- **Complex Animations** - Use CSS animations or dedicated libraries
- **Native Mobile** - Use React Native or similar
- **Legacy Browser Support** - Requires modern browsers

---

## 🚦 Roadmap

### v0.1 (Current) ✅
- ✅ Core runtime engine
- ✅ Basic atoms (table, form, card, stat, list)
- ✅ Dashboard layout
- ✅ Computed data
- ✅ Validator tool

### v0.2 (Q2 2026)
- [ ] Chart atom (line, bar, pie)
- [ ] Custom atom definitions
- [ ] Plugin system
- [ ] Network data sources

### v0.3 (Q3 2026)
- [ ] Real-time updates (WebSocket)
- [ ] Authentication atoms
- [ ] File upload support
- [ ] Advanced forms (multi-step, conditional)

### v1.0 (Q4 2026)
- [ ] W3C standardization proposal
- [ ] Browser native support
- [ ] Developer tools extension
- [ ] Visual editor

---

## 🤝 Contributing

We're in early alpha and would love your feedback!

### Ways to Contribute

1. **Try it out** - Build something and share your experience
2. **Report issues** - Found a bug? Let us know
3. **Suggest features** - What atoms would you like to see?
4. **Write docs** - Help others learn HTML-6X
5. **Build examples** - Share your creations

### Development Setup

```bash
git clone https://github.com/html-6x/html-6x.git
cd html-6x
python3 -m http.server 8000
```

Open `http://localhost:8000/demo-app.html` to see it in action.

---

## 💡 Philosophy

### Why "6X"?

HTML-6X represents:
- **6** - The next evolution (HTML5 → HTML-6X)
- **X** - Extended capabilities beyond standard HTML
- **Atomic** - Based on atomic design (Carbon-6 analogy)

### Design Values

1. **Simplicity** - Easy things should be easy
2. **Security** - Safe by default, not by configuration
3. **Determinism** - Predictable behavior always
4. **Performance** - Fast is a feature
5. **Standards** - Build on web fundamentals

---

## 📊 Comparison

### HTML-6X vs React

| Feature | HTML-6X | React |
|---------|---------|-------|
| File size | 5KB | 500KB+ |
| Build time | 0s | 30s+ |
| Learning curve | 1 hour | 1 week |
| Security | Built-in | Configure |
| Dependencies | 0 | 10+ |

### HTML-6X vs PHP

| Feature | HTML-6X | PHP |
|---------|---------|-----|
| Client-side | ✅ | ❌ |
| Type safety | ✅ | ⚠️ |
| Memory safe | ✅ | ❌ |
| Offline support | ✅ | ❌ |
| Single file | ✅ | ⚠️ |

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Inspired by:
- The simplicity of early HTML
- The power of React's declarative model
- The security of Content Security Policy
- The elegance of atomic design

Built with love for the web platform 🌐

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/html-6x/html-6x/issues)
- **Discussions:** [GitHub Discussions](https://github.com/html-6x/html-6x/discussions)
- **Twitter:** [@html6x](https://twitter.com/html6x)
- **Discord:** [Join our community](https://discord.gg/html6x)

---

**Made with ❤️ for developers who value simplicity, security, and speed.**
