#!/usr/bin/env node
/**
 * Springboards Design System, Page Editor & Content Workflow MCP Server
 * Implements Model Context Protocol (MCP) JSON-RPC 2.0 over stdio + CLI verification mode.
 *
 * Capabilities:
 *  - tools:
 *      1. design_system_inspect_tokens
 *      2. design_system_audit_compliance
 *      3. pages_list_and_inspect
 *      4. pages_scaffold_component
 *      5. content_workflow_manage
 *  - resources:
 *      - mcp://springboards/design-system
 *      - mcp://springboards/styles-tokens
 *      - mcp://springboards/rbac-workflows
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

export const MCP_SERVER_INFO = {
  name: 'springboards-design-content-mcp',
  version: '1.0.0',
  protocolVersion: '2024-11-05',
  description: 'MCP server for Springboards Design System setup, creating/editing intent pages, and managing WIOA-governed site content & publishing workflows.'
};

export const MCP_CAPABILITIES_AND_PERMISSIONS = {
  supportedCapabilities: [
    'MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API',
    'mcp:tools:design_system',
    'mcp:tools:page_creation_and_editing',
    'mcp:tools:content_and_workflow_management',
    'mcp:resources:design_tokens_and_governance'
  ],
  permissionMatrix: {
    'mcp:design_system': {
      allowedRoles: ['role_designer_developer_publisher'],
      allowedTools: ['design_system_inspect_tokens', 'design_system_audit_compliance', 'pages_scaffold_component'],
      description: 'Configure and audit :root CSS variables, Plus Jakarta Sans typography, BEM primitives, and responsive rules.'
    },
    'mcp:page_editor': {
      allowedRoles: ['role_designer_developer_publisher', 'role_executive_content_approver'],
      allowedTools: ['pages_list_and_inspect', 'pages_scaffold_component', 'design_system_audit_compliance'],
      description: 'Create and edit public intent pages (/index, /train, /eligibility, /volunteer, /partner, /donate) with SEO & BEM verification.'
    },
    'mcp:content_workflow': {
      allowedRoles: [
        'role_designer_developer_publisher',
        'role_executive_content_approver',
        'role_compliance_reviewer',
        'role_financial_reviewer',
        'role_policy_custodian',
        'role_trade_contributor',
        'role_partnership_content_manager',
        'role_community_contributor'
      ],
      allowedTools: ['content_workflow_manage', 'pages_list_and_inspect'],
      description: 'Manage site content drafts, compliance reviews, and 4-stage publishing workflow transitions.'
    },
    'mcp:audit_read': {
      allowedRoles: ['role_board_chair_approver', 'role_compliance_reviewer', 'role_financial_reviewer', 'role_policy_custodian'],
      allowedTools: ['design_system_inspect_tokens', 'design_system_audit_compliance', 'pages_list_and_inspect'],
      description: 'Read-only inspection of design-system tokens, page SEO/accessibility compliance, and governance state.'
    }
  }
};
export const MCP_RESOURCES = [
  {
    uri: 'mcp://springboards/design-system',
    name: 'Springboards Design System Specification',
    mimeType: 'text/markdown'
  },
  {
    uri: 'mcp://springboards/styles-tokens',
    name: 'Springboards CSS Root Tokens & Fluid Scales',
    mimeType: 'text/css'
  },
  {
    uri: 'mcp://springboards/rbac-workflows',
    name: 'Springboards RBAC & Publishing Workflows',
    mimeType: 'application/json'
  }
];
export const MCP_TOOLS = [
  {
    name: 'design_system_inspect_tokens',
    description: 'Extracts and validates all centralized :root CSS variables, semantic brand colors, Plus Jakarta Sans font stacks, fluid clamp() scales, and 8px spacing tokens from /styles.css.',
    requiredPermission: 'mcp:design_system',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['all', 'colors', 'typography', 'spacing', 'sizing', 'layout'],
          description: 'Token category to inspect.'
        }
      }
    }
  },
  {
    name: 'design_system_audit_compliance',
    description: 'Audits /styles.css for brand & architecture rules (Safety Orange #E05B32, Deep Amber #C54E29, min-height 3.1rem buttons, var(--radius-md) cards, .wizard-fieldset/.wizard-choice modules, auto-fit grids, 600px/480px breakpoints, and prefers-reduced-motion).',
    requiredPermission: 'mcp:audit_read',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'pages_list_and_inspect',
    description: 'Lists and inspects all Springboards HTML pages for SEO metadata, canonical URLs, OpenGraph tags, H1 headings, self-hosted WOFF2 font preloads, and BEM component usage.',
    requiredPermission: 'mcp:page_editor',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
          description: 'Optional filename (e.g., index.html, train.html, eligibility.html) to inspect in detail.'
        }
      }
    }
  },
  {
    name: 'pages_scaffold_component',
    description: 'Generates a reusable, accessible HTML block using Springboards BEM conventions (.sb-card, .sb-btn--primary, .sb-grid--auto-fit, .wizard-fieldset, .wizard-choice) ready for page insertion.',
    requiredPermission: 'mcp:page_editor',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          enum: ['card', 'auto-fit-grid', 'wizard-fieldset', 'split-section'],
          description: 'Design system component pattern to scaffold.'
        },
        domainPrefix: {
          type: 'string',
          enum: ['sb', 'train-card', 'wizard-card', 'admin-panel'],
          description: 'BEM domain prefix.'
        },
        title: {
          type: 'string',
          description: 'Heading text for the component.'
        },
        bodyText: {
          type: 'string',
          description: 'Body copy for the component.'
        },
        ctaLabel: {
          type: 'string',
          description: 'Action button label.'
        },
        ctaHref: {
          type: 'string',
          description: 'Action button URL or anchor.'
        }
      },
      required: ['pattern', 'title']
    }
  },
  {
    name: 'content_workflow_manage',
    description: 'Reads or creates/advances site content publishing workflow requests under the 4-stage Springboards RBAC governance pipeline.',
    requiredPermission: 'mcp:content_workflow',
    inputSchema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['list', 'create_draft'],
          description: 'Workflow operation to execute.'
        },
        actorName: {
          type: 'string',
          description: 'Team member executing the workflow action (e.g., Marilynn Ward, Marvin Thompson, Giselle Campos).'
        },
        title: {
          type: 'string',
          description: 'Title of the content or page change (for create_draft).'
        },
        targetRoute: {
          type: 'string',
          description: 'Target route being modified (/, /train, /eligibility, /volunteer, /partner, /donate).'
        },
        workflowId: {
          type: 'string',
          description: 'Workflow ID when advancing stage.'
        },
        notes: {
          type: 'string',
          description: 'Review or publishing notes.'
        }
      },
      required: ['operation']
    }
  }
];

export function executeMcpTool(toolName, args = {}) {
  const stylesPath = path.join(ROOT, 'styles.css');
  const stylesContent = fs.existsSync(stylesPath) ? fs.readFileSync(stylesPath, 'utf8') : '';

  if (toolName === 'design_system_inspect_tokens') {
    const rootMatch = stylesContent.match(/:root\s*\{([\s\S]*?)\}/);
    const rootBlock = rootMatch ? rootMatch[1] : '';
    const tokenLines = rootBlock
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('--'));

    const tokens = {};
    for (const line of tokenLines) {
      const m = line.match(/^(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/);
      if (m) {
        tokens[m[1]] = m[2].trim();
      }
    }

    const category = args.category || 'all';
    const categoryMatchers = {
      colors: /^--(palette-|color-|rgb-|primary-navy|secondary-navy|navy-|accent-|bg-|border-|text-dark|text-body|text-muted|text-light|admin-|wizard-|train-page-)/,
      typography: /^--(font-|text-xs|text-sm|text-label|text-base|text-lg|text-h4|text-xl|text-2xl|text-3xl|text-display|text-numeral|leading-|tracking-|flow-)/,
      spacing: /^--(space-|section-pad-|section-band-|container-pad-)/,
      sizing: /^--(size-|container-max|container-content|container-narrow|container-prose|container-prose-compact|container-heading|nav-height|radius-|btn-|card-|field-|badge-)/,
      layout: /^--(bp-|container-|size-grid-|shadow-|z-|transition-|state-)/
    };

    const filteredTokens =
      category === 'all' || !categoryMatchers[category]
        ? tokens
        : Object.fromEntries(
            Object.entries(tokens).filter(([k]) => categoryMatchers[category].test(k))
          );

    return {
      server: MCP_SERVER_INFO.name,
      tool: toolName,
      category,
      totalTokensCount: Object.keys(filteredTokens).length,
      coreTokens: {
        brandPrimary: tokens['--color-brand-primary'],
        accentPrimary: tokens['--color-accent-primary'],
        accentPrimaryHover: tokens['--color-accent-primary-hover'],
        surfaceCanvas: tokens['--color-surface-canvas'],
        fontFamily: tokens['--font-family'],
        spaceFluid: tokens['--space-fluid'],
        sizeTouchMin: tokens['--size-touch-min'],
        radiusBtn: tokens['--radius-btn'],
        radiusMd: tokens['--radius-md'],
        btnBg: tokens['--btn-bg'],
        cardBg: tokens['--card-bg'],
        fieldMinHeight: tokens['--field-min-height']
      },
      tokens: filteredTokens
    };
  }

  if (toolName === 'design_system_audit_compliance') {
    const checks = [
      { id: 'primitive_palette_tokens', label: 'Tier 1 primitive color palette variables (--palette-*)', passed: /--palette-navy-900:\s*#0B192C/i.test(stylesContent) },
      { id: 'semantic_root_tokens', label: 'Tier 2 centralized :root semantic color variables', passed: /--color-brand-primary:\s*#0B192C/i.test(stylesContent) },
      { id: 'component_scoped_tokens', label: 'Tier 3 reusable component variables (--btn-*, --card-*, --field-*, --badge-*)', passed: /--btn-bg:\s*var\(--color-accent-cta\)/i.test(stylesContent) && /--card-bg:\s*var\(--color-surface-elevated\)/i.test(stylesContent) },
      { id: 'accent_safety_orange', label: 'Accent Primary Safety Orange (#E05B32)', passed: /--color-accent-primary:\s*#E05B32/i.test(stylesContent) },
      { id: 'accent_deep_amber_hover', label: 'Accent Primary Hover Deep Amber (#C54E29)', passed: /--color-accent-primary-hover:\s*#C54E29/i.test(stylesContent) },
      { id: 'self_hosted_font_swap', label: 'Self-hosted Plus Jakarta Sans WOFF2 with font-display: swap & fallback', passed: /font-family:\s*'Plus Jakarta Sans Fallback'/i.test(stylesContent) && /font-display:\s*swap/i.test(stylesContent) },
      { id: 'fluid_clamp_scale', label: 'Fluid typography & spacing clamp(1.5rem, 4vw, 2.4rem)', passed: /clamp\(1\.5rem,\s*4vw,\s*2\.4rem\)/i.test(stylesContent) },
      { id: 'auto_fit_grids', label: 'Auto-fitting modular grids repeat(auto-fit, minmax(220px, 1fr))', passed: /repeat\(auto-fit,\s*minmax\(220px,\s*1fr\)\)/i.test(stylesContent) },
      { id: 'targeted_breakpoints', label: 'Targeted mobile breakpoints (600px and 480px)', passed: /@media\s*\(max-width:\s*600px\)/i.test(stylesContent) && /@media\s*\(max-width:\s*480px\)/i.test(stylesContent) },
      { id: 'reduced_motion', label: 'Accessibility @media (prefers-reduced-motion: reduce)', passed: /@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(stylesContent) },
      { id: 'action_touch_target', label: 'Action elements min-height: 3.1rem & 3px radius', passed: /min-height:\s*3\.1rem/i.test(stylesContent) && /--radius-btn:\s*3px/i.test(stylesContent) },
      { id: 'reusable_form_modules', label: 'Reusable .wizard-fieldset & .wizard-choice form modules', passed: /\.wizard-fieldset\b/.test(stylesContent) && /\.wizard-choice\b/.test(stylesContent) }
    ];

    return {
      server: MCP_SERVER_INFO.name,
      tool: toolName,
      allPassed: checks.every((c) => c.passed),
      passedCount: checks.filter((c) => c.passed).length,
      totalChecks: checks.length,
      checks
    };
  }

  if (toolName === 'pages_list_and_inspect') {
    const pages = ['index.html', 'train.html', 'eligibility.html', 'volunteer.html', 'partner.html', 'donate.html', '404.html', 'backoffice.html'];
    const targetPages = args.page ? pages.filter((p) => p === args.page) : pages;

    const results = targetPages.map((page) => {
      const pPath = path.join(ROOT, page);
      if (!fs.existsSync(pPath)) return { page, exists: false };
      const html = fs.readFileSync(pPath, 'utf8');
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      return {
        page,
        exists: true,
        title: titleMatch ? titleMatch[1].trim() : null,
        h1: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null,
        hasSelfHostedFontPreload: /plus-jakarta-sans-latin-wght-normal\.woff2/i.test(html),
        hasZeroThirdPartyGoogleFonts: !/fonts\.googleapis\.com/i.test(html),
        hasSkipLink: /class=["'][^"']*skip-link/i.test(html),
        hasLocalRootOverride: /<style>[\s\S]*?:root\s*\{/i.test(html)
      };
    });

    return {
      server: MCP_SERVER_INFO.name,
      tool: toolName,
      pageCount: results.length,
      pages: results
    };
  }

  if (toolName === 'pages_scaffold_component') {
    const pattern = args.pattern || 'card';
    const prefix = args.domainPrefix || 'sb';
    const title = args.title || 'Springboards Workforce Module';
    const bodyText = args.bodyText || 'Structured trade training and WIOA-aligned career pathway support in East Alabama.';
    const ctaLabel = args.ctaLabel || 'Check Eligibility';
    const ctaHref = args.ctaHref || '/eligibility';

    let htmlSnippet = '';
    if (pattern === 'wizard-fieldset') {
      htmlSnippet = `<fieldset class="wizard-fieldset">
  <legend class="wizard-question">${title}</legend>
  <p class="wizard-help">${bodyText}</p>
  <div class="wizard-options">
    <label class="wizard-choice">
      <input type="radio" name="${prefix}-option" value="yes" />
      <span class="wizard-choice-copy">
        <strong>Yes — Ready to Proceed</strong>
        <span>${ctaLabel}</span>
      </span>
    </label>
  </div>
  <p class="wizard-error" role="status" aria-live="polite"></p>
</fieldset>`;
    } else if (pattern === 'auto-fit-grid') {
      htmlSnippet = `<section class="sb-grid sb-grid--auto-fit">
  <article class="sb-card ${prefix}__block">
    <header class="sb-card__header ${prefix}__header">
      <h3 class="sb-card__title ${prefix}__title">${title}</h3>
    </header>
    <div class="sb-card__body ${prefix}__body">
      <p>${bodyText}</p>
    </div>
    <footer class="sb-card__actions ${prefix}__actions">
      <a href="${ctaHref}" class="sb-btn sb-btn--primary">
        <span class="sb-btn__label">${ctaLabel}</span>
      </a>
    </footer>
  </article>
</section>`;
    } else {
      htmlSnippet = `<article class="sb-card ${prefix}__block">
  <header class="sb-card__header ${prefix}__header">
    <h3 class="sb-card__title ${prefix}__title">${title}</h3>
  </header>
  <div class="sb-card__body ${prefix}__body">
    <p>${bodyText}</p>
  </div>
  <footer class="sb-card__actions ${prefix}__actions">
    <a href="${ctaHref}" class="sb-btn sb-btn--primary">
      <span class="sb-btn__label">${ctaLabel}</span>
    </a>
  </footer>
</article>`;
    }

    return {
      server: MCP_SERVER_INFO.name,
      tool: toolName,
      pattern,
      domainPrefix: prefix,
      htmlSnippet
    };
  }

  if (toolName === 'content_workflow_manage') {
    const dataPath = path.join(ROOT, 'backoffice-data.json');
    const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf8')) : {};
    const rbac = data.teamRbacAndWorkflows || {};
    const workflows = rbac.publishingWorkflowRequests || [];

    if (args.operation === 'create_draft') {
      const newWf = {
        id: `wf-mcp-${Date.now()}`,
        title: args.title || 'MCP-Assisted Page & Design System Update',
        targetRoute: args.targetRoute || '/',
        category: 'MCP Content & Design System Workflow',
        authorName: args.actorName || 'Marilynn Ward',
        authorRole: 'Lead Designer, Developer & Technical Publisher',
        complianceReviewer: 'Giselle Campos (Education/WIOA) & Shamia Morgan (Policy)',
        executiveApprover: 'Marvin Thompson (Executive Director)',
        publisherName: 'Marilynn Ward (Technical Publisher)',
        driveEvidenceDoc: 'Springboards Workforce Programs Tracker',
        currentStage: 'stage_1_draft',
        statusLabel: 'Stage 1: MCP Draft Created — Ready for Domain & Compliance Review',
        updatedAt: new Date().toISOString(),
        notes: args.notes || 'Created via Springboards MCP content workflow tool.'
      };
      workflows.unshift(newWf);
      if (data.teamRbacAndWorkflows) {
        data.teamRbacAndWorkflows.publishingWorkflowRequests = workflows;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
      }
      return {
        server: MCP_SERVER_INFO.name,
        tool: toolName,
        operation: 'create_draft',
        createdWorkflow: newWf,
        totalWorkflows: workflows.length
      };
    }

    return {
      server: MCP_SERVER_INFO.name,
      tool: toolName,
      operation: 'list',
      totalWorkflows: workflows.length,
      workflows: workflows.slice(0, 10),
      capabilitiesAndPermissions: MCP_CAPABILITIES_AND_PERMISSIONS
    };
  }

  throw new Error(`Unknown MCP tool: ${toolName}`);
}

// CLI execution & verification mode when invoked directly
const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isMain) {
  if (process.argv.includes('--verify')) {
    const tokenReport = executeMcpTool('design_system_inspect_tokens');
    const auditReport = executeMcpTool('design_system_audit_compliance');
    const pagesReport = executeMcpTool('pages_list_and_inspect');
    console.log(JSON.stringify({
      mcpServer: MCP_SERVER_INFO,
      capabilities: MCP_CAPABILITIES_AND_PERMISSIONS.supportedCapabilities,
      tokensVerified: tokenReport.totalTokensCount,
      designSystemAudit: auditReport,
      pagesInspected: pagesReport.pageCount
    }, null, 2));
    process.exit(auditReport.allPassed ? 0 : 1);
  } else {
    // Standard MCP JSON-RPC 2.0 stdio transport
    const rl = readline.createInterface({ input: process.stdin, terminal: false });
    rl.on('line', (line) => {
      if (!line.trim()) return;
      try {
        const req = JSON.parse(line);
        const { id, method, params } = req;
        if (method === 'initialize') {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: MCP_SERVER_INFO.protocolVersion,
              serverInfo: { name: MCP_SERVER_INFO.name, version: MCP_SERVER_INFO.version },
              capabilities: { tools: {}, resources: {} }
            }
          }) + '\n');
        } else if (method === 'tools/list') {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: { tools: MCP_TOOLS }
          }) + '\n');
        } else if (method === 'tools/call') {
          const result = executeMcpTool(params?.name, params?.arguments || {});
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
            }
          }) + '\n');
        } else if (method === 'resources/list') {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: { resources: MCP_RESOURCES }
          }) + '\n');
        } else if (id !== undefined) {
          process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result: {} }) + '\n');
        }
      } catch (err) {
        process.stderr.write(`[MCP Error] ${err.message}\n`);
      }
    });
  }
}
