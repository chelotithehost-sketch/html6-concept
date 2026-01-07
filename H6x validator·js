#!/usr/bin/env node

/**
 * HTML-6X Validator
 * Validates H6X files for compliance with the specification
 * 
 * Usage: node h6x-validator.js <file.html>
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class H6XValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  /**
   * Validate an H6X file
   */
  validate(filepath) {
    console.log(`${colors.cyan}HTML-6X Validator${colors.reset}\n`);
    console.log(`Validating: ${filepath}\n`);

    if (!fs.existsSync(filepath)) {
      this.error(`File not found: ${filepath}`);
      return this.report();
    }

    const content = fs.readFileSync(filepath, 'utf-8');

    // Run validation checks
    this.checkDoctype(content);
    this.checkCSP(content);
    this.checkH6XTags(content);
    this.checkDataSources(content);
    this.checkAtoms(content);
    this.checkLayouts(content);
    this.checkSecurity(content);
    this.checkBestPractices(content);

    return this.report();
  }

  /**
   * Check for proper DOCTYPE
   */
  checkDoctype(content) {
    if (!content.includes('<!DOCTYPE html>')) {
      this.error('Missing or invalid DOCTYPE declaration');
    } else {
      this.info('✓ Valid DOCTYPE found');
    }
  }

  /**
   * Check for Content Security Policy
   */
  checkCSP(content) {
    const cspRegex = /<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/i;
    
    if (!cspRegex.test(content)) {
      this.error('Missing Content-Security-Policy meta tag');
      this.info('  Add: <meta http-equiv="Content-Security-Policy" content="...">');
      return;
    }

    this.info('✓ CSP meta tag found');

    // Check for dangerous CSP directives
    if (content.includes("'unsafe-eval'")) {
      this.error("CSP contains 'unsafe-eval' - this is a security risk");
    }

    if (content.includes("script-src 'unsafe-inline'")) {
      this.warning("CSP allows inline scripts - consider using external scripts only");
    }
  }

  /**
   * Check H6X tag structure
   */
  checkH6XTags(content) {
    // Check for h6x-app
    const appMatches = content.match(/<h6x-app[^>]*>/g);
    
    if (!appMatches || appMatches.length === 0) {
      this.error('No <h6x-app> tag found');
      return;
    }

    if (appMatches.length > 1) {
      this.warning('Multiple <h6x-app> tags found - only one is recommended');
    }

    this.info(`✓ Found ${appMatches.length} app(s)`);

    // Check for required attributes
    appMatches.forEach((match, idx) => {
      if (!match.includes('name=')) {
        this.warning(`h6x-app #${idx + 1} missing 'name' attribute`);
      }
      if (!match.includes('mode=')) {
        this.warning(`h6x-app #${idx + 1} missing 'mode' attribute (recommended: mode="deterministic")`);
      }
    });
  }

  /**
   * Check data sources
   */
  checkDataSources(content) {
    const dataMatches = content.match(/<h6x-data[^>]*>[\s\S]*?<\/h6x-data>/g);
    
    if (!dataMatches) {
      this.warning('No <h6x-data> tags found - app has no data sources');
      return;
    }

    this.info(`✓ Found ${dataMatches.length} data source(s)`);

    dataMatches.forEach((match, idx) => {
      // Check for name attribute
      if (!match.includes('name=')) {
        this.error(`h6x-data #${idx + 1} missing 'name' attribute`);
      }

      // Check for valid JSON if not computed
      if (!match.includes('compute=')) {
        try {
          const jsonMatch = match.match(/>[\s\S]*?</);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0].substring(1, jsonMatch[0].length - 1).trim();
            if (jsonStr) {
              JSON.parse(jsonStr);
              this.info(`  ✓ Data source #${idx + 1} has valid JSON`);
            }
          }
        } catch (err) {
          this.error(`h6x-data #${idx + 1} contains invalid JSON: ${err.message}`);
        }
      }

      // Check for computed data
      if (match.includes('compute=')) {
        const computeMatch = match.match(/compute=["']([^"']+)["']/);
        if (computeMatch) {
          this.info(`  ✓ Computed data: ${computeMatch[1]}`);
        }
      }
    });
  }

  /**
   * Check atoms
   */
  checkAtoms(content) {
    const atomMatches = content.match(/<h6x-atom[^>]*>/g);
    
    if (!atomMatches) {
      this.warning('No <h6x-atom> tags found - app has no components');
      return;
    }

    this.info(`✓ Found ${atomMatches.length} atom(s)`);

    const validTypes = ['table', 'form', 'card', 'stat', 'list', 'chart'];
    
    atomMatches.forEach((match, idx) => {
      // Check for type attribute
      const typeMatch = match.match(/type=["']([^"']+)["']/);
      if (!typeMatch) {
        this.error(`h6x-atom #${idx + 1} missing 'type' attribute`);
      } else {
        const type = typeMatch[1];
        if (!validTypes.includes(type)) {
          this.warning(`h6x-atom #${idx + 1} has unknown type: ${type}`);
        }
      }

      // Check for data source or inline data
      if (!match.includes('source=') && !match.includes('compute=')) {
        const fullMatch = content.match(new RegExp(`${this.escapeRegex(match)}[\\s\\S]*?<\\/h6x-atom>`));
        if (fullMatch && fullMatch[0].trim().endsWith('/>')) {
          this.warning(`h6x-atom #${idx + 1} has no data source or inline data`);
        }
      }
    });
  }

  /**
   * Check layouts
   */
  checkLayouts(content) {
    const layoutMatches = content.match(/<h6x-layout[^>]*>/g);
    
    if (!layoutMatches) {
      this.warning('No <h6x-layout> tag found');
      return;
    }

    this.info(`✓ Found ${layoutMatches.length} layout(s)`);

    const validTypes = ['dashboard', 'split', 'centered', 'grid'];
    
    layoutMatches.forEach((match, idx) => {
      const typeMatch = match.match(/type=["']([^"']+)["']/);
      if (!typeMatch) {
        this.error(`h6x-layout #${idx + 1} missing 'type' attribute`);
      } else {
        const type = typeMatch[1];
        if (!validTypes.includes(type)) {
          this.warning(`h6x-layout #${idx + 1} has unknown type: ${type}`);
        }
      }
    });

    // Check for panels
    const panelMatches = content.match(/<h6x-panel[^>]*>/g);
    if (!panelMatches) {
      this.warning('No <h6x-panel> tags found in layout');
    } else {
      this.info(`  ✓ Found ${panelMatches.length} panel(s)`);
    }
  }

  /**
   * Check security issues
   */
  checkSecurity(content) {
    // Check for inline event handlers (XSS risk)
    const inlineEvents = ['onclick', 'onload', 'onerror', 'onmouseover'];
    inlineEvents.forEach(event => {
      if (content.includes(event + '=')) {
        this.error(`Found inline event handler: ${event}= (XSS risk - use addEventListener instead)`);
      }
    });

    // Check for eval usage
    if (content.includes('eval(')) {
      this.error('Found eval() usage - this is a severe security risk');
    }

    // Check for innerHTML usage
    if (content.includes('innerHTML')) {
      this.warning('Found innerHTML usage - consider using textContent or secure alternatives');
    }

    // Check for dangerous protocols
    if (content.match(/href=["']javascript:/i)) {
      this.error('Found javascript: protocol in href - this is a security risk');
    }

    this.info('✓ Security checks completed');
  }

  /**
   * Check best practices
   */
  checkBestPractices(content) {
    // Check for viewport meta tag
    if (!content.includes('name="viewport"')) {
      this.warning('Missing viewport meta tag - add for mobile responsiveness');
    }

    // Check for charset
    if (!content.includes('charset=')) {
      this.warning('Missing charset declaration - add <meta charset="utf-8">');
    }

    // Check for title
    if (!content.match(/<title>.*<\/title>/)) {
      this.warning('Missing or empty <title> tag');
    }

    // Check for display:none on h6x tags
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
      const styles = styleMatch[1];
      if (!styles.includes('h6x-app') || !styles.includes('display: none')) {
        this.warning('H6X tags should be hidden with display:none until runtime processes them');
      }
    }

    // Check for runtime script
    if (!content.includes('h6x-runtime.js') && !content.includes('H6XRuntime')) {
      this.error('Missing H6X runtime script - app will not function');
    }

    this.info('✓ Best practice checks completed');
  }

  /**
   * Add error message
   */
  error(message) {
    this.errors.push(message);
  }

  /**
   * Add warning message
   */
  warning(message) {
    this.warnings.push(message);
  }

  /**
   * Add info message
   */
  info(message) {
    this.info.push(message);
  }

  /**
   * Generate validation report
   */
  report() {
    console.log('\n' + '='.repeat(60) + '\n');
    console.log(`${colors.cyan}VALIDATION REPORT${colors.reset}\n`);

    // Show info messages
    if (this.info.length > 0) {
      console.log(`${colors.blue}Info:${colors.reset}`);
      this.info.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    // Show warnings
    if (this.warnings.length > 0) {
      console.log(`${colors.yellow}Warnings (${this.warnings.length}):${colors.reset}`);
      this.warnings.forEach(msg => console.log(`  ⚠  ${msg}`));
      console.log('');
    }

    // Show errors
    if (this.errors.length > 0) {
      console.log(`${colors.red}Errors (${this.errors.length}):${colors.reset}`);
      this.errors.forEach(msg => console.log(`  ✗  ${msg}`));
      console.log('');
    }

    // Final verdict
    console.log('='.repeat(60));
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`${colors.green}✓ PASSED - No issues found${colors.reset}`);
      return 0;
    } else if (this.errors.length === 0) {
      console.log(`${colors.yellow}⚠ PASSED WITH WARNINGS${colors.reset}`);
      return 0;
    } else {
      console.log(`${colors.red}✗ FAILED - Please fix errors above${colors.reset}`);
      return 1;
    }
  }

  /**
   * Escape special regex characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node h6x-validator.js <file.html>');
    process.exit(1);
  }

  const validator = new H6XValidator();
  const exitCode = validator.validate(args[0]);
  process.exit(exitCode);
}

module.exports = H6XValidator;
