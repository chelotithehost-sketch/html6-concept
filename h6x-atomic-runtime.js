"use strict";

/**
 * HTML-6X Atomic Runtime Engine v0.2.0
 * 
 * The Nuclear Reactor: A runtime that treats components as atoms
 * with protons (data), neutrons (logic), and electrons (events).
 * 
 * Philosophy: If atoms are the building blocks of matter,
 * then atomic components are the building blocks of applications.
 */

// ============================================================================
// ATOMIC KERNEL - The Nuclear Reactor
// ============================================================================

class AtomicKernel {
  constructor() {
    this.nucleus = new NucleusManager();
    this.electronCloud = new ElectronShell();
    this.valenceShell = new BondingManager();
    this.periodicTable = new PeriodicTable();
    
    console.log('[⚛️  Atomic Kernel] Initializing nuclear reactor...');
  }

  boot() {
    // Parse all atoms in the document
    document.querySelectorAll('atom').forEach(atomNode => {
      const atom = this.parseAtom(atomNode);
      this.periodicTable.register(atom);
      this.render(atom, atomNode);
    });

    // Parse all molecules (composed atoms)
    document.querySelectorAll('molecule').forEach(molNode => {
      this.parseMolecule(molNode);
    });

    console.log('[⚛️  Atomic Kernel] Reactor online. All atoms stable.');
  }

  parseAtom(atomNode) {
    const name = atomNode.getAttribute('name');
    
    // Count subatomic particles
    const protons = this.nucleus.extractProtons(atomNode);
    const neutrons = this.nucleus.extractNeutrons(atomNode);
    const electrons = this.electronCloud.extractElectrons(atomNode);

    // Calculate atomic properties
    const atomicNumber = protons.length;
    const atomicMass = protons.length + neutrons.length;
    const stability = neutrons.length > 0 ? neutrons.length / protons.length : 1.0;

    // Stability check
    if (stability < 1.0 && atomicNumber > 2) {
      console.warn(`[⚛️  ${name}] Unstable atom detected (stability: ${stability.toFixed(2)})`);
      console.warn(`    Recommendation: Add more <neutron> tags for validation/logic`);
    }

    const atom = {
      name,
      atomicNumber,
      atomicMass,
      stability,
      protons,
      neutrons,
      electrons,
      element: atomNode
    };

    console.log(`[⚛️  ${name}] Atom parsed: ${atomicNumber}p ${neutrons.length}n ${electrons.length}e (mass: ${atomicMass})`);

    return atom;
  }

  parseMolecule(molNode) {
    const name = molNode.getAttribute('name');
    const atoms = Array.from(molNode.querySelectorAll('atom'));
    
    console.log(`[🧬 ${name}] Molecule detected with ${atoms.length} atoms`);
    
    // Create bonds between atoms
    const bonds = this.valenceShell.detectBonds(atoms);
    bonds.forEach(bond => {
      this.valenceShell.createBond(bond.from, bond.to, bond.type);
    });
  }

  render(atom, atomNode) {
    // Create container for this atom
    const container = document.createElement('div');
    container.className = `atom-${atom.name}`;
    container.dataset.atomicNumber = atom.atomicNumber;
    container.dataset.atomicMass = atom.atomicMass;

    // Render based on atomic structure
    if (atom.electrons.length > 0) {
      this.electronCloud.bindEvents(atom, container);
    }

    // Replace atom node with rendered content
    atomNode.replaceWith(container);
    
    return container;
  }
}

// ============================================================================
// NUCLEUS MANAGER - Handles Protons & Neutrons
// ============================================================================

class NucleusManager {
  constructor() {
    this.protonData = new Map(); // Stores all proton data
    this.neutronRules = new Map(); // Stores all neutron logic
  }

  extractProtons(atomNode) {
    const protonNodes = atomNode.querySelectorAll('proton');
    const protons = [];

    protonNodes.forEach((node, index) => {
      const proton = {
        id: `p${index}`,
        source: node.getAttribute('source'),
        local: node.getAttribute('local'),
        cache: node.getAttribute('cache') || 'memory',
        persist: node.getAttribute('persist'),
        fallback: node.getAttribute('fallback'),
        data: null
      };

      // Load data synchronously if local
      if (proton.local) {
        proton.data = this.loadLocalData(proton.local);
      }

      // Mark for async loading if remote
      if (proton.source) {
        this.loadRemoteData(proton);
      }

      protons.push(proton);
      this.protonData.set(proton.id, proton);
    });

    return protons;
  }

  extractNeutrons(atomNode) {
    const neutronNodes = atomNode.querySelectorAll('neutron');
    const neutrons = [];

    neutronNodes.forEach((node, index) => {
      const type = node.getAttribute('type');
      const content = node.textContent.trim();

      const neutron = {
        id: `n${index}`,
        type, // validate, transform, compute, security
        rules: this.parseNeutronRules(content, type),
        weight: 1 // Computational weight
      };

      neutrons.push(neutron);
      this.neutronRules.set(neutron.id, neutron);
    });

    return neutrons;
  }

