# HTML-6X Project Structure

This document outlines the complete project structure and how to get started.

## 📁 Project Files

```
html-6x/
├── README.md                    # Project overview and documentation
├── HTML-6X-SPECIFICATION.md     # Complete technical specification
├── h6x-runtime.js              # Core runtime engine (~500 lines)
├── h6x-validator.js            # Validation tool (Node.js)
├── demo-app.html               # Basic demo application
├── task-manager-app.html       # Advanced example app
├── test-suite.html             # Automated test suite
└── examples/                   # Additional examples (future)
    ├── simple-form.html
    ├── data-dashboard.html
    └── crud-app.html
```

## 🚀 Quick Start

### Option 1: Simple HTTP Server (Recommended)

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js
npx http-server -p 8000
```

Then open:
- Demo app: http://localhost:8000/demo-app.html
- Task manager: http://localhost:8000/task-manager-app.html
- Tests: http://localhost:8000/test-suite.html

### Option 2: Direct File Opening

Simply double-click any `.html` file to open it in your browser.
(Note: Some features like IndexedDB may require a proper server)

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click any `.html` file
3. Select "Open with Live Server"

## 🔧 Development Workflow

### 1. Create a New App

```bash
# Copy the template
cp demo-app.html my-new-app.html

# Edit in your favorite editor
code my-new-app.html
```

### 2. Validate Your App

```bash
# Run the validator
node h6x-validator.js my-new-app.html
```

Expected output:
```
HTML-6X Validator

Validating: my-new-app.html

Info:
  ✓ Valid DOCTYPE found
  ✓ CSP meta tag found
  ✓ Found 1 app(s)

============================================================
✓ PASSED - No issues found
```

### 3. Test Your App

Open the test suite:
```bash
open test-suite.html
# Or visit http://localhost:8000/test-suite.html
```

Click "Run All Tests" to verify everything works.

### 4. Deploy Your App

HTML-6X apps are single files, so deployment is trivial:

**Option A: Static Hosting**
```bash
# Upload to any static host
scp my-app.html user@server:/var/www/html/

# Or use GitHub Pages
git add my-app.html
git commit -m "Add app"
git push origin main
```

**Option B: Cloud Storage**
- Upload to S3, GCS, Azure Blob Storage
- Enable static website hosting
- Done!

**Option C: CDN**
```bash
# Cloudflare Pages
wrangler pages publish . --project-name=my-h6x-app

# Netlify
netlify deploy --dir=. --prod

# Vercel
vercel --prod
```

## 📖 Core Concepts

### 1. Data Layer

Define your data in JSON:

```html
<h6x-data name="users">
  [
    {"id": 1, "name": "Alice", "active": true},
    {"id": 2, "name": "Bob", "active": false}
  ]
</h6x-data>
```

### 2. Computed Data

Derive data from existing sources:

```html
<h6x-data name="activeUsers" compute="users.filter(active=true)">
</h6x-data>

<h6x-data name="userCount" compute="users.count">
</h6x-data>
```

### 3. Layouts

Structure your app:

```html
<h6x-layout type="dashboard">
  <h6x-panel slot="sidebar">
    <!-- Navigation -->
  </h6x-panel>
  <h6x-panel slot="main">
    <!-- Content -->
  </h6x-panel>
</h6x-layout>
```

### 4. Atoms (Components)

Build UI with predefined components:

```html
<!-- Display data -->
<h6x-atom type="table" source="users"></h6x-atom>

<!-- Collect input -->
<h6x-atom type="form">
  {"fields": [...], "submitLabel": "Save"}
</h6x-atom>

<!-- Show stats -->
<h6x-atom type="stat" compute="users.count" label="Total Users">
</h6x-atom>

<!-- Display info -->
<h6x-atom type="card">
  {"title": "Welcome", "content": "Hello World"}
</h6x-atom>
```

## 🎨 Customization

### Styling

Add your own CSS in the `<style>` tag:

```html
<style>
  :root {
    --bg: #0b1220;
    --fg: #e5e7eb;
    --accent: #38bdf8;
  }

  /* Your custom styles */
  .custom-class {
    /* ... */
  }
</style>
```

### Adding JavaScript Logic

Extend the runtime with custom behavior:

```html
<script>
  // After runtime loads
  window.addEventListener('h6x:ready', () => {
    // Your custom code
  });
</script>
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] CSP header is present and strict
- [ ] No eval() or Function() usage
- [ ] All data sources are pure JSON
- [ ] User input is properly escaped
- [ ] HTTPS enabled (for production)
- [ ] Validator passes with no errors
- [ ] Test suite passes all tests

## 📊 Performance Tips

1. **Keep data sources small** - Under 5MB per source
2. **Use computed data** - Don't duplicate data
3. **Minimize atoms** - Only create what you need
4. **Lazy load** - Load data on demand when possible
5. **Cache wisely** - Use IndexedDB for persistence

## 🐛 Debugging

### Enable Debug Mode

```javascript
// Add to your app
window.H6X_DEBUG = true;
```

### Common Issues

**Issue: Data not showing**
- Check browser console for errors
- Verify JSON is valid (use validator)
- Ensure data source names match

**Issue: Atoms not rendering**
- Check atom type is correct
- Verify source exists
- Look for JavaScript errors

**Issue: Performance problems**
- Reduce data size
- Simplify computed expressions
- Check for memory leaks

## 🧪 Testing

### Manual Testing

1. Open test-suite.html
2. Click "Run All Tests"
3. Verify all tests pass

### Automated Testing

```bash
# Using a headless browser (future)
npm run test

# Or with CI/CD
./test-runner.sh
```

## 📦 Distribution

### Single File

The entire app is one HTML file:

```bash
# Just distribute the .html file
curl https://mysite.com/app.html > my-app.html
```

### With Runtime Embedded

Embed the runtime directly:

```html
<script>
  // Paste h6x-runtime.js contents here
</script>
```

### Minified

Minify for production:

```bash
# Minify HTML
html-minifier --collapse-whitespace \
              --remove-comments \
              app.html -o app.min.html

# Result: ~3KB file
```

## 🌐 Browser Support

Minimum requirements:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Required features:
- ES6 modules
- structuredClone
- IndexedDB (optional)
- CSP support

## 🎓 Learning Resources

### Examples

1. **demo-app.html** - Basic features
2. **task-manager-app.html** - Advanced usage
3. **test-suite.html** - Testing patterns

### Documentation

1. **README.md** - Overview and quick start
2. **HTML-6X-SPECIFICATION.md** - Complete spec
3. **Inline comments** - Detailed explanations

### Community

- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Twitter: @html6x (coming soon)
- Discord: Join our community (coming soon)

## 🚢 Deployment Examples

### Netlify

```toml
# netlify.toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self';"
```

### Vercel

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self';"
        }
      ]
    }
  ]
}
```

### Apache

```apache
# .htaccess
<IfModule mod_headers.c>
  Header set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self';"
</IfModule>
```

### Nginx

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self';";
```

## 🎯 Next Steps

1. Read the [specification](HTML-6X-SPECIFICATION.md)
2. Try the [demo app](demo-app.html)
3. Build something with [task manager example](task-manager-app.html)
4. Run the [test suite](test-suite.html)
5. Create your first app!

## 💡 Pro Tips

- Start simple, add complexity gradually
- Use the validator frequently
- Keep data normalized
- Test in multiple browsers
- Deploy early, iterate often

---

**Happy building with HTML-6X! 🚀**
