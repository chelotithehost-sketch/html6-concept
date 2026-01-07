# License Guide for HTML-6X

## 📄 Current License: MIT

I've created a **MIT License** for your project (see the LICENSE file). This is the most popular choice for open source projects.

## 🤔 Why MIT License?

The MIT License is perfect for HTML-6X because:

✅ **Maximum Freedom** - Anyone can use, modify, and distribute
✅ **Commercial Use** - Companies can use it in products
✅ **Simple & Clear** - Easy to understand (13 lines!)
✅ **Industry Standard** - Used by React, Vue, Node.js, etc.
✅ **Attribution** - Just requires keeping the license notice

## 📋 What the MIT License Allows

People can:
- ✅ Use HTML-6X for commercial projects
- ✅ Modify the code however they want
- ✅ Distribute their modified versions
- ✅ Include it in proprietary software
- ✅ Sublicense it

The only requirement:
- ⚠️ Keep the copyright notice and license in copies

## 🔄 Alternative License Options

If you want to consider other licenses:

### 1. Apache 2.0 License
**Best for: Projects concerned about patents**

```
Pros:
- Similar to MIT but with patent protection
- Explicit patent grant from contributors
- Used by Android, Kubernetes, Swift

Cons:
- Longer and more complex
- More legal terminology
```

### 2. GNU GPL v3
**Best for: Ensuring derivatives stay open source**

```
Pros:
- "Copyleft" - derivatives must be open source
- Strong community values
- Used by Linux, Git, WordPress

Cons:
- Can't be used in closed-source projects
- More restrictive for commercial use
- Longer license text
```

### 3. BSD 3-Clause
**Best for: Maximum simplicity**

```
Pros:
- Even simpler than MIT
- Very permissive
- Used by BSD operating systems

Cons:
- No patent protection
- Less popular than MIT
```

### 4. Creative Commons (NOT recommended for code)
**Note:** CC licenses are for content, not code. Don't use for HTML-6X.

## 📝 Customizing Your License

### Update Copyright Holder

In the LICENSE file, you can change:

```
Copyright (c) 2026 HTML-6X Contributors
```

To:

```
Copyright (c) 2026 Your Name
```

Or keep it generic as "HTML-6X Contributors" to allow community contributions.

### Update Year

The year should be when you first publish:

```
Copyright (c) 2026 Your Name
```

If you update it over multiple years:

```
Copyright (c) 2026-2027 Your Name
```

## 🚀 Adding License to Your Repo

### Step 1: Add LICENSE File

The LICENSE file is already created. Just add it to your repo:

```bash
# Make sure LICENSE file is in your project root
ls LICENSE

# Add to git
git add LICENSE
git commit -m "Add MIT License"
git push
```

### Step 2: GitHub Will Auto-Detect

GitHub automatically:
- Shows license badge on your repo
- Displays license in the right sidebar
- Adds it to repository insights

### Step 3: Add License Badge to README

Add this to the top of your README.md:

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

It will look like this:
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

### Step 4: Add to package.json (if you create one later)

```json
{
  "name": "html-6x",
  "version": "0.1.0",
  "license": "MIT",
  ...
}
```

## 📜 License Headers in Code Files

You can optionally add license headers to your code files:

### For JavaScript Files (h6x-runtime.js)

Add at the top:

```javascript
/**
 * HTML-6X Runtime Engine
 * Copyright (c) 2026 HTML-6X Contributors
 * Licensed under the MIT License
 * https://github.com/yourusername/html-6x
 */
```

### For HTML Files

Add in comments:

```html
<!--
  HTML-6X Demo Application
  Copyright (c) 2026 HTML-6X Contributors
  Licensed under the MIT License
-->
```

## ⚖️ Legal Considerations

### Can I Change the License Later?

**Yes, but with caveats:**
- You can change for future versions
- Already-released versions keep their license
- Contributors might have rights to their code
- More restrictive licenses can be problematic

**Best practice:** Choose the right license now and stick with it.

### What About Contributors?

If others contribute code:

**Option 1: Contributor License Agreement (CLA)**
- Contributors assign copyright to you
- Gives you flexibility to change license
- Used by large projects (Google, Apache)

**Option 2: Developer Certificate of Origin (DCO)**
- Contributors certify they can contribute
- Less formal than CLA
- Used by Linux kernel

**Option 3: Keep It Simple**
- Just accept PRs with MIT license
- Contributors agree by submitting
- Works for most small/medium projects

### Do I Need a Lawyer?

**Probably not** for open source projects like this.

The MIT License is:
- Well-established
- Legally tested
- Used by millions of projects
- Reviewed by many lawyers over decades

**When you might need a lawyer:**
- If you want to dual-license (open + commercial)
- If you're accepting money for the software
- If a company wants to sponsor/acquire it
- If someone claims patent infringement

## 🌟 Recommended: Stick with MIT

For HTML-6X, I recommend keeping the MIT License because:

1. **It matches your vision** - You want people to use and build with it
2. **It's simple** - No complexity for users or contributors
3. **It's trusted** - Everyone knows and accepts it
4. **It enables adoption** - Companies can use it without worry
5. **It's standard** - Used by similar projects (React, Vue, etc.)

## 📚 Resources

### Learn More About Licenses
- Choose a License: https://choosealicense.com/
- OSI Approved Licenses: https://opensource.org/licenses/
- GitHub's License Guide: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

### License Comparison
- MIT vs Apache: https://choosealicense.com/licenses/
- Copyleft vs Permissive: https://opensource.guide/legal/

### Community Standards
- Open Source Initiative: https://opensource.org/
- Free Software Foundation: https://www.fsf.org/

## ✅ Quick Checklist

Before publishing:

- [x] LICENSE file in repository root
- [ ] Copyright holder name correct
- [ ] Year is current (2026)
- [ ] License badge in README
- [ ] License mentioned in documentation
- [ ] Contributors understand the license

## 🎯 Bottom Line

**You're all set with the MIT License!**

It's the right choice for HTML-6X because it:
- Maximizes adoption and use
- Keeps things simple
- Matches industry standards
- Allows commercial use
- Protects you legally

Just add the LICENSE file to your repo and you're good to go! 🚀

---

**Questions about licensing?** 
- GitHub Licensing Guide: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository
- Choose A License: https://choosealicense.com/