  parseNeutronRules(content, type) {
    const rules = {};

    if (type === 'validate') {
      // Parse validation rules
      // Format: "email: required, format\npassword: minLength(8)"
      content.split('\n').forEach(line => {
        const [field, rulesStr] = line.split(':').map(s => s.trim());
        if (field && rulesStr) {
          rules[field] = rulesStr.split(',').map(r => r.trim());
        }
      });
    } else if (type === 'compute') {
      // Parse computed properties
      // Format: "isValid = email.valid && password.valid"
      content.split('\n').forEach(line => {
        const [name, expression] = line.split('=').map(s => s.trim());
        if (name && expression) {
          rules[name] = expression;
        }
      });
    } else if (type === 'transform') {
      // Parse transformation rules
      content.split('\n').forEach(line => {
        const [field, transforms] = line.split(':').map(s => s.trim());
        if (field && transforms) {
          rules[field] = transforms.split(',').map(t => t.trim());
        }
      });
    }

    return rules;
  }

  loadLocalData(key) {
    // Load from localStorage, sessionStorage, or memory
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  async loadRemoteData(proton) {
    try {
      const response = await fetch(proton.source);
      const data = await response.json();
      proton.data = data;
      
      if (proton.persist === 'indexeddb') {
        this.persistToIndexedDB(proton.local, data);
      } else if (proton.persist === 'localstorage') {
        localStorage.setItem(proton.local, JSON.stringify(data));
      }
    } catch (error) {
      console.error(`[Proton] Failed to load ${proton.source}:`, error);
      if (proton.fallback) {
        proton.data = proton.fallback;
      }
    }
  }

  async persistToIndexedDB(key, data) {
    // IndexedDB persistence logic
    console.log(`[Proton] Persisting ${key} to IndexedDB`);
  }

  validate(data, neutron) {
    // Apply neutron validation rules
    const errors = {};
    
    Object.entries(neutron.rules).forEach(([field, rules]) => {
      const value = data[field];
      const fieldErrors = [];

      rules.forEach(rule => {
        if (rule === 'required' && !value) {
          fieldErrors.push('This field is required');
        } else if (rule === 'email-format' && !this.isValidEmail(value)) {
          fieldErrors.push('Invalid email format');
        } else if (rule.startsWith('minLength')) {
          const minLen = parseInt(rule.match(/\d+/)[0]);
          if (value.length < minLen) {
            fieldErrors.push(`Minimum length is ${minLen}`);
          }
        }
      });

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    });

    return { valid: Object.keys(errors).length === 0, errors };
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// ============================================================================
// ELECTRON SHELL - Handles Events & Interactions
// ============================================================================

class ElectronShell {
  constructor() {
    this.electrons = new Map();
    this.bonds = new Map(); // Electron sharing between atoms
  }

  extractElectrons(atomNode) {
    const electronNodes = atomNode.querySelectorAll('electron');
    const electrons = [];

    electronNodes.forEach((node, index) => {
      const electron = {
        id: `e${index}`,
        on: node.getAttribute('on'), // Event type (click, submit, change)
        action: node.getAttribute('action'), // What to do
        endpoint: node.getAttribute('endpoint'),
        method: node.getAttribute('method') || 'GET',
        redirect: node.getAttribute('redirect'),
        bond: node.getAttribute('bond'), // Which atom to bond with
        emit: node.getAttribute('emit'), // Event to emit
        listen: node.getAttribute('listen'), // Event to listen for
        energy: 'ground', // Current energy state
        orbital: this.getOrbital(node.getAttribute('on')) // Event priority
      };

      electrons.push(electron);
      this.electrons.set(electron.id, electron);
    });

    return electrons;
  }

  getOrbital(eventType) {
    // Assign energy levels based on event type
    const orbitals = {
      'click': 1,      // Closest to nucleus (most common)
      'submit': 1,
      'change': 2,
      'input': 2,
      'focus': 3,
      'blur': 3,
      'custom': 4      // Outer shell (rare events)
    };
    return orbitals[eventType] || 4;
  }

  bindEvents(atom, container) {
    atom.electrons.forEach(electron => {
      if (electron.on && electron.action) {
        this.attachEventListener(electron, container, atom);
      }

      if (electron.bond) {
        this.createBond(atom, electron);
      }
    });
  }

  attachEventListener(electron, container, atom) {
    const handler = (event) => {
      event.preventDefault();
      
      // Excite electron (change energy state)
      electron.energy = 'excited';
      
      console.log(`[⚡ Electron] Event fired: ${electron.on} -> ${electron.action}`);

      // Execute action
      this.executeAction(electron, atom, event);

      // Return to ground state
      setTimeout(() => {
        electron.energy = 'ground';
      }, 100);
    };

    container.addEventListener(electron.on, handler);
  }

  async executeAction(electron, atom, event) {
    switch (electron.action) {
      case 'login':
      case 'send':
      case 'submit':
        await this.handleSubmit(electron, atom, event);
        break;
      
      case 'validate':
        this.handleValidation(electron, atom, event);
        break;
      
      case 'redirect':
        window.location.href = electron.redirect;
        break;
      
      default:
        console.warn(`[⚡ Electron] Unknown action: ${electron.action}`);
    }

    // Emit event if specified
    if (electron.emit) {
      this.emitEvent(electron.emit, atom);
    }
  }

  async handleSubmit(electron, atom, event) {
    if (!electron.endpoint) {
      console.error('[⚡ Electron] No endpoint specified for submit action');
      return;
    }

    // Gather data from protons
    const data = this.gatherProtonData(atom);

    // Validate with neutrons
    const validation = this.validateWithNeutrons(data, atom);
    if (!validation.valid) {
      console.error('[⚡ Electron] Validation failed:', validation.errors);
      return;
    }

    try {
      const response = await fetch(electron.endpoint, {
        method: electron.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('[⚡ Electron] Submit successful');
        if (electron.redirect) {
          window.location.href = electron.redirect;
        }
      }
    } catch (error) {
      console.error('[⚡ Electron] Submit failed:', error);
    }
  }

  handleValidation(electron, atom, event) {
    const data = this.gatherProtonData(atom);
    const validation = this.validateWithNeutrons(data, atom);
    
    console.log('[⚡ Electron] Validation result:', validation);
    // TODO: Update UI with validation feedback
  }

  gatherProtonData(atom) {
    const data = {};
    atom.protons.forEach(proton => {
      if (proton.local) {
        data[proton.local] = proton.data;
      }
    });
    return data;
  }

  validateWithNeutrons(data, atom) {
    let overallValid = true;
    const allErrors = {};

    atom.neutrons.forEach(neutron => {
      if (neutron.type === 'validate') {
        // Apply validation rules
        // Simplified validation logic
        Object.entries(neutron.rules).forEach(([field, rules]) => {
          if (rules.includes('required') && !data[field]) {
            allErrors[field] = ['Required field'];
            overallValid = false;
          }
        });
      }
    });

    return { valid: overallValid, errors: allErrors };
  }

  emitEvent(eventName, atom) {
    const event = new CustomEvent(`atom:${eventName}`, {
      detail: { atom, data: this.gatherProtonData(atom) }
    });
    window.dispatchEvent(event);
    console.log(`[⚡ Electron] Emitted: atom:${eventName}`);
  }

  createBond(atom, electron) {
    // Create bond with another atom
    const targetAtomId = electron.bond;
    
    window.addEventListener(`atom:${electron.listen}`, (event) => {
      console.log(`[🔗 Bond] ${atom.name} received signal from ${event.detail.atom.name}`);
      
      // Execute bonded action
      if (electron.action === 'refresh') {
        // Refresh this atom's data
        console.log(`[🔗 Bond] Refreshing ${atom.name}`);
      }
    });
  }
}

// ============================================================================
// BONDING MANAGER - Handles Inter-Atom Communication
// ============================================================================

class BondingManager {
  constructor() {
    this.bonds = [];
  }

  detectBonds(atoms) {
    const bonds = [];
    
    // Detect bonds based on electrons with 'bond' attribute
    atoms.forEach(atom => {
      const electronNodes = atom.querySelectorAll('electron[bond]');
      electronNodes.forEach(eNode => {
        bonds.push({
          from: atom.getAttribute('name'),
          to: eNode.getAttribute('bond'),
          type: 'covalent', // Default to covalent (shared state)
          strength: 1.0
        });
      });
    });

    return bonds;
  }

  createBond(fromAtom, toAtom, bondType) {
    console.log(`[🔗 Bond] Creating ${bondType} bond: ${fromAtom} ↔ ${toAtom}`);
    
    this.bonds.push({
      from: fromAtom,
      to: toAtom,
      type: bondType,
      created: Date.now()
    });
  }
}

// ============================================================================
// PERIODIC TABLE - Registry of All Atoms
// ============================================================================

class PeriodicTable {
  constructor() {
    this.elements = new Map();
  }

  register(atom) {
    this.elements.set(atom.name, atom);
    
    // Classify by atomic number
    const period = this.getPeriod(atom.atomicNumber);
    const group = this.getGroup(atom);
    
    console.log(`[📊 Periodic Table] Registered: ${atom.name} (Period ${period}, ${group})`);
  }

  getPeriod(atomicNumber) {
    if (atomicNumber <= 2) return 1;
    if (atomicNumber <= 10) return 2;
    if (atomicNumber <= 18) return 3;
    return 4;
  }

  getGroup(atom) {
    if (atom.electrons.length === 0) return 'Noble Gas (Inert)';
    if (atom.electrons.length === 1) return 'Alkali (Reactive)';
    if (atom.electrons.length >= atom.protons.length) return 'Halogen (Highly Reactive)';
    return 'Transition Metal (Stable)';
  }

  getElement(name) {
    return this.elements.get(name);
  }
}

// ============================================================================
// AUTO-BOOT
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.atomicKernel = new AtomicKernel();
    window.atomicKernel.boot();
  });
} else {
  window.atomicKernel = new AtomicKernel();
  window.atomicKernel.boot();
}

console.log('⚛️  HTML-6X Atomic Runtime v0.2.0 loaded');
