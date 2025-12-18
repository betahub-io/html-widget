# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the **BetaHub Feedback Widget** - an embeddable JavaScript widget that allows users to submit bug reports, feature requests (suggestions), and support tickets directly from web games or applications. The widget integrates with the BetaHub API to collect and manage user feedback.

## Core Architecture

### Single-File Widget Design
- **betahub-widget.js**: Self-contained vanilla JavaScript widget with zero dependencies
- Uses Shadow DOM for complete CSS isolation from host application
- Implements IIFE pattern to expose global `BetaHubWidget` object

### Key Technical Decisions
1. **Shadow DOM Isolation**: All styles and DOM elements are encapsulated in Shadow DOM to prevent CSS conflicts with host applications
2. **Light Theme Only**: Widget uses a fixed pastel blue light theme for consistency and simplicity (no theme toggle)
3. **URL-encoded Form Submission**: Uses `application/x-www-form-urlencoded` format with `FormUser` authentication
4. **Configurable Position**: Floating button can be positioned in any corner (`bottom-right`, `bottom-left`, `top-right`, `top-left`)

### Widget State Management
The widget maintains several internal states:
- `currentType`: Current feedback type (`bug`, `suggestion`, `support`)
- Modal visibility states for different UI flows (success, error, cancel confirmation)

### Color Palette Guidelines

The widget uses a **pastel blue minimalistic** design system with no theme toggle. All colors are carefully chosen for:
- **Accessibility**: WCAG AA compliant contrast ratios (minimum 4.5:1 for normal text)
- **Harmony**: Analogous color scheme centered around pastel blue
- **Professionalism**: Soft, non-aggressive tones suitable for feedback tools

#### Primary Colors
- **Pastel Blue (Main)**: `#A8D8EA` - Primary brand color, accents, headers
- **Soft Blue**: `#B1D5E2` - Muted variant, secondary elements, disabled states
- **Aqua Tint**: `#A8E1E5` - Soft teal accent for highlights

#### Backgrounds & Surfaces
- **Light Blue Background**: `#DCEFF7` - Light theme main background, headers
- **White**: `#FFFFFF` - Cards, modals, elevated surfaces
- **Soft Gray**: `#F7F9FA` - Alternative background, form fields

#### Interactive Elements
- **Primary Button**: `#237390` - Buttons, links, CTAs (WCAG AA: 5.35:1)
- **Button Hover**: `#1E627B` - Hover state
- **Button Active**: `#144252` - Active/pressed state
- **Disabled State**: `#B1D5E2` background with `#788087` text

#### Text Colors
- **Dark Blue-Gray**: `#2C3E50` - Primary text, headings
- **Medium Gray**: `#6F7F90` - Secondary text, labels
- **Light Gray**: `#788087` - Placeholder text, disabled text

#### Semantic Colors (Pastel versions to match theme)
- **Success**: `#58CEA7` - Success states, confirmations (pastel green)
- **Warning**: `#F8C060` - Warning messages, alerts (pastel orange)
- **Error**: `#F47C7C` - Error states, validation (pastel red)

#### Feedback Type Colors
- **Bug Report**: `#F47C7C` - Active bug report button
- **Suggestion**: `#58CEA7` - Active suggestion button
- **Support**: `#237390` - Active support button

#### Design Principles
1. **Consistency**: Use the same color for the same meaning throughout the widget
2. **Contrast**: Always ensure text has sufficient contrast against its background
3. **Subtlety**: Hover and active states should be noticeable but not jarring
4. **Accessibility First**: Test all color combinations for WCAG AA compliance
5. **Cohesion**: All colors should feel part of the same pastel blue family

**Note**: The widget no longer supports theme switching. It is permanently set to light theme with the pastel blue palette. Users who need different colors should modify the palette values directly in the `getStyles()` method.

### API Integration
The widget submits to three BetaHub endpoints:
- **Bug Reports**: `POST /projects/{projectId}/issues.json`
  - Required fields: `description`, `unformatted_steps_to_reproduce`
  - Source tag: `betahub-widget`
- **Feature Requests**: `POST /projects/{projectId}/feature_requests.json`
  - Required field: `description`
- **Support Tickets**: `POST /projects/{projectId}/tickets.json`
  - Required field: `description`

All requests include:
- `Authorization: FormUser {authToken}` header
- `BetaHub-Project-ID: {projectId}` header
- Custom fields as nested parameters: `issue[custom_fields][key]`

## Development Workflow

### Testing the Widget
1. Open `demo.html` in a browser (use a local web server, not `file://`)
2. The demo includes a styled page with the widget embedded
3. Replace placeholder credentials in demo.html lines 309-310:
   ```javascript
   projectId: 'your-actual-project-id',
   authToken: 'tkn-your-actual-token'
   ```

