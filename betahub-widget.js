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
 *     customFields: { gameVersion: '1.0.0' }, // optional
 *     theme: 'dark', // 'dark', 'light', or 'auto'
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

  const BetaHubWidget = {
    config: {
      projectId: null,
      authToken: null,
      apiBaseUrl: 'https://app.betahub.io',
      customFields: {},
      position: 'bottom-right',
      buttonText: 'Feedback',
      // Contact information options
      userEmail: null,
      requireEmail: false,
      showEmailField: 'auto'  // 'auto', 'always', 'never'
    },

    init: function(options) {
      if (!options.projectId || !options.authToken) {
        console.error('BetaHub Widget: projectId and authToken are required');
        return;
      }

      // Merge config
      this.config = Object.assign({}, this.config, options);

      // Create widget
      this.createWidget();
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

      // Initialize
      this.initializeUI();
      this.attachEventListeners();
    },

    getTemplate: function() {
      return `
        <style>
          ${this.getStyles()}
        </style>
        <div class="betahub-widget light-theme">
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

                <!-- Feedback Type Selector -->
                <div class="betahub-form-group">
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
          color: #dbdee1;
          position: relative;
          z-index: 999999;
        }

        /* Floating Button */
        .betahub-button {
          position: fixed;
          ${buttonPosition.vertical}: 20px;
          ${buttonPosition.horizontal}: 20px;
          background: #237390;
          color: #ffffff;
          border: none;
          border-radius: 24px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(35, 115, 144, 0.3);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 999999;
        }

        .betahub-button:hover {
          background: #1E627B;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(35, 115, 144, 0.4);
        }

        /* Modal Overlay */
        .betahub-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
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
          background: #1e1f22;
          border-radius: 8px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          transform: scale(0.9);
          transition: transform 0.2s, background-color 0.3s;
        }

        .betahub-modal-overlay.show .betahub-modal {
          transform: scale(1);
        }

        .betahub-small-modal {
          max-width: 400px;
        }

        /* Light Theme */
        .light-theme .betahub-modal {
          background: #ffffff;
          box-shadow: 0 8px 32px rgba(35, 115, 144, 0.15);
        }

        /* Header */
        .betahub-header {
          background: #111214;
          padding: 16px 20px;
          border-bottom: 1px solid #2b2d31;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.3s;
        }

        .light-theme .betahub-header {
          background: #DCEFF7;
          border-bottom: 1px solid #B1D5E2;
        }

        .betahub-header h2,
        .betahub-modal-title {
          color: #f2f3f5;
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .light-theme .betahub-header h2,
        .light-theme .betahub-modal-title {
          color: #2C3E50;
        }

        /* Content */
        .betahub-content {
          padding: 20px;
        }

        .betahub-modal-body {
          padding: 20px;
          color: #b5bac1;
          font-size: 14px;
          line-height: 1.6;
        }

        .light-theme .betahub-modal-body {
          color: #6F7F90;
        }

        .betahub-modal-footer {
          padding: 16px 20px;
          border-top: 1px solid #2b2d31;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .light-theme .betahub-modal-footer {
          border-top-color: #DCEFF7;
        }

        /* Warning Box */
        .betahub-warning-box {
          background: #3a2f1a;
          border: 1px solid #5c4d2c;
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }

        .light-theme .betahub-warning-box {
          background: #FEF3E0;
          border: 1px solid #F8C060;
        }

        .betahub-warning-box p {
          color: #f0b232;
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }

        .light-theme .betahub-warning-box p {
          color: #92400e;
        }

        .betahub-warning-box strong {
          color: #ffc844;
        }

        .light-theme .betahub-warning-box strong {
          color: #78350f;
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
          color: #b5bac1;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .light-theme .betahub-form-label {
          color: #6F7F90;
        }

        /* Type Selector */
        .betahub-type-selector {
          display: flex;
          gap: 8px;
        }

        .betahub-type-btn {
          flex: 1;
          padding: 14px 12px;
          background: #2b2d31;
          border: 2px solid #3a3c42;
          border-radius: 6px;
          color: #949ba4;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .light-theme .betahub-type-btn {
          background: #F7F9FA;
          border-color: #B1D5E2;
          color: #6F7F90;
        }

        .betahub-type-btn:hover {
          background: #35373c;
          border-color: #4e5058;
        }

        .light-theme .betahub-type-btn:hover {
          background: #DCEFF7;
          border-color: #A8D8EA;
        }

        .betahub-type-btn.active {
          background: #F47C7C;
          border-color: #F47C7C;
          color: #ffffff;
        }

        .betahub-type-btn[data-type="suggestion"].active {
          background: #58CEA7;
          border-color: #58CEA7;
        }

        .betahub-type-btn[data-type="support"].active {
          background: #237390;
          border-color: #237390;
        }

        /* Textarea */
        textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          background: #2b2d31;
          border: 1px solid #3a3c42;
          border-radius: 6px;
          color: #dbdee1;
          font-size: 14px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          resize: vertical;
          transition: all 0.2s;
        }

        .light-theme textarea {
          background: #ffffff;
          border-color: #B1D5E2;
          color: #2C3E50;
        }

        textarea:focus {
          outline: none;
          border-color: #237390;
        }

        .light-theme textarea:focus {
          border-color: #A8D8EA;
        }

        textarea::placeholder {
          color: #5a5d64;
        }

        .light-theme textarea::placeholder {
          color: #788087;
        }

        .betahub-steps-textarea {
          min-height: 90px;
        }

        .betahub-char-count {
          text-align: right;
          color: #5a5d64;
          font-size: 12px;
          margin-top: 4px;
        }

        .light-theme .betahub-char-count {
          color: #788087;
        }

        /* Email Input */
        .betahub-email-input {
          width: 100%;
          padding: 12px;
          background: #2b2d31;
          border: 1px solid #3a3c42;
          border-radius: 6px;
          color: #dbdee1;
          font-size: 14px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          transition: all 0.2s;
        }

        .light-theme .betahub-email-input {
          background: #ffffff;
          border-color: #B1D5E2;
          color: #2C3E50;
        }

        .betahub-email-input:focus {
          outline: none;
          border-color: #237390;
        }

        .light-theme .betahub-email-input:focus {
          border-color: #A8D8EA;
        }

        .betahub-email-input::placeholder {
          color: #5a5d64;
        }

        .light-theme .betahub-email-input::placeholder {
          color: #788087;
        }

        .betahub-email-input:read-only {
          background: #1a1b1e;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .light-theme .betahub-email-input:read-only {
          background: #F0F0F0;
        }

        .betahub-field-hint {
          color: #5a5d64;
          font-size: 12px;
          margin-top: 4px;
        }

        .light-theme .betahub-field-hint {
          color: #788087;
        }

        /* Buttons */
        .betahub-button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #2b2d31;
        }

        .light-theme .betahub-button-group {
          border-top-color: #DCEFF7;
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
          background: #237390;
          color: #ffffff;
        }

        .betahub-btn-primary:hover:not(:disabled) {
          background: #1E627B;
        }

        .betahub-btn-primary:active:not(:disabled) {
          background: #144252;
        }

        .betahub-btn-primary:disabled {
          background: #3a3c42;
          color: #5a5d64;
          cursor: not-allowed;
        }

        .light-theme .betahub-btn-primary:disabled {
          background: #B1D5E2;
          color: #788087;
        }

        .betahub-btn-secondary {
          background: transparent;
          color: #949ba4;
          padding: 12px 16px;
        }

        .light-theme .betahub-btn-secondary {
          color: #6F7F90;
        }

        .betahub-btn-secondary:hover {
          background: #2b2d31;
          color: #dbdee1;
        }

        .light-theme .betahub-btn-secondary:hover {
          background: #DCEFF7;
          color: #2C3E50;
        }

        .betahub-btn-danger {
          background: #F47C7C;
          color: #ffffff;
        }

        .betahub-btn-danger:hover {
          background: #F05B5B;
        }

        .betahub-btn-success {
          background: #58CEA7;
          color: #ffffff;
        }

        .betahub-btn-success:hover {
          background: #3FB88F;
        }

        /* Error Box */
        .betahub-error-box {
          background: #3d1e1e;
          border: 1px solid #5c2626;
          border-radius: 6px;
          padding: 12px;
          margin-top: 12px;
        }

        .light-theme .betahub-error-box {
          background: #FEEDED;
          border-color: #F47C7C;
        }

        .betahub-error-box p {
          color: #f87171;
          font-size: 13px;
          margin: 0;
        }

        .light-theme .betahub-error-box p {
          color: #E75555;
        }

        /* Scrollbar Styling */
        .betahub-modal::-webkit-scrollbar {
          width: 8px;
        }

        .betahub-modal::-webkit-scrollbar-track {
          background: #1e1f22;
        }

        .betahub-modal::-webkit-scrollbar-thumb {
          background: #3a3c42;
          border-radius: 4px;
        }

        .light-theme .betahub-modal::-webkit-scrollbar-track {
          background: #F7F9FA;
        }

        .light-theme .betahub-modal::-webkit-scrollbar-thumb {
          background: #B1D5E2;
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
      this.currentType = 'bug';
      this.initializeEmailField();
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

      // Close on overlay click
      [
        $('#betahub-modal'),
        $('#betahub-success-modal'),
        $('#betahub-error-modal'),
        $('#betahub-cancel-modal')
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
      const modal = this.shadow.querySelector('#betahub-modal');
      this.showModal(modal);
    },

    // Public method to open the widget from external code
    open: function() {
      this.openModal();
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
      this.currentType = type;

      // Update buttons
      this.shadow.querySelectorAll('.betahub-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
      });

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
