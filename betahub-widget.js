/**
 * BetaHub Feedback Widget
 * Embeddable feedback widget for games and web applications
 *
 * Usage:
 * <script src="betahub-widget.js"></script>
 * <script>
 *   BetaHubWidget.init({
 *     projectId: 'your-project-id',
 *     authToken: 'tkn-your-token',
 *     apiBaseUrl: 'https://app.betahub.io', // optional
 *     releaseLabel: '1.0.0', // optional - version label (auto-creates if not exists, defaults to latest release)
 *     customFields: { gameVersion: '1.0.0' }, // optional
 *     position: 'bottom-right', // button position
 *     buttonText: 'Feedback', // button text
 *
 *     // Contact information options (optional)
 *     userEmail: 'user@example.com', // pre-filled user email
 *     requireEmail: false, // require email for bugs/suggestions (tickets always require)
 *     showEmailField: 'auto' // 'auto', 'always', 'never'
 *   });
 * </script>
 */

(function(window) {
  'use strict';

  // Theme Definitions
  const THEMES = {
    'pastel-blue': {
      '--primary-button': '#237390',
      '--primary-button-hover': '#1E627B',
      '--primary-button-active': '#144252',
      '--primary-button-disabled-bg': '#B1D5E2',
      '--primary-button-disabled-text': '#788087',
      '--header-bg': '#DCEFF7',
      '--modal-bg': '#FFFFFF',
      '--modal-border': '#B1D5E2',
      '--content-bg': '#FFFFFF',
      '--alt-bg': '#F7F9FA',
      '--text-primary': '#2C3E50',
      '--text-secondary': '#6F7F90',
      '--text-disabled': '#788087',
      '--border-color': '#B1D5E2',
      '--border-top-color': '#DCEFF7',
      '--input-bg': '#FFFFFF',
      '--input-border': '#B1D5E2',
      '--input-focus-border': '#A8D8EA',
      '--type-btn-bg': '#F7F9FA',
      '--type-btn-border': '#B1D5E2',
      '--type-btn-hover-bg': '#DCEFF7',
      '--type-btn-hover-border': '#A8D8EA',
      '--type-btn-active-bug': '#F47C7C',
      '--type-btn-active-suggestion': '#58CEA7',
      '--type-btn-active-support': '#237390',
      '--success-color': '#58CEA7',
      '--success-hover': '#3FB88F',
      '--warning-bg': '#FEF3E0',
      '--warning-border': '#F8C060',
      '--warning-text': '#92400e',
      '--warning-text-strong': '#78350f',
      '--error-color': '#F47C7C',
      '--error-hover': '#F05B5B',
      '--error-bg': '#FEEDED',
      '--error-border': '#F47C7C',
      '--error-text': '#E75555',
      '--scrollbar-track': '#F7F9FA',
      '--scrollbar-thumb': '#B1D5E2',
      '--overlay-bg': 'rgba(0, 0, 0, 0.7)',
      '--shadow-button': 'rgba(35, 115, 144, 0.3)',
      '--shadow-button-hover': 'rgba(35, 115, 144, 0.4)',
      '--shadow-modal': 'rgba(35, 115, 144, 0.15)'
    },
    'light': {
      '--primary-button': '#0a714e',
      '--primary-button-hover': '#085e41',
      '--primary-button-active': '#06422e',
      '--primary-button-disabled-bg': '#D1D5DB',
      '--primary-button-disabled-text': '#9CA3AF',
      '--header-bg': '#E8F5F1',
      '--modal-bg': '#FFFFFF',
      '--modal-border': '#D1D5DB',
      '--content-bg': '#FFFFFF',
      '--alt-bg': '#F7F9FA',
      '--text-primary': '#1F2937',
      '--text-secondary': '#6B7280',
      '--text-disabled': '#9CA3AF',
      '--border-color': '#D1D5DB',
      '--border-top-color': '#E8F5F1',
      '--input-bg': '#FFFFFF',
      '--input-border': '#D1D5DB',
      '--input-focus-border': '#10B981',
      '--type-btn-bg': '#F7F9FA',
      '--type-btn-border': '#D1D5DB',
      '--type-btn-hover-bg': '#E8F5F1',
      '--type-btn-hover-border': '#10B981',
      '--type-btn-active-bug': '#EF4444',
      '--type-btn-active-suggestion': '#10B981',
      '--type-btn-active-support': '#0a714e',
      '--success-color': '#10B981',
      '--success-hover': '#059669',
      '--warning-bg': '#FEF3C7',
      '--warning-border': '#F59E0B',
      '--warning-text': '#92400e',
      '--warning-text-strong': '#78350f',
      '--error-color': '#EF4444',
      '--error-hover': '#DC2626',
      '--error-bg': '#FEE2E2',
      '--error-border': '#EF4444',
      '--error-text': '#DC2626',
      '--scrollbar-track': '#F7F9FA',
      '--scrollbar-thumb': '#D1D5DB',
      '--overlay-bg': 'rgba(0, 0, 0, 0.7)',
      '--shadow-button': 'rgba(16, 185, 129, 0.3)',
      '--shadow-button-hover': 'rgba(16, 185, 129, 0.4)',
      '--shadow-modal': 'rgba(16, 185, 129, 0.15)'
    },
    'dark': {
      '--primary-button': '#10B981',
      '--primary-button-hover': '#14eba3',
      '--primary-button-active': '#0c8d62',
      '--primary-button-disabled-bg': '#374151',
      '--primary-button-disabled-text': '#6B7280',
      '--header-bg': '#1F2937',
      '--modal-bg': '#111827',
      '--modal-border': '#4B5563',
      '--content-bg': '#111827',
      '--alt-bg': '#374151',
      '--text-primary': '#F3F4F6',
      '--text-secondary': '#9CA3AF',
      '--text-disabled': '#6B7280',
      '--border-color': '#4B5563',
      '--border-top-color': '#374151',
      '--input-bg': '#1F2937',
      '--input-border': '#4B5563',
      '--input-focus-border': '#10B981',
      '--type-btn-bg': '#374151',
      '--type-btn-border': '#4B5563',
      '--type-btn-hover-bg': '#1F2937',
      '--type-btn-hover-border': '#10B981',
      '--type-btn-active-bug': '#F87171',
      '--type-btn-active-suggestion': '#10B981',
      '--type-btn-active-support': '#10B981',
      '--success-color': '#10B981',
      '--success-hover': '#059669',
      '--warning-bg': '#451A03',
      '--warning-border': '#FBBF24',
      '--warning-text': '#FCD34D',
      '--warning-text-strong': '#FEF3C7',
      '--error-color': '#F87171',
      '--error-hover': '#EF4444',
      '--error-bg': '#450A0A',
      '--error-border': '#F87171',
      '--error-text': '#FCA5A5',
      '--scrollbar-track': '#374151',
      '--scrollbar-thumb': '#4B5563',
      '--overlay-bg': 'rgba(0, 0, 0, 0.8)',
      '--shadow-button': 'rgba(16, 185, 129, 0.3)',
      '--shadow-button-hover': 'rgba(16, 185, 129, 0.4)',
      '--shadow-modal': 'rgba(0, 0, 0, 0.5)'
    }
  };

  const BetaHubWidget = {
    config: {
      projectId: null,
      authToken: null,
      apiBaseUrl: 'https://app.betahub.io',
      releaseLabel: null,
      customFields: {},
      position: 'bottom-right',
      buttonText: 'Feedback',
      // Contact information options
      userEmail: null,
      requireEmail: false,
      showEmailField: 'auto',  // 'auto', 'always', 'never'
      // Theme options
      theme: 'pastel-blue',  // 'pastel-blue', 'light', 'dark'
      styleOverrides: {},  // CSS variables to override theme colors
      // Feedback type options
      enabledTypes: ['bug', 'suggestion', 'support']  // Array of enabled feedback types
    },

    // Internal state
    validatedTypes: [],
    configError: null,

    init: function(options) {
      if (!options.projectId || !options.authToken) {
        console.error('BetaHub Widget: projectId and authToken are required');
        return;
      }

      // Merge config
      this.config = Object.assign({}, this.config, options);

      // Validate enabledTypes configuration
      this.validateEnabledTypes();

      // Create widget
      this.createWidget();
    },

    validateEnabledTypes: function() {
      const VALID_TYPES = ['bug', 'suggestion', 'support'];
      const enabledTypes = this.config.enabledTypes;

      // Check if enabledTypes is an array
      if (!Array.isArray(enabledTypes)) {
        this.configError = {
          title: 'Configuration Error: Invalid enabledTypes',
          message: `The 'enabledTypes' option must be an array of strings. Received: ${typeof enabledTypes}`,
          fix: `Change to: enabledTypes: ['bug', 'suggestion', 'support']`
        };
        console.error('BetaHub Widget Configuration Error:', this.configError.message);
        console.error('Fix:', this.configError.fix);
        return;
      }

      // Check if array is empty
      if (enabledTypes.length === 0) {
        this.configError = {
          title: 'Configuration Error: No Feedback Types Enabled',
          message: `The 'enabledTypes' array is empty. At least one feedback type must be enabled.`,
          fix: `Add at least one type: enabledTypes: ['bug'] or ['suggestion'] or ['support']`
        };
        console.error('BetaHub Widget Configuration Error:', this.configError.message);
        console.error('Fix:', this.configError.fix);
        return;
      }

      // Filter valid types and warn about invalid ones
      const validTypes = [];
      const invalidTypes = [];

      enabledTypes.forEach(type => {
        if (VALID_TYPES.includes(type)) {
          validTypes.push(type);
        } else {
          invalidTypes.push(type);
        }
      });

      // Warn about invalid types
      if (invalidTypes.length > 0) {
        console.warn(`BetaHub Widget: Invalid feedback type(s) ignored: ${invalidTypes.join(', ')}`);
        console.warn(`Valid types are: ${VALID_TYPES.join(', ')}`);
      }

      // Check if all types were invalid
      if (validTypes.length === 0) {
        this.configError = {
          title: 'Configuration Error: No Valid Feedback Types',
          message: `All specified feedback types are invalid: ${invalidTypes.join(', ')}`,
          fix: `Use valid types: enabledTypes: ['bug', 'suggestion', 'support']`
        };
        console.error('BetaHub Widget Configuration Error:', this.configError.message);
        console.error('Valid types:', VALID_TYPES.join(', '));
        console.error('Fix:', this.configError.fix);
        return;
      }

      // Store validated types
      this.validatedTypes = validTypes;
      console.log('BetaHub Widget: Enabled feedback types:', validTypes.join(', '));
    },

    createWidget: function() {
      // Create container
      const container = document.createElement('div');
      container.id = 'betahub-widget-container';
      document.body.appendChild(container);

      // Create shadow root for CSS isolation
      const shadow = container.attachShadow({ mode: 'open' });

      // Inject styles and HTML
      shadow.innerHTML = this.getTemplate();

      // Store references
      this.shadow = shadow;
      this.container = container;

      // Apply theme
      this.applyTheme();

      // Initialize
      this.initializeUI();
      this.attachEventListeners();
    },

    applyTheme: function() {
      // Validate theme exists
      const themeName = this.config.theme || 'pastel-blue';
      if (!THEMES[themeName]) {
        console.warn(`BetaHub Widget: Theme "${themeName}" not found, falling back to "pastel-blue"`);
        this.config.theme = 'pastel-blue';
      }

      // Get theme colors
      const themeColors = THEMES[this.config.theme] || THEMES['pastel-blue'];

      // Merge with user overrides
      const finalColors = Object.assign({}, themeColors, this.config.styleOverrides);

      // Apply CSS variables to shadow root
      const style = document.createElement('style');
      const cssVars = Object.entries(finalColors)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n    ');

      style.textContent = `
        :host {
          ${cssVars}
        }
      `;

      this.shadow.appendChild(style);
    },

    getTemplate: function() {
      return `
        <style>
          ${this.getStyles()}
        </style>
        <div class="betahub-widget">
          <!-- Floating Button -->
          <button class="betahub-button" id="betahub-open-btn">
            ${this.getIcon('feedback')}
            <span>${this.config.buttonText}</span>
          </button>

          <!-- Modal Overlay -->
          <div class="betahub-modal-overlay" id="betahub-modal">
            <div class="betahub-modal">
              <!-- Header -->
              <div class="betahub-header">
                <h2>${this.getIcon('form')} Submit Feedback</h2>
              </div>

              <!-- Content -->
              <div class="betahub-content">
                <!-- Warning Box -->
                <div class="betahub-warning-box">
                  <p><strong>⚠️ One Entry at a Time</strong><br>
                  Please submit only ONE item per form. If you have multiple items, submit them separately.</p>
                </div>

                <!-- Single Type Indicator (shown when only one type is enabled) -->
                <div class="betahub-form-group betahub-single-type-indicator hidden" id="betahub-single-type-indicator">
                  <label class="betahub-form-label">Feedback Type</label>
                  <div class="betahub-type-badge" id="betahub-type-badge">
                    <span id="betahub-type-badge-text">Bug Report</span>
                  </div>
                </div>

                <!-- Feedback Type Selector (shown when multiple types are enabled) -->
                <div class="betahub-form-group" id="betahub-type-selector-group">
                  <label class="betahub-form-label">Feedback Type</label>
                  <div class="betahub-type-selector">
                    <button class="betahub-type-btn active" data-type="bug">
                      Bug Report
                    </button>
                    <button class="betahub-type-btn" data-type="suggestion">
                      Suggestion
                    </button>
                    <button class="betahub-type-btn" data-type="support">
                      Support
                    </button>
                  </div>
                </div>

                <!-- Description Field -->
                <div class="betahub-form-group">
                  <label class="betahub-form-label" id="betahub-description-label">Description</label>
                  <textarea
                    id="betahub-description"
                    placeholder="Describe the bug you encountered..."
                    maxlength="2000"
                  ></textarea>
                  <div class="betahub-char-count">
                    <span id="betahub-char-count">0</span> / 2000
                  </div>
                </div>

                <!-- Steps to Reproduce (Bug only) -->
                <div class="betahub-form-group" id="betahub-steps-group">
                  <label class="betahub-form-label">Steps to Reproduce</label>
                  <textarea
                    id="betahub-steps"
                    class="betahub-steps-textarea"
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..."
                    maxlength="1000"
                  ></textarea>
                  <div class="betahub-char-count">
                    <span id="betahub-steps-count">0</span> / 1000
                  </div>
                </div>

                <!-- Email Field (conditional) -->
                <div class="betahub-form-group" id="betahub-email-group">
                  <label class="betahub-form-label">Email Address</label>
                  <input
                    type="email"
                    id="betahub-email"
                    class="betahub-email-input"
                    placeholder="your.email@example.com"
                    maxlength="255"
                  />
                  <div class="betahub-field-hint">
                    We'll use this to contact you about updates
                  </div>
                </div>

                <!-- Button Group -->
                <div class="betahub-button-group">
                  <button class="betahub-btn betahub-btn-secondary" id="betahub-cancel-btn">Cancel</button>
                  <button class="betahub-btn betahub-btn-primary" id="betahub-submit-btn" disabled>Submit Feedback</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Modal -->
          <div class="betahub-modal-overlay" id="betahub-success-modal">
            <div class="betahub-modal betahub-small-modal">
              <div class="betahub-header">
                <h3 class="betahub-modal-title">✅ Thank You!</h3>
              </div>
              <div class="betahub-modal-body">
                Your feedback has been submitted successfully. We appreciate you taking the time to help us improve!
              </div>
              <div class="betahub-modal-footer">
                <button class="betahub-btn betahub-btn-success" id="betahub-success-ok">Close</button>
              </div>
            </div>
          </div>

          <!-- Error Modal -->
          <div class="betahub-modal-overlay" id="betahub-error-modal">
            <div class="betahub-modal betahub-small-modal">
              <div class="betahub-header">
                <h3 class="betahub-modal-title">❌ Submission Failed</h3>
              </div>
              <div class="betahub-modal-body">
                We couldn't submit your feedback. Please try again.
                <div class="betahub-error-box">
                  <p id="betahub-error-message">Network error: Unable to reach the server</p>
                </div>
              </div>
              <div class="betahub-modal-footer">
                <button class="betahub-btn betahub-btn-secondary" id="betahub-error-cancel">Cancel</button>
                <button class="betahub-btn betahub-btn-primary" id="betahub-error-retry">Try Again</button>
              </div>
            </div>
          </div>

          <!-- Cancel Confirmation Modal -->
          <div class="betahub-modal-overlay" id="betahub-cancel-modal">
            <div class="betahub-modal betahub-small-modal">
              <div class="betahub-header">
                <h3 class="betahub-modal-title">⚠️ Discard Feedback?</h3>
              </div>
              <div class="betahub-modal-body">
                Are you sure you want to cancel? Your feedback will be lost.
              </div>
              <div class="betahub-modal-footer">
                <button class="betahub-btn betahub-btn-secondary" id="betahub-cancel-no">No, Keep Writing</button>
                <button class="betahub-btn betahub-btn-danger" id="betahub-cancel-yes">Yes, Discard</button>
              </div>
            </div>
          </div>

          <!-- Configuration Error Modal -->
          <div class="betahub-modal-overlay" id="betahub-config-error-modal">
            <div class="betahub-modal betahub-small-modal">
              <div class="betahub-header">
                <h3 class="betahub-modal-title" id="betahub-config-error-title">⚙️ Configuration Error</h3>
              </div>
              <div class="betahub-modal-body">
                <p id="betahub-config-error-message">There is a configuration error.</p>
                <div class="betahub-error-box">
                  <strong>How to fix:</strong>
                  <p id="betahub-config-error-fix">Check your configuration.</p>
                </div>
              </div>
              <div class="betahub-modal-footer">
                <button class="betahub-btn betahub-btn-primary" id="betahub-config-error-close">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    getStyles: function() {
      const position = this.config.position;
      const buttonPosition = this.getButtonPosition(position);

      return `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .betahub-widget {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-primary);
          position: relative;
          z-index: 999999;
        }

        /* Floating Button */
        .betahub-button {
          position: fixed;
          ${buttonPosition.vertical}: 20px;
          ${buttonPosition.horizontal}: 20px;
          background: var(--primary-button);
          color: #ffffff;
          border: none;
          border-radius: 24px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px var(--shadow-button);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 999999;
        }

        .betahub-button:hover {
          background: var(--primary-button-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px var(--shadow-button-hover);
        }

        /* Modal Overlay */
        .betahub-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--overlay-bg);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          z-index: 1000000;
        }

        .betahub-modal-overlay.show {
          opacity: 1;
          pointer-events: all;
        }

        .betahub-modal {
          background: var(--modal-bg);
          box-shadow: 0 8px 32px var(--shadow-modal);
          border-radius: 8px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          transform: scale(0.9);
          transition: transform 0.2s, background-color 0.3s;
        }

        .betahub-modal-overlay.show .betahub-modal {
          transform: scale(1);
        }

        .betahub-small-modal {
          max-width: 400px;
        }

        /* Header */
        .betahub-header {
          background: var(--header-bg);
          border-bottom: 1px solid var(--modal-border);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.3s;
        }

        .betahub-header h2,
        .betahub-modal-title {
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Content */
        .betahub-content {
          padding: 20px;
        }

        .betahub-modal-body {
          padding: 20px;
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
        }

        .betahub-modal-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border-top-color);
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        /* Warning Box */
        .betahub-warning-box {
          background: var(--warning-bg);
          border: 1px solid var(--warning-border);
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }

        .betahub-warning-box p {
          color: var(--warning-text);
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }

        .betahub-warning-box strong {
          color: var(--warning-text-strong);
        }

        /* Form Groups */
        .betahub-form-group {
          margin-bottom: 20px;
        }

        .betahub-form-group.hidden {
          display: none;
        }

        .betahub-form-label {
          display: block;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Type Selector */
        .betahub-type-selector {
          display: flex;
          gap: 8px;
        }

        .betahub-type-btn {
          flex: 1;
          padding: 14px 12px;
          background: var(--type-btn-bg);
          border: 2px solid var(--type-btn-border);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .betahub-type-btn:hover {
          background: var(--type-btn-hover-bg);
          border-color: var(--type-btn-hover-border);
        }

        .betahub-type-btn.active {
          background: var(--type-btn-active-bug);
          border-color: var(--type-btn-active-bug);
          color: #ffffff;
        }

        .betahub-type-btn[data-type="suggestion"].active {
          background: var(--type-btn-active-suggestion);
          border-color: var(--type-btn-active-suggestion);
        }

        .betahub-type-btn[data-type="support"].active {
          background: var(--type-btn-active-support);
          border-color: var(--type-btn-active-support);
        }

        /* Single Type Badge */
        .betahub-type-badge {
          display: inline-flex;
          align-items: center;
          padding: 10px 16px;
          background: var(--type-btn-bg);
          border: 2px solid var(--type-btn-border);
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
        }

        .betahub-type-badge.type-bug {
          background: var(--type-btn-active-bug);
          border-color: var(--type-btn-active-bug);
          color: #ffffff;
        }

        .betahub-type-badge.type-suggestion {
          background: var(--type-btn-active-suggestion);
          border-color: var(--type-btn-active-suggestion);
          color: #ffffff;
        }

        .betahub-type-badge.type-support {
          background: var(--type-btn-active-support);
          border-color: var(--type-btn-active-support);
          color: #ffffff;
        }

        /* Textarea */
        textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 14px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          resize: vertical;
          transition: all 0.2s;
        }

        textarea:focus {
          outline: none;
          border-color: var(--input-focus-border);
        }

        textarea::placeholder {
          color: var(--text-disabled);
        }

        .betahub-steps-textarea {
          min-height: 90px;
        }

        .betahub-char-count {
          text-align: right;
          color: var(--text-disabled);
          font-size: 12px;
          margin-top: 4px;
        }

        /* Email Input */
        .betahub-email-input {
          width: 100%;
          padding: 12px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 14px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          transition: all 0.2s;
        }

        .betahub-email-input:focus {
          outline: none;
          border-color: var(--input-focus-border);
        }

        .betahub-email-input::placeholder {
          color: var(--text-disabled);
        }

        .betahub-email-input:read-only {
          background: var(--alt-bg);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .betahub-field-hint {
          color: var(--text-disabled);
          font-size: 12px;
          margin-top: 4px;
        }

        /* Buttons */
        .betahub-button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-top-color);
        }

        .betahub-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .betahub-btn-primary {
          flex: 1;
          background: var(--primary-button);
          color: #ffffff;
        }

        .betahub-btn-primary:hover:not(:disabled) {
          background: var(--primary-button-hover);
        }

        .betahub-btn-primary:active:not(:disabled) {
          background: var(--primary-button-active);
        }

        .betahub-btn-primary:disabled {
          background: var(--primary-button-disabled-bg);
          color: var(--primary-button-disabled-text);
          cursor: not-allowed;
        }

        .betahub-btn-secondary {
          background: transparent;
          color: var(--text-secondary);
          padding: 12px 16px;
        }

        .betahub-btn-secondary:hover {
          background: var(--type-btn-hover-bg);
          color: var(--text-primary);
        }

        .betahub-btn-danger {
          background: var(--error-color);
          color: #ffffff;
        }

        .betahub-btn-danger:hover {
          background: var(--error-hover);
        }

        .betahub-btn-success {
          background: var(--success-color);
          color: #ffffff;
        }

        .betahub-btn-success:hover {
          background: var(--success-hover);
        }

        /* Error Box */
        .betahub-error-box {
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 6px;
          padding: 12px;
          margin-top: 12px;
        }

        .betahub-error-box p {
          color: var(--error-text);
          font-size: 13px;
          margin: 0;
        }

        /* Scrollbar Styling */
        .betahub-modal::-webkit-scrollbar {
          width: 8px;
        }

        .betahub-modal::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
        }

        .betahub-modal::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 4px;
        }
      `;
    },

    getButtonPosition: function(position) {
      const positions = {
        'bottom-right': { vertical: 'bottom', horizontal: 'right' },
        'bottom-left': { vertical: 'bottom', horizontal: 'left' },
        'top-right': { vertical: 'top', horizontal: 'right' },
        'top-left': { vertical: 'top', horizontal: 'left' }
      };
      return positions[position] || positions['bottom-right'];
    },

    getIcon: function(type) {
      const icons = {
        feedback: '💬',
        form: '📋',
        bug: '🐛',
        suggestion: '💡',
        support: '❓'
      };
      return icons[type] || '';
    },

    initializeUI: function() {
      // Determine initial type based on enabled types
      const isSingleType = this.validatedTypes.length === 1;

      if (isSingleType) {
        // Auto-select the only enabled type
        this.currentType = this.validatedTypes[0];
        this.showSingleTypeMode();
      } else {
        // Default to first enabled type (or 'bug' if available)
        this.currentType = this.validatedTypes.includes('bug') ? 'bug' : this.validatedTypes[0];
        this.showMultiTypeMode();
      }

      this.initializeEmailField();
      this.updateEmailFieldVisibility();
    },

    showSingleTypeMode: function() {
      // Hide both type selector and type indicator
      const selectorGroup = this.shadow.querySelector('#betahub-type-selector-group');
      const indicator = this.shadow.querySelector('#betahub-single-type-indicator');

      selectorGroup.classList.add('hidden');
      indicator.classList.add('hidden');

      // Update form for the selected type
      this.updateFormForType(this.currentType);
    },

    showMultiTypeMode: function() {
      // Show type selector, hide type badge
      const selectorGroup = this.shadow.querySelector('#betahub-type-selector-group');
      const indicator = this.shadow.querySelector('#betahub-single-type-indicator');

      selectorGroup.classList.remove('hidden');
      indicator.classList.add('hidden');

      // Hide/show type buttons based on enabled types
      const typeButtons = this.shadow.querySelectorAll('.betahub-type-btn');
      typeButtons.forEach(btn => {
        const type = btn.dataset.type;
        if (this.validatedTypes.includes(type)) {
          btn.style.display = '';
          if (type === this.currentType) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        } else {
          btn.style.display = 'none';
        }
      });

      // Update form for the selected type
      this.updateFormForType(this.currentType);
    },

    updateFormForType: function(type) {
      // Update placeholders
      const placeholders = {
        bug: 'Describe the bug you encountered...',
        suggestion: 'Describe your suggestion in detail...',
        support: 'What do you need help with?'
      };

      this.shadow.querySelector('#betahub-description').placeholder = placeholders[type];

      // Show/hide steps field for bugs
      const stepsGroup = this.shadow.querySelector('#betahub-steps-group');
      if (type === 'bug') {
        stepsGroup.classList.remove('hidden');
      } else {
        stepsGroup.classList.add('hidden');
      }

      // Update email field visibility based on type
      this.updateEmailFieldVisibility();
    },

    initializeEmailField: function() {
      const emailInput = this.shadow.querySelector('#betahub-email');

      // Set pre-filled email if provided
      if (this.config.userEmail) {
        emailInput.value = this.config.userEmail;

        // Make readonly if prefilled (user can't edit)
        emailInput.readOnly = true;
      }
    },

    shouldShowEmailField: function() {
      const { showEmailField, userEmail, requireEmail } = this.config;

      // showEmailField = 'never' → always hide
      if (showEmailField === 'never') {
        return false;
      }

      // showEmailField = 'always' → always show
      if (showEmailField === 'always') {
        return true;
      }

      // showEmailField = 'auto' (default) → smart logic
      // Show if email is prefilled (readonly display)
      if (userEmail) {
        return true;
      }

      // Show if email is required for this feedback type
      if (this.currentType === 'support') {
        return true;  // Tickets always need email
      }

      if (requireEmail) {
        return true;  // Bugs/suggestions need email if configured
      }

      return false;  // Hide for anonymous bugs/suggestions
    },

    updateEmailFieldVisibility: function() {
      const emailGroup = this.shadow.querySelector('#betahub-email-group');
      const shouldShow = this.shouldShowEmailField();

      if (shouldShow) {
        emailGroup.classList.remove('hidden');
      } else {
        emailGroup.classList.add('hidden');
      }

      this.updateSubmitButton();
    },

    attachEventListeners: function() {
      const $ = (selector) => this.shadow.querySelector(selector);

      // Open modal
      $('#betahub-open-btn').addEventListener('click', () => this.openModal());

      // Type selection
      $$('.betahub-type-btn').forEach(btn => {
        btn.addEventListener('click', () => this.selectType(btn.dataset.type));
      });

      // Character counting
      $('#betahub-description').addEventListener('input', () => this.updateCharCount());
      $('#betahub-steps').addEventListener('input', () => this.updateStepsCount());
      $('#betahub-email').addEventListener('input', () => this.updateSubmitButton());

      // Submit
      $('#betahub-submit-btn').addEventListener('click', () => this.submitFeedback());

      // Cancel
      $('#betahub-cancel-btn').addEventListener('click', () => this.handleCancel());
      $('#betahub-cancel-no').addEventListener('click', () => this.hideModal($('#betahub-cancel-modal')));
      $('#betahub-cancel-yes').addEventListener('click', () => {
        this.hideModal($('#betahub-cancel-modal'));
        this.closeModal();
      });

      // Success
      $('#betahub-success-ok').addEventListener('click', () => {
        this.hideModal($('#betahub-success-modal'));
        this.closeModal();
      });

      // Error
      $('#betahub-error-cancel').addEventListener('click', () => this.hideModal($('#betahub-error-modal')));
      $('#betahub-error-retry').addEventListener('click', () => {
        this.hideModal($('#betahub-error-modal'));
        this.submitFeedback();
      });

      // Config Error
      $('#betahub-config-error-close').addEventListener('click', () => this.hideModal($('#betahub-config-error-modal')));

      // Close on overlay click
      [
        $('#betahub-modal'),
        $('#betahub-success-modal'),
        $('#betahub-error-modal'),
        $('#betahub-cancel-modal'),
        $('#betahub-config-error-modal')
      ].forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.hideModal(modal);
          }
        });
      });

      // Helper for querySelectorAll
      function $$(selector) {
        return Array.from(BetaHubWidget.shadow.querySelectorAll(selector));
      }
    },

    openModal: function() {
      // Check if there's a configuration error
      if (this.configError) {
        this.showConfigErrorModal();
        return;
      }

      const modal = this.shadow.querySelector('#betahub-modal');
      this.showModal(modal);
    },

    showConfigErrorModal: function() {
      const modal = this.shadow.querySelector('#betahub-config-error-modal');
      const titleEl = this.shadow.querySelector('#betahub-config-error-title');
      const messageEl = this.shadow.querySelector('#betahub-config-error-message');
      const fixEl = this.shadow.querySelector('#betahub-config-error-fix');

      // Populate error details
      titleEl.textContent = `⚙️ ${this.configError.title}`;
      messageEl.textContent = this.configError.message;
      fixEl.textContent = this.configError.fix;

      this.showModal(modal);
    },

    // Public method to open the widget from external code
    open: function() {
      this.openModal();
    },

    // Public method to update custom fields dynamically
    updateCustomFields: function(fields) {
      if (!fields || typeof fields !== 'object') {
        console.warn('BetaHub Widget: updateCustomFields() requires an object parameter');
        return;
      }

      // Merge new fields with existing customFields
      this.config.customFields = Object.assign({}, this.config.customFields, fields);
    },

    closeModal: function() {
      const modal = this.shadow.querySelector('#betahub-modal');
      this.hideModal(modal);
      this.clearForm();
    },

    showModal: function(modal) {
      modal.classList.add('show');
    },

    hideModal: function(modal) {
      modal.classList.remove('show');
    },

    selectType: function(type) {
      // Only allow selecting enabled types
      if (!this.validatedTypes.includes(type)) {
        console.warn(`BetaHub Widget: Cannot select disabled feedback type: ${type}`);
        return;
      }

      this.currentType = type;

      // Update buttons
      this.shadow.querySelectorAll('.betahub-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
      });

      // Update form for the selected type
      this.updateFormForType(type);
    },

    updateCharCount: function() {
      const textarea = this.shadow.querySelector('#betahub-description');
      const counter = this.shadow.querySelector('#betahub-char-count');
      counter.textContent = textarea.value.length;
      this.updateSubmitButton();
    },

    updateStepsCount: function() {
      const textarea = this.shadow.querySelector('#betahub-steps');
      const counter = this.shadow.querySelector('#betahub-steps-count');
      counter.textContent = textarea.value.length;
      this.updateSubmitButton();
    },

    updateSubmitButton: function() {
      const description = this.shadow.querySelector('#betahub-description').value.trim();
      const steps = this.shadow.querySelector('#betahub-steps').value.trim();
      const email = this.shadow.querySelector('#betahub-email').value.trim();
      const emailGroup = this.shadow.querySelector('#betahub-email-group');
      const submitBtn = this.shadow.querySelector('#betahub-submit-btn');

      const hasDescription = description.length > 0;
      const hasSteps = this.currentType !== 'bug' || steps.length > 0;

      // Check if email is required and valid
      const emailVisible = !emailGroup.classList.contains('hidden');
      const emailRequired = emailVisible && !this.config.userEmail;  // Required if shown and not prefilled
      const hasValidEmail = !emailRequired || (email.length > 0 && this.isValidEmail(email));

      submitBtn.disabled = !(hasDescription && hasSteps && hasValidEmail);
    },

    isValidEmail: function(email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    getAuthorizationHeader: function() {
      const email = this.getUserEmail();

      // If email available, include it in auth header
      if (email) {
        return `FormUser ${this.config.authToken},email:${email}`;
      }

      // Otherwise, just use the auth token
      return `FormUser ${this.config.authToken}`;
    },

    getUserEmail: function() {
      // Priority: 1) Prefilled userEmail, 2) User-entered email from form
      if (this.config.userEmail) {
        return this.config.userEmail;
      }

      const emailInput = this.shadow.querySelector('#betahub-email');
      const emailGroup = this.shadow.querySelector('#betahub-email-group');

      // Only get email from form if field is visible and has value
      if (!emailGroup.classList.contains('hidden') && emailInput.value.trim()) {
        return emailInput.value.trim();
      }

      return null;
    },

    handleCancel: function() {
      const description = this.shadow.querySelector('#betahub-description').value.trim();
      const steps = this.shadow.querySelector('#betahub-steps').value.trim();
      const email = this.shadow.querySelector('#betahub-email').value.trim();
      const hasPrefilledEmail = this.config.userEmail;

      if (description || steps || (email && !hasPrefilledEmail)) {
        this.showModal(this.shadow.querySelector('#betahub-cancel-modal'));
      } else {
        this.closeModal();
      }
    },

    clearForm: function() {
      this.shadow.querySelector('#betahub-description').value = '';
      this.shadow.querySelector('#betahub-steps').value = '';
      this.shadow.querySelector('#betahub-char-count').textContent = '0';
      this.shadow.querySelector('#betahub-steps-count').textContent = '0';

      // Clear email only if not prefilled
      if (!this.config.userEmail) {
        this.shadow.querySelector('#betahub-email').value = '';
      }

      // Reset to bug type
      this.selectType('bug');
    },

    submitFeedback: async function() {
      const submitBtn = this.shadow.querySelector('#betahub-submit-btn');
      if (submitBtn.disabled) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        const description = this.shadow.querySelector('#betahub-description').value.trim();
        const steps = this.shadow.querySelector('#betahub-steps').value.trim();

        let response;
        switch (this.currentType) {
          case 'bug':
            response = await this.submitBugReport(description, steps);
            break;
          case 'suggestion':
            response = await this.submitFeatureRequest(description);
            break;
          case 'support':
            response = await this.submitSupportTicket(description);
            break;
        }

        // Success
        this.showModal(this.shadow.querySelector('#betahub-success-modal'));
        this.clearForm();
      } catch (error) {
        // Error
        console.error('BetaHub Widget: Submission failed', error);
        this.shadow.querySelector('#betahub-error-message').textContent = error.message;
        this.showModal(this.shadow.querySelector('#betahub-error-modal'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';
      }
    },

    submitBugReport: async function(description, steps) {
      const url = `${this.config.apiBaseUrl}/projects/${this.config.projectId}/issues.json`;

      const formData = new URLSearchParams();
      formData.append('issue[description]', description);
      formData.append('issue[unformatted_steps_to_reproduce]', steps);
      formData.append('issue[source]', 'betahub-widget');

      // Add release label if provided
      if (this.config.releaseLabel) {
        formData.append('issue[release_label]', this.config.releaseLabel);
      }

      // Add custom fields
      if (this.config.customFields) {
        Object.keys(this.config.customFields).forEach(key => {
          formData.append(`issue[custom_fields][${key}]`, this.config.customFields[key]);
        });
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthorizationHeader(),
          'BetaHub-Project-ID': this.config.projectId,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to submit bug report (${response.status})`);
      }

      return response.json();
    },

    submitFeatureRequest: async function(description) {
      const url = `${this.config.apiBaseUrl}/projects/${this.config.projectId}/feature_requests.json`;

      const formData = new URLSearchParams();
      formData.append('feature_request[description]', description);

      // Add custom fields
      if (this.config.customFields) {
        Object.keys(this.config.customFields).forEach(key => {
          formData.append(`feature_request[custom_fields][${key}]`, this.config.customFields[key]);
        });
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthorizationHeader(),
          'BetaHub-Project-ID': this.config.projectId,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to submit feature request (${response.status})`);
      }

      return response.json();
    },

    submitSupportTicket: async function(description) {
      const url = `${this.config.apiBaseUrl}/projects/${this.config.projectId}/tickets.json`;

      const formData = new URLSearchParams();
      formData.append('ticket[description]', description);

      // Add reporter email to form data (takes precedence over header)
      const email = this.getUserEmail();
      if (email && !this.config.userEmail) {
        // Only add to form if user entered it (not prefilled in header)
        formData.append('ticket[reporter_email]', email);
      }

      // Add custom fields
      if (this.config.customFields) {
        Object.keys(this.config.customFields).forEach(key => {
          formData.append(`ticket[custom_fields][${key}]`, this.config.customFields[key]);
        });
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthorizationHeader(),
          'BetaHub-Project-ID': this.config.projectId,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to submit support ticket (${response.status})`);
      }

      return response.json();
    }
  };

  // Expose to global scope
  window.BetaHubWidget = BetaHubWidget;

})(window);