### Testing with Playwright MCP
To test the widget interactively:
```bash
# Start a simple HTTP server
python3 -m http.server 8000
# Then use Playwright MCP to navigate to http://localhost:8000/demo.html
```

### Widget Configuration
Required parameters:
- `projectId`: BetaHub project ID
- `authToken`: Token with `can_create_bug_report` and `can_create_feature_request` permissions

Optional parameters:
- `apiBaseUrl`: API endpoint (default: `https://app.betahub.io`)
- `position`: `'bottom-right'` | `'bottom-left'` | `'top-right'` | `'top-left'` (default: `'bottom-right'`)
- `customFields`: Object with metadata sent with every submission (e.g., game version, platform, player level)
- `locale`: Language code `'auto'` | `'en'` | `'fr'` | `'de'` | `'es'` | `'pt'` (default: `'auto'` - detects from browser)
- `translations`: Object to override specific translation strings

**Deprecated**: `buttonText` - use `translations: { buttonText: 'Your Text' }` instead

## Code Structure

### Main Widget Object (betahub-widget.js)
- `init(options)`: Initializes widget with configuration
- `createWidget()`: Creates Shadow DOM container and injects HTML/CSS
- `getTemplate()`: Returns HTML template with all modals and forms (light theme)
- `getStyles()`: Returns all CSS styles for widget with pastel blue palette
- `initializeUI()`: Sets up initial UI state (sets current feedback type to 'bug')
- `attachEventListeners()`: Wires up all event handlers
- `getLocale()`: Returns the current locale (auto-detected or configured)
- `t(key)`: Translation helper - returns localized string for the given key
- `submitFeedback()`: Main submission handler that routes to appropriate API method
- `submitBugReport(description, steps)`: Handles bug report API submission
- `submitFeatureRequest(description)`: Handles feature request API submission
- `submitSupportTicket(description)`: Handles support ticket API submission

### UI Flow
1. User clicks floating button → Main modal opens
2. User selects feedback type → Form updates (shows/hides steps field for bugs)
3. User fills form → Submit button enables when required fields filled
4. User submits → Loading state → Success/Error modal
5. Success → Form clears, modal closes
6. Error → Retry or cancel option

### Form Validation
- Description: Required, max 2000 characters
- Steps to Reproduce: Required only for bugs, max 1000 characters
- Character counters update in real-time
- Submit button disabled until all required fields filled

## Related Files

### demo.html
Production-ready demo page showing the widget in action. Includes:
- Styled landing page with feature descriptions
- Code examples for integration
- Configuration documentation
- Mock game canvas to show widget overlay

## Game Engine Integration

The widget works with any web-based game engine:
- **PixiJS**: Renders on top of canvas without z-index conflicts
- **Phaser**: Compatible with Phaser's DOM structure
- **Three.js**: Overlays 3D WebGL canvases
- **Unity WebGL**: Works as overlay to Unity's canvas
- **Vanilla Canvas**: Compatible with any HTML5 canvas game

Custom fields can track game-specific context:
```javascript
customFields: {
  gameVersion: '1.2.3',
  platform: 'web',
  playerLevel: 15,
  currentScene: 'battle',
  sessionId: 'unique-session-id'
}
```

## Localization

The widget supports multiple languages with built-in translations for English, French, German, Spanish, and Portuguese.

### Configuration
```javascript
BetaHubWidget.init({
  projectId: '...',
  authToken: '...',
  locale: 'fr',  // Force French
  // OR
  locale: 'auto',  // Auto-detect from browser (default)
  translations: {
    // Override specific strings
    buttonText: 'Custom Button'
  }
});
```

### Built-in Languages
- `en` - English (default)
- `fr` - French
- `de` - German
- `es` - Spanish
- `pt` - Portuguese

### Translation Keys
All translatable strings can be overridden via the `translations` config:

