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

  // Default English translations
  const DEFAULT_TRANSLATIONS = {
    // Floating button
    buttonText: 'Feedback',

    // Modal titles
    modalTitle: 'Submit Feedback',
    successTitle: 'Thank You!',
    errorTitle: 'Submission Failed',
    discardTitle: 'Discard Feedback?',

    // Form labels
    feedbackTypeLabel: 'Feedback Type',
    descriptionLabel: 'Description',
    stepsLabel: 'Steps to Reproduce',
    emailLabel: 'Email Address',

    // Type buttons
    typeBug: 'Bug Report',
    typeSuggestion: 'Suggestion',
    typeSupport: 'Support',

    // Action buttons
    cancelButton: 'Cancel',
    submitButton: 'Submit Feedback',
    submittingButton: 'Submitting...',
    closeButton: 'Close',
    retryButton: 'Try Again',
    keepWritingButton: 'No, Keep Writing',
    discardButton: 'Yes, Discard',

    // Placeholders
    bugPlaceholder: 'Describe the bug you encountered...',
    suggestionPlaceholder: 'Describe your suggestion in detail...',
    supportPlaceholder: 'What do you need help with?',
    stepsPlaceholder: '1. Go to...\n2. Click on...\n3. Notice that...',
    emailPlaceholder: 'your.email@example.com',

    // Messages
    warningTitle: 'One Entry at a Time',
    warningMessage: 'Please submit only ONE item per form. If you have multiple items, submit them separately.',
    successMessage: 'Your feedback has been submitted successfully. We appreciate you taking the time to help us improve!',
    errorMessage: 'We couldn\'t submit your feedback. Please try again.',
    errorDefault: 'Network error: Unable to reach the server',
    discardMessage: 'Are you sure you want to cancel? Your feedback will be lost.',
    emailHint: 'We\'ll use this to contact you about updates',

    // Submission token messages
    tokenLoading: 'Preparing submission...',
    tokenFetchError: 'Unable to prepare submission. Please try again later.',
    tokenUsed: 'Submission token used. Reload the page to submit again.',
    tokenFetchRetry: 'Retry'
  };

  // Built-in translations for supported languages
  const TRANSLATIONS = {
    en: DEFAULT_TRANSLATIONS,
    fr: {
      buttonText: 'Commentaires',
      modalTitle: 'Envoyer un commentaire',
      successTitle: 'Merci !',
      errorTitle: 'Echec de l\'envoi',
      discardTitle: 'Abandonner le commentaire ?',
      feedbackTypeLabel: 'Type de commentaire',
      descriptionLabel: 'Description',
      stepsLabel: 'Etapes pour reproduire',
      emailLabel: 'Adresse e-mail',
      typeBug: 'Rapport de bug',
      typeSuggestion: 'Suggestion',
      typeSupport: 'Support',
      cancelButton: 'Annuler',
      submitButton: 'Envoyer',
      submittingButton: 'Envoi en cours...',
      closeButton: 'Fermer',
      retryButton: 'Reessayer',
      keepWritingButton: 'Non, continuer',
      discardButton: 'Oui, abandonner',
      bugPlaceholder: 'Decrivez le bug rencontre...',
      suggestionPlaceholder: 'Decrivez votre suggestion en detail...',
      supportPlaceholder: 'Comment pouvons-nous vous aider ?',
      stepsPlaceholder: '1. Aller a...\n2. Cliquer sur...\n3. Observer que...',
      emailPlaceholder: 'votre.email@exemple.com',
      warningTitle: 'Une seule entree a la fois',
      warningMessage: 'Veuillez soumettre un seul element par formulaire. Si vous avez plusieurs elements, soumettez-les separement.',
      successMessage: 'Votre commentaire a ete envoye avec succes. Merci de nous aider a ameliorer notre produit !',
      errorMessage: 'Nous n\'avons pas pu envoyer votre commentaire. Veuillez reessayer.',
      errorDefault: 'Erreur reseau : impossible de joindre le serveur',
      discardMessage: 'Etes-vous sur de vouloir annuler ? Votre commentaire sera perdu.',
      emailHint: 'Nous utiliserons cette adresse pour vous contacter',
      tokenLoading: 'Preparation de l\'envoi...',
      tokenFetchError: 'Impossible de preparer l\'envoi. Veuillez reessayer plus tard.',
      tokenUsed: 'Jeton utilise. Rechargez la page pour soumettre a nouveau.',
      tokenFetchRetry: 'Reessayer'
    },
    de: {
      buttonText: 'Feedback',
      modalTitle: 'Feedback senden',
      successTitle: 'Vielen Dank!',
      errorTitle: 'Senden fehlgeschlagen',
      discardTitle: 'Feedback verwerfen?',
      feedbackTypeLabel: 'Feedback-Typ',
      descriptionLabel: 'Beschreibung',
      stepsLabel: 'Schritte zur Reproduktion',
      emailLabel: 'E-Mail-Adresse',
      typeBug: 'Fehlerbericht',
      typeSuggestion: 'Vorschlag',
      typeSupport: 'Support',
      cancelButton: 'Abbrechen',
      submitButton: 'Feedback senden',
      submittingButton: 'Wird gesendet...',
      closeButton: 'Schliessen',
      retryButton: 'Erneut versuchen',
      keepWritingButton: 'Nein, weiterschreiben',
      discardButton: 'Ja, verwerfen',
      bugPlaceholder: 'Beschreiben Sie den aufgetretenen Fehler...',
      suggestionPlaceholder: 'Beschreiben Sie Ihren Vorschlag im Detail...',
      supportPlaceholder: 'Wie koennen wir Ihnen helfen?',
      stepsPlaceholder: '1. Gehe zu...\n2. Klicke auf...\n3. Beachte, dass...',
      emailPlaceholder: 'ihre.email@beispiel.de',
      warningTitle: 'Ein Eintrag auf einmal',
      warningMessage: 'Bitte senden Sie nur einen Eintrag pro Formular. Bei mehreren Eintraegen senden Sie diese bitte einzeln.',
      successMessage: 'Ihr Feedback wurde erfolgreich gesendet. Vielen Dank, dass Sie uns helfen, uns zu verbessern!',
      errorMessage: 'Wir konnten Ihr Feedback nicht senden. Bitte versuchen Sie es erneut.',
      errorDefault: 'Netzwerkfehler: Server nicht erreichbar',
      discardMessage: 'Sind Sie sicher, dass Sie abbrechen moechten? Ihr Feedback geht verloren.',
      emailHint: 'Wir verwenden diese Adresse, um Sie zu kontaktieren',
      tokenLoading: 'Einreichung wird vorbereitet...',
      tokenFetchError: 'Einreichung kann nicht vorbereitet werden. Bitte versuchen Sie es spaeter erneut.',
      tokenUsed: 'Token verwendet. Laden Sie die Seite neu, um erneut einzureichen.',
      tokenFetchRetry: 'Erneut versuchen'
    },
    es: {
      buttonText: 'Comentarios',
      modalTitle: 'Enviar comentario',
      successTitle: 'Gracias!',
      errorTitle: 'Error al enviar',
      discardTitle: 'Descartar comentario?',
      feedbackTypeLabel: 'Tipo de comentario',
      descriptionLabel: 'Descripcion',
      stepsLabel: 'Pasos para reproducir',
      emailLabel: 'Correo electronico',
      typeBug: 'Reporte de error',
      typeSuggestion: 'Sugerencia',
      typeSupport: 'Soporte',
      cancelButton: 'Cancelar',
      submitButton: 'Enviar comentario',
      submittingButton: 'Enviando...',
      closeButton: 'Cerrar',
      retryButton: 'Reintentar',
      keepWritingButton: 'No, seguir escribiendo',
      discardButton: 'Si, descartar',
      bugPlaceholder: 'Describa el error encontrado...',
      suggestionPlaceholder: 'Describa su sugerencia en detalle...',
      supportPlaceholder: 'En que podemos ayudarle?',
      stepsPlaceholder: '1. Ir a...\n2. Hacer clic en...\n3. Observar que...',
      emailPlaceholder: 'su.correo@ejemplo.com',
      warningTitle: 'Una entrada a la vez',
      warningMessage: 'Por favor envie solo un elemento por formulario. Si tiene varios elementos, envielos por separado.',
      successMessage: 'Su comentario ha sido enviado con exito. Gracias por ayudarnos a mejorar!',
      errorMessage: 'No pudimos enviar su comentario. Por favor intente de nuevo.',
      errorDefault: 'Error de red: no se puede conectar al servidor',
      discardMessage: 'Esta seguro de que desea cancelar? Su comentario se perdera.',
      emailHint: 'Usaremos este correo para contactarle sobre actualizaciones',
      tokenLoading: 'Preparando envio...',
      tokenFetchError: 'No se pudo preparar el envio. Intentelo de nuevo mas tarde.',
      tokenUsed: 'Token utilizado. Recargue la pagina para enviar de nuevo.',
      tokenFetchRetry: 'Reintentar'
    },
    pt: {
      buttonText: 'Feedback',
      modalTitle: 'Enviar feedback',
      successTitle: 'Obrigado!',
      errorTitle: 'Falha no envio',
      discardTitle: 'Descartar feedback?',
      feedbackTypeLabel: 'Tipo de feedback',
      descriptionLabel: 'Descricao',
      stepsLabel: 'Passos para reproduzir',
      emailLabel: 'Endereco de e-mail',
      typeBug: 'Relatorio de bug',
      typeSuggestion: 'Sugestao',
      typeSupport: 'Suporte',
      cancelButton: 'Cancelar',
      submitButton: 'Enviar feedback',
      submittingButton: 'Enviando...',
      closeButton: 'Fechar',
      retryButton: 'Tentar novamente',
      keepWritingButton: 'Nao, continuar escrevendo',
      discardButton: 'Sim, descartar',
      bugPlaceholder: 'Descreva o bug encontrado...',
      suggestionPlaceholder: 'Descreva sua sugestao em detalhes...',
      supportPlaceholder: 'Como podemos ajuda-lo?',
      stepsPlaceholder: '1. Ir para...\n2. Clicar em...\n3. Observar que...',
      emailPlaceholder: 'seu.email@exemplo.com',
      warningTitle: 'Uma entrada por vez',
      warningMessage: 'Por favor envie apenas um item por formulario. Se tiver varios itens, envie-os separadamente.',
      successMessage: 'Seu feedback foi enviado com sucesso. Obrigado por nos ajudar a melhorar!',
      errorMessage: 'Nao foi possivel enviar seu feedback. Por favor tente novamente.',
      errorDefault: 'Erro de rede: nao foi possivel conectar ao servidor',
      discardMessage: 'Tem certeza de que deseja cancelar? Seu feedback sera perdido.',
      emailHint: 'Usaremos este e-mail para entrar em contato sobre atualizacoes',
      tokenLoading: 'Preparando envio...',
      tokenFetchError: 'Nao foi possivel preparar o envio. Tente novamente mais tarde.',
      tokenUsed: 'Token utilizado. Recarregue a pagina para enviar novamente.',
      tokenFetchRetry: 'Tentar novamente'
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
      enabledTypes: ['bug', 'suggestion', 'support'],  // Array of enabled feedback types
      // Lifecycle callbacks
      onOpen: null,  // Called when feedback modal opens
      onClose: null,  // Called when feedback modal closes
      // Localization options
      locale: 'auto',  // 'auto', 'en', 'fr', 'de', 'es', 'pt'
      translations: {},  // Custom translation overrides
      // Submission token options (JWT)
      submissionToken: null,            // Static JWT string (single-use)
      submissionTokenUrl: null,         // URL to fetch JWT dynamically on each modal open
      submissionTokenMethod: 'POST',    // HTTP method for the token URL
      submissionTokenFallback: 'block'  // 'block' or 'allow' — behavior on fetch failure
    },

    // Internal state
    validatedTypes: [],
    configError: null,
    _currentSubmissionToken: null,
    _tokenEmail: null,
    _staticTokenConsumed: false,
    _tokenFetchInProgress: false,

    init: function(options) {
      if (!options.projectId || !options.authToken) {
        console.error('BetaHub Widget: projectId and authToken are required');
        return;
      }

      // Merge config
      this.config = Object.assign({}, this.config, options);

      // Handle deprecated buttonText option
      if (options.buttonText && (!options.translations || !options.translations.buttonText)) {
        console.warn('BetaHub Widget: "buttonText" option is deprecated. Use translations: { buttonText: "..." } instead.');
        this.config.translations = this.config.translations || {};
        this.config.translations.buttonText = options.buttonText;
      }

      // Validate submission token config: mutual exclusion
      if (this.config.submissionToken && this.config.submissionTokenUrl) {
        const msg = 'Both "submissionToken" and "submissionTokenUrl" are set. Use only one.';
        console.error('BetaHub Widget Configuration Error:', msg);
        alert('BetaHub Widget Configuration Error: ' + msg);
        this.configError = {
          title: 'Conflicting Submission Token Options',
          message: msg,
          fix: 'Remove either "submissionToken" or "submissionTokenUrl" from your BetaHubWidget.init() configuration.'
        };
      }

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

    getLocale: function() {
      // Return configured locale if not auto
      if (this.config.locale && this.config.locale !== 'auto') {
        // Validate locale exists, fallback to 'en'
        return TRANSLATIONS[this.config.locale] ? this.config.locale : 'en';
      }

      // Auto-detect from browser, map 'fr-CA' -> 'fr'
      const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase();
      return TRANSLATIONS[browserLang] ? browserLang : 'en';
    },

    t: function(key) {
      // Priority: custom translations > locale translations > English default
      if (this.config.translations && this.config.translations[key] !== undefined) {
        return this.config.translations[key];
      }

      const locale = this.getLocale();
      if (TRANSLATIONS[locale] && TRANSLATIONS[locale][key] !== undefined) {
        return TRANSLATIONS[locale][key];
      }

      return DEFAULT_TRANSLATIONS[key] || key;
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
            <span>${this.t('buttonText')}</span>
          </button>

          <!-- Modal Overlay -->
          <div class="betahub-modal-overlay" id="betahub-modal">
            <div class="betahub-modal">
              <!-- Header -->
              <div class="betahub-header">
                <h2>${this.getIcon('form')} ${this.t('modalTitle')}</h2>
              </div>

              <!-- Content -->
              <div class="betahub-content">
                <!-- Token Loading Indicator -->
                <div class="betahub-token-loading hidden" id="betahub-token-loading">
                  <div class="betahub-spinner"></div>
                  <span>${this.t('tokenLoading')}</span>
                </div>

                <!-- Token Error Banner -->
                <div class="betahub-token-error hidden" id="betahub-token-error">
                  <p id="betahub-token-error-message">${this.t('tokenFetchError')}</p>
                  <button id="betahub-token-retry-btn">${this.t('tokenFetchRetry')}</button>
                </div>

                <!-- Token Consumed Message -->
                <div class="betahub-token-consumed hidden" id="betahub-token-consumed">
                  <p>${this.t('tokenUsed')}</p>
                </div>

                <!-- Warning Box -->
                <div class="betahub-warning-box">
                  <p><strong>${this.t('warningTitle')}</strong><br>
                  ${this.t('warningMessage')}</p>
                </div>

                <!-- Single Type Indicator (shown when only one type is enabled) -->
                <div class="betahub-form-group betahub-single-type-indicator hidden" id="betahub-single-type-indicator">
                  <label class="betahub-form-label">${this.t('feedbackTypeLabel')}</label>
                  <div class="betahub-type-badge" id="betahub-type-badge">
                    <span id="betahub-type-badge-text">${this.t('typeBug')}</span>
                  </div>
                </div>

                <!-- Feedback Type Selector (shown when multiple types are enabled) -->
                <div class="betahub-form-group" id="betahub-type-selector-group">
                  <label class="betahub-form-label">${this.t('feedbackTypeLabel')}</label>
                  <div class="betahub-type-selector">
                    <button class="betahub-type-btn active" data-type="bug">
                      ${this.t('typeBug')}
                    </button>
                    <button class="betahub-type-btn" data-type="suggestion">
                      ${this.t('typeSuggestion')}
                    </button>
                    <button class="betahub-type-btn" data-type="support">
                      ${this.t('typeSupport')}
                    </button>
                  </div>
                </div>

                <!-- Description Field -->
                <div class="betahub-form-group">
                  <label class="betahub-form-label" id="betahub-description-label">${this.t('descriptionLabel')}</label>
                  <textarea
                    id="betahub-description"
                    placeholder="${this.t('bugPlaceholder')}"
                    maxlength="2000"
                  ></textarea>
                  <div class="betahub-char-count">
                    <span id="betahub-char-count">0</span> / 2000
                  </div>
                </div>

                <!-- Steps to Reproduce (Bug only) -->
                <div class="betahub-form-group" id="betahub-steps-group">
                  <label class="betahub-form-label">${this.t('stepsLabel')}</label>
                  <textarea
                    id="betahub-steps"
                    class="betahub-steps-textarea"
                    placeholder="${this.t('stepsPlaceholder')}"
                    maxlength="1000"
                  ></textarea>
                  <div class="betahub-char-count">
                    <span id="betahub-steps-count">0</span> / 1000
                  </div>
                </div>

                <!-- Email Field (conditional) -->
                <div class="betahub-form-group" id="betahub-email-group">
                  <label class="betahub-form-label">${this.t('emailLabel')}</label>
                  <input
                    type="email"
                    id="betahub-email"
                    class="betahub-email-input"
                    placeholder="${this.t('emailPlaceholder')}"
                    maxlength="255"
                  />
                  <div class="betahub-field-hint">
                    ${this.t('emailHint')}
                  </div>
                </div>

                <!-- Button Group -->
                <div class="betahub-button-group">
                  <button class="betahub-btn betahub-btn-secondary" id="betahub-cancel-btn">${this.t('cancelButton')}</button>
                  <button class="betahub-btn betahub-btn-primary" id="betahub-submit-btn" disabled>${this.t('submitButton')}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Modal -->
          <div class="betahub-modal-overlay" id="betahub-success-modal">
            <div class="betahub-modal betahub-small-modal">
              <div class="betahub-header">
                <h3 class="betahub-modal-title">${this.t('successTitle')}</h3>
              </div>
              <div class="betahub-modal-body">
                ${this.t('successMessage')}
              </div>
              <div class="betahub-modal-footer">
                <button class="betahub-btn betahub-btn-success" id="betahub-success-ok">${this.t('closeButton')}</button>
              </div>
            </div>
          </div>

          <!-- Error Modal -->
          <div class="betahub-modal-overlay" id="betahub-error-modal">
            <div class="betahub-modal betahub-small-modal">
              <div class="betahub-header">
                <h3 class="betahub-modal-title">${this.t('errorTitle')}</h3>
              </div>
              <div class="betahub-modal-body">
                ${this.t('errorMessage')}
                <div class="betahub-error-box">
                  <p id="betahub-error-message">${this.t('errorDefault')}</p>
                </div>
              </div>
              <div class="betahub-modal-footer">
                <button class="betahub-btn betahub-btn-secondary" id="betahub-error-cancel">${this.t('cancelButton')}</button>
                <button class="betahub-btn betahub-btn-primary" id="betahub-error-retry">${this.t('retryButton')}</button>
              </div>
            </div>
          </div>

          <!-- Cancel Confirmation Modal -->
          <div class="betahub-modal-overlay" id="betahub-cancel-modal">
            <div class="betahub-modal betahub-small-modal">
              <div class="betahub-header">
                <h3 class="betahub-modal-title">${this.t('discardTitle')}</h3>
              </div>
              <div class="betahub-modal-body">
                ${this.t('discardMessage')}
              </div>
              <div class="betahub-modal-footer">
                <button class="betahub-btn betahub-btn-secondary" id="betahub-cancel-no">${this.t('keepWritingButton')}</button>
                <button class="betahub-btn betahub-btn-danger" id="betahub-cancel-yes">${this.t('discardButton')}</button>
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

        /* Token loading spinner */
        .betahub-token-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .betahub-token-loading .betahub-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-color);
          border-top-color: var(--primary-button);
          border-radius: 50%;
          animation: betahub-spin 0.6s linear infinite;
        }

        @keyframes betahub-spin {
          to { transform: rotate(360deg); }
        }

        /* Token error banner (inline in form area) */
        .betahub-token-error {
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .betahub-token-error p {
          color: var(--error-text);
          font-size: 13px;
          margin: 0;
        }

        .betahub-token-error button {
          background: none;
          border: 1px solid var(--error-border);
          border-radius: 4px;
          color: var(--error-text);
          padding: 4px 10px;
          cursor: pointer;
          font-size: 12px;
          white-space: nowrap;
          margin-left: 12px;
        }

        .betahub-token-error button:hover {
          background: var(--error-border);
          color: #ffffff;
        }

        /* Token consumed message */
        .betahub-token-consumed {
          background: #FFF8E1;
          border: 1px solid var(--warning-color);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
          text-align: center;
        }

        .betahub-token-consumed p {
          color: var(--text-primary);
          font-size: 13px;
          margin: 0;
          font-weight: 600;
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
      // Update placeholders using translations
      const placeholders = {
        bug: this.t('bugPlaceholder'),
        suggestion: this.t('suggestionPlaceholder'),
        support: this.t('supportPlaceholder')
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
      // Show if email is prefilled (readonly display) — from config or from token
      if (userEmail || this._tokenEmail) {
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

      // Token retry
      $('#betahub-token-retry-btn').addEventListener('click', () => {
        this.fetchSubmissionToken();
      });

      // Close on overlay click
      // Main modal needs special handling to trigger callbacks and clear form
      $('#betahub-modal').addEventListener('click', (e) => {
        if (e.target === $('#betahub-modal')) {
          this.closeModal();
        }
      });

      // Other modals can just hide
      [
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

    fetchSubmissionToken: async function() {
      if (!this.config.submissionTokenUrl || this._tokenFetchInProgress) return;

      this._tokenFetchInProgress = true;

      const loadingEl = this.shadow.querySelector('#betahub-token-loading');
      const errorEl = this.shadow.querySelector('#betahub-token-error');
      const submitBtn = this.shadow.querySelector('#betahub-submit-btn');

      loadingEl.classList.remove('hidden');
      errorEl.classList.add('hidden');
      submitBtn.disabled = true;

      try {
        const response = await fetch(this.config.submissionTokenUrl, {
          method: this.config.submissionTokenMethod || 'POST',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Token endpoint returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.token) {
          throw new Error('Token endpoint response missing "token" field');
        }

        this._currentSubmissionToken = data.token;

        // If response includes email, prefill and lock the email field
        if (data.email) {
          this._tokenEmail = data.email;
          const emailInput = this.shadow.querySelector('#betahub-email');
          emailInput.value = data.email;
          emailInput.readOnly = true;
          this.updateEmailFieldVisibility();
        }

        loadingEl.classList.add('hidden');
        this.updateSubmitButton();
      } catch (error) {
        console.error('BetaHub Widget: Failed to fetch submission token', error);
        loadingEl.classList.add('hidden');

        if (this.config.submissionTokenFallback === 'allow') {
          console.warn('BetaHub Widget: Proceeding without submission token (fallback: allow)');
          this._currentSubmissionToken = null;
          this.updateSubmitButton();
        } else {
          errorEl.classList.remove('hidden');
          this.shadow.querySelector('#betahub-token-error-message').textContent =
            this.t('tokenFetchError');
          submitBtn.disabled = true;
        }
      } finally {
        this._tokenFetchInProgress = false;
      }
    },

    openModal: function() {
      // Check if there's a configuration error
      if (this.configError) {
        this.showConfigErrorModal();
        return;
      }

      // Check if static token was already consumed
      if (this.config.submissionToken && this._staticTokenConsumed) {
        const modal = this.shadow.querySelector('#betahub-modal');
        this.showModal(modal);
        this.shadow.querySelector('#betahub-token-consumed').classList.remove('hidden');
        this.shadow.querySelector('#betahub-submit-btn').disabled = true;
        if (typeof this.config.onOpen === 'function') this.config.onOpen();
        return;
      }

      const modal = this.shadow.querySelector('#betahub-modal');
      this.showModal(modal);

      // Initialize submission token for this modal session
      if (this.config.submissionToken) {
        this._currentSubmissionToken = this.config.submissionToken;
      } else if (this.config.submissionTokenUrl) {
        this._currentSubmissionToken = null;
        this._tokenEmail = null;
        this.fetchSubmissionToken();
      }

      // Trigger onOpen callback
      if (typeof this.config.onOpen === 'function') {
        this.config.onOpen();
      }
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

      // Trigger onClose callback
      if (typeof this.config.onClose === 'function') {
        this.config.onClose();
      }
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
      const submitBtn = this.shadow.querySelector('#betahub-submit-btn');

      // Token-related blocks
      if (this._tokenFetchInProgress) {
        submitBtn.disabled = true;
        return;
      }
      if (this.config.submissionToken && this._staticTokenConsumed) {
        submitBtn.disabled = true;
        return;
      }
      if (this.config.submissionTokenUrl &&
          this.config.submissionTokenFallback !== 'allow' &&
          !this._currentSubmissionToken) {
        const errorEl = this.shadow.querySelector('#betahub-token-error');
        if (errorEl && !errorEl.classList.contains('hidden')) {
          submitBtn.disabled = true;
          return;
        }
      }

      const description = this.shadow.querySelector('#betahub-description').value.trim();
      const steps = this.shadow.querySelector('#betahub-steps').value.trim();
      const email = this.shadow.querySelector('#betahub-email').value.trim();
      const emailGroup = this.shadow.querySelector('#betahub-email-group');

      const hasDescription = description.length > 0;
      const hasSteps = this.currentType !== 'bug' || steps.length > 0;

      // Check if email is required and valid
      const emailVisible = !emailGroup.classList.contains('hidden');
      const emailRequired = emailVisible && !this.config.userEmail && !this._tokenEmail;
      const hasValidEmail = !emailRequired || (email.length > 0 && this.isValidEmail(email));

      submitBtn.disabled = !(hasDescription && hasSteps && hasValidEmail);
    },

    isValidEmail: function(email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    getAuthorizationHeader: function() {
      // Priority 1: JWT submission token (email embedded in JWT)
      if (this._currentSubmissionToken) {
        return `FormUser ${this.config.authToken},${this._currentSubmissionToken}`;
      }

      // Priority 2: Email (existing behavior)
      const email = this.getUserEmail();
      if (email) {
        return `FormUser ${this.config.authToken},email:${email}`;
      }

      // Priority 3: Auth token only
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

      // Reset token UI elements
      const tokenLoading = this.shadow.querySelector('#betahub-token-loading');
      const tokenError = this.shadow.querySelector('#betahub-token-error');
      const tokenConsumed = this.shadow.querySelector('#betahub-token-consumed');
      if (tokenLoading) tokenLoading.classList.add('hidden');
      if (tokenError) tokenError.classList.add('hidden');
      if (tokenConsumed) tokenConsumed.classList.add('hidden');

      // Reset token email prefill (only for dynamic token)
      if (this._tokenEmail && !this.config.userEmail) {
        this._tokenEmail = null;
        const emailInput = this.shadow.querySelector('#betahub-email');
        emailInput.value = '';
        emailInput.readOnly = false;
      }

      // Reset to bug type
      this.selectType('bug');
    },

    submitFeedback: async function() {
      const submitBtn = this.shadow.querySelector('#betahub-submit-btn');
      if (submitBtn.disabled) return;

      submitBtn.disabled = true;
      submitBtn.textContent = this.t('submittingButton');

      try {
        const description = this.shadow.querySelector('#betahub-description').value.trim();
        const steps = this.shadow.querySelector('#betahub-steps').value.trim();

        switch (this.currentType) {
          case 'bug':
            await this.submitBugReport(description, steps);
            break;
          case 'suggestion':
            await this.submitFeatureRequest(description);
            break;
          case 'support':
            await this.submitSupportTicket(description);
            break;
        }

        // Success — consume submission token
        if (this.config.submissionToken) {
          this._staticTokenConsumed = true;
          this._currentSubmissionToken = null;
        } else if (this.config.submissionTokenUrl) {
          this._currentSubmissionToken = null;
          this._tokenEmail = null;
        }

        this.showModal(this.shadow.querySelector('#betahub-success-modal'));
        this.clearForm();
      } catch (error) {
        // Error
        console.error('BetaHub Widget: Submission failed', error);
        this.shadow.querySelector('#betahub-error-message').textContent = error.message;
        this.showModal(this.shadow.querySelector('#betahub-error-modal'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = this.t('submitButton');
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
