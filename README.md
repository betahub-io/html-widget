# BetaHub Feedback Widget

An embeddable feedback widget for games and web applications that integrates seamlessly with BetaHub.

## Features

- **Three Feedback Types**: Bug Reports, Feature Requests (Suggestions), and Support Tickets
- **Shadow DOM Isolation**: Complete CSS isolation prevents styling conflicts
- **Theme Support**: Dark, light, and auto themes
- **Custom Fields**: Pass game metadata (version, level, platform, etc.) with submissions
- **Zero Dependencies**: Pure vanilla JavaScript
- **Responsive**: Works on all screen sizes
- **Easy Integration**: Single script tag, works with any web game engine

## Quick Start

### 1. Include the Widget

```html
<script src="betahub-widget.js"></script>
<script>
  BetaHubWidget.init({
    projectId: 'your-project-id',
    authToken: 'tkn-your-auth-token'
  });
</script>
```

### 2. Get Your Credentials

1. Go to your BetaHub project dashboard
2. Navigate to **Project → Integrations → Auth Tokens**
3. Create a new auth token with these permissions:
   - `can_create_bug_report`
   - `can_create_feature_request`
4. Copy your project ID and the generated token

## Configuration Options

### Required

| Option | Type | Description |
|--------|------|-------------|
| `projectId` | string | Your BetaHub project ID |
| `authToken` | string | Your auth token (format: `tkn-...`) |

### Optional

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiBaseUrl` | string | `'https://app.betahub.io'` | BetaHub API endpoint |
| `theme` | string | `'dark'` | Widget theme: `'dark'`, `'light'`, or `'auto'` |
| `position` | string | `'bottom-right'` | Button position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `buttonText` | string | `'Feedback'` | Text displayed on the floating button |
| `customFields` | object | `{}` | Custom metadata sent with every submission |

## Advanced Configuration

### Custom Fields

Pass game-specific metadata with every submission:

```javascript
BetaHubWidget.init({
  projectId: 'your-project-id',
  authToken: 'tkn-your-auth-token',
  customFields: {
    gameVersion: '1.2.3',
    platform: 'web',
    playerLevel: 15,
    characterClass: 'warrior',
    sessionId: 'abc123'
  }
});
```

These fields will be automatically included with every bug report, feature request, and support ticket submission.

### Theme Options

**Dark Theme (Default)**
```javascript
BetaHubWidget.init({
  // ...
  theme: 'dark'
});
```

**Light Theme**
```javascript
BetaHubWidget.init({
  // ...
  theme: 'light'
});
```

**Auto Theme** (matches user's system preference)
```javascript
BetaHubWidget.init({
  // ...
  theme: 'auto'
});
```

### Button Position

```javascript
BetaHubWidget.init({
  // ...
  position: 'bottom-left' // or 'top-right', 'top-left'
});
```

## Integration Examples

### PixiJS

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://pixijs.download/release/pixi.js"></script>
  <script src="betahub-widget.js"></script>
</head>
<body>
  <script>
    // Initialize your PixiJS app
    const app = new PIXI.Application({
      width: 800,
      height: 600
    });
    document.body.appendChild(app.view);

    // Initialize BetaHub widget
    BetaHubWidget.init({
      projectId: 'your-project-id',
      authToken: 'tkn-your-auth-token',
      customFields: {
        gameVersion: '1.0.0',
        renderer: 'pixi',
        fps: app.ticker.FPS
      }
    });
  </script>
</body>
</html>
```

### Phaser

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js"></script>
  <script src="betahub-widget.js"></script>
</head>
<body>
  <script>
    // Initialize your Phaser game
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: { /* your scenes */ }
    };
    const game = new Phaser.Game(config);

    // Initialize BetaHub widget
    BetaHubWidget.init({
      projectId: 'your-project-id',
      authToken: 'tkn-your-auth-token',
      customFields: {
        gameVersion: '1.0.0',
        engine: 'phaser',
        currentScene: game.scene.keys.active
      }
    });
  </script>
</body>
</html>
```

### Vanilla JavaScript Game

```html
<!DOCTYPE html>
<html>
<head>
  <script src="betahub-widget.js"></script>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script>
    // Your game code
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Initialize BetaHub widget
    BetaHubWidget.init({
      projectId: 'your-project-id',
      authToken: 'tkn-your-auth-token',
      customFields: {
        gameVersion: '1.0.0',
        platform: 'web'
      }
    });
  </script>
</body>
</html>
```

## Feedback Types

### Bug Reports

Users can submit bug reports with:
- Description (required)
- Steps to reproduce (required)
- Custom fields (automatically included)

The widget enforces a minimum description length and requires steps to reproduce for bug reports.

### Feature Requests (Suggestions)

Users can submit feature requests with:
- Description (required)
- Custom fields (automatically included)

### Support Tickets

Users can submit support tickets with:
- Description (required)
- Custom fields (automatically included)

## API Integration

The widget integrates with the following BetaHub API endpoints:

- **Bug Reports**: `POST /projects/{projectId}/issues.json`
- **Feature Requests**: `POST /projects/{projectId}/feature_requests.json`
- **Support Tickets**: `POST /projects/{projectId}/tickets.json`

All requests use the `FormUser` authentication format with the provided auth token.

## Rate Limiting

BetaHub API has rate limits per IP address (default: 8 submissions per day per feedback type). The widget will display an error message if the rate limit is exceeded.

## Browser Support

The widget uses Shadow DOM and modern JavaScript features. It supports:

- Chrome 53+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Styling

The widget uses Shadow DOM for complete CSS isolation, so it won't interfere with your game's styles and your game's styles won't affect the widget.

If you need to customize the widget's appearance beyond the light/dark theme options, you'll need to modify the `getStyles()` method in `betahub-widget.js`.

## Testing

1. Open `demo.html` in your browser to see the widget in action
2. Replace the placeholder `projectId` and `authToken` with your actual credentials
3. Test all three feedback types to ensure they work correctly

## Troubleshooting

### Widget doesn't appear
- Check the browser console for errors
- Ensure `projectId` and `authToken` are correctly set
- Verify that the script is loaded before calling `init()`

### Submissions fail
- Verify your auth token has the correct permissions
- Check that your project ID is correct
- Ensure the API base URL is correct (default should work for most cases)
- Check the browser console for detailed error messages

### CORS errors
- The BetaHub API should have CORS enabled for widget submissions
- If you're testing locally, use a local web server instead of opening the HTML file directly

## Security

- Never expose your auth token in public repositories
- Use environment-specific tokens for development vs. production
- Auth tokens can be configured with rate limits and permissions in the BetaHub dashboard
- The widget sends data over HTTPS to ensure secure transmission

## License

[Your License Here]

## Support

For issues or questions:
- Open an issue on GitHub
- Contact BetaHub support
- Check the BetaHub documentation at https://docs.betahub.io

## Changelog

### Version 1.0.0
- Initial release
- Bug reports, feature requests, and support tickets
- Shadow DOM for CSS isolation
- Dark/light/auto themes
- Custom fields support
- Zero dependencies