| Key | Default (English) |
|-----|-------------------|
| `buttonText` | Feedback |
| `modalTitle` | Submit Feedback |
| `successTitle` | Thank You! |
| `errorTitle` | Submission Failed |
| `discardTitle` | Discard Feedback? |
| `feedbackTypeLabel` | Feedback Type |
| `descriptionLabel` | Description |
| `stepsLabel` | Steps to Reproduce |
| `emailLabel` | Email Address |
| `typeBug` | Bug Report |
| `typeSuggestion` | Suggestion |
| `typeSupport` | Support |
| `cancelButton` | Cancel |
| `submitButton` | Submit Feedback |
| `submittingButton` | Submitting... |
| `closeButton` | Close |
| `retryButton` | Try Again |
| `keepWritingButton` | No, Keep Writing |
| `discardButton` | Yes, Discard |
| `bugPlaceholder` | Describe the bug you encountered... |
| `suggestionPlaceholder` | Describe your suggestion in detail... |
| `supportPlaceholder` | What do you need help with? |
| `stepsPlaceholder` | 1. Go to...\n2. Click on...\n3. Notice that... |
| `emailPlaceholder` | your.email@example.com |
| `warningTitle` | One Entry at a Time |
| `warningMessage` | Please submit only ONE item per form... |
| `successMessage` | Your feedback has been submitted successfully... |
| `errorMessage` | We couldn't submit your feedback. Please try again. |
| `errorDefault` | Network error: Unable to reach the server |
| `discardMessage` | Are you sure you want to cancel? Your feedback will be lost. |
| `emailHint` | We'll use this to contact you about updates |

### Translation Priority
1. Custom `translations` object (highest priority)
2. Built-in translations for selected `locale`
3. English defaults (fallback)

### Adding New Languages
To add a new language, add an entry to the `TRANSLATIONS` object in `betahub-widget.js`:
```javascript
const TRANSLATIONS = {
  // ... existing languages
  ja: {
    buttonText: 'フィードバック',
    modalTitle: 'フィードバックを送信',
    // ... all other keys
  }
};
```

## Important Implementation Notes

1. **No Build Process**: This is a pure vanilla JavaScript file meant to be distributed as-is
2. **Browser Compatibility**: Requires Shadow DOM support (Chrome 53+, Firefox 63+, Safari 10.1+, Edge 79+)
3. **CORS**: BetaHub API must have CORS enabled for widget submissions
4. **Rate Limiting**: API enforces rate limits (default: 8 submissions/day/type/IP)
5. **Security**: Never commit auth tokens to version control; use environment-specific tokens
6. **Character Limits**: Description max 2000 chars, Steps max 1000 chars (enforced by maxlength attribute)

## Modifying the Widget

### Adding a New Feedback Type
1. Update `getTemplate()` to add new type button
2. Add placeholder text in `selectType()` method
3. Update `submitFeedback()` switch statement
4. Create new `submit{TypeName}()` method
5. Add corresponding API endpoint URL

### Customizing Styles
All styles are in the `getStyles()` method. The widget uses a pastel blue light theme:
- **Backgrounds**: `#DCEFF7` (header), `#FFFFFF` (modal body), `#F7F9FA` (alternate)
- **Primary Actions**: `#237390` (buttons), `#1E627B` (hover), `#144252` (active)
- **Text Colors**: `#2C3E50` (primary), `#6F7F90` (secondary), `#788087` (disabled)
- **Semantic Colors**: `#58CEA7` (success), `#F8C060` (warning), `#F47C7C` (error)
- **Feedback Types**: `#F47C7C` (bug), `#58CEA7` (suggestion), `#237390` (support)

To customize colors, search for these hex values in `getStyles()` and replace them consistently throughout. Always test contrast ratios after making changes to ensure WCAG AA compliance.

### Adding Form Fields
1. Add HTML in `getTemplate()` method
2. Add event listener in `attachEventListeners()`
3. Update validation in `updateSubmitButton()`
4. Include field value in appropriate `submit{Type}()` method

## Testing Checklist

When making changes, verify:
- [ ] Widget renders correctly in all 4 corner positions
- [ ] Pastel blue color palette displays correctly (all colors are light theme)
- [ ] All three feedback types (bug/suggestion/support) submit correctly
- [ ] Steps to Reproduce field shows/hides appropriately
- [ ] Character counters update correctly
- [ ] Form validation prevents empty submissions
- [ ] Success/error modals display correctly
- [ ] Cancel confirmation works with unsaved changes
- [ ] Custom fields are included in API requests
- [ ] Widget styling doesn't conflict with demo.html styles (Shadow DOM isolation)
- [ ] Form clears after successful submission
- [ ] Retry mechanism works after API errors
- [ ] Button states (default, hover, active, disabled) use correct pastel colors
- [ ] Text contrast meets WCAG AA standards on all backgrounds

### Localization Testing
- [ ] Default English locale works correctly
- [ ] Setting `locale: 'fr'` (or other language) shows correct translations
- [ ] `locale: 'auto'` detects browser language
- [ ] Custom `translations` override specific strings
- [ ] Custom translations work with non-English locale
- [ ] Deprecated `buttonText` still works (with console warning)
- [ ] Unknown locale falls back to English
- [ ] All UI elements (buttons, labels, messages, placeholders) are translated
- [ ] Dynamic text (Submitting...) updates to translated version
