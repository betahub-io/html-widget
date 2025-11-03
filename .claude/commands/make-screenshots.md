I want you to run the server and run demo.html with playwright to make a screenshot of each available built-in color theme.

Important:
1. This must be a screenshot cropped to the bug reporting dialog itself. Therefore you must, after making a screenshot, grab the bounding rect of the displayed dialog and crop the screenshot.
2. **Always check the actual screenshot dimensions** against the viewport dimensions before cropping. Screenshots may be scaled (e.g., 2x for Retina displays), so calculate the scale factor: `screenshot_width / viewport_width`.
3. **Multiply all crop coordinates by the scale factor** before cropping. Do not assume any specific scale factor.
4. After cropping, **verify the cropped screenshot** by reading it to ensure it contains only the modal dialog and nothing else.
5. Save screenshots to screenshots/ dir with naming pattern `{theme-name}-theme.png`. You may update existing ones.

## Process:
1. Read betahub-widget.js to identify all available themes in the THEMES object
2. Start HTTP server on an available port
3. For each theme found:
   - Use `window.switchTheme(themeName)` to switch themes
   - Open the feedback modal
   - Take full viewport screenshot
   - Get viewport dimensions and modal bounding rect via JavaScript
   - Get actual screenshot file dimensions
   - Calculate scale factor and multiply all crop coordinates
   - Crop the screenshot
   - Verify the cropped result by reading the file
4. Clean up temporary files and close browser
5. Update README.md Screenshots section:
   - Read the current Screenshots section in README.md
   - Update it to include all themes found in THEMES object
   - Use the format: `### {Theme Name}\n![{Theme Name}](screenshots/{theme-name}-theme.png)`
   - Preserve the section structure and order