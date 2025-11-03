# BetaHub Widget Testing

This directory contains all testing resources for the BetaHub Feedback Widget.

## Quick Start

1. **Start the test server**:
   ```bash
   ./scripts/start-server.sh
   ```

2. **Open the manual testing guide**:
   ```bash
   open tests/MANUAL_TESTING_GUIDE.md
   ```

3. **Run through all test cases** in the guide

4. **Report any bugs** using the bug report template

5. **Stop the server** when done:
   ```bash
   ./scripts/stop-server.sh
   ```

## Directory Structure

```
tests/
├── README.md                    # This file
├── MANUAL_TESTING_GUIDE.md      # Complete test case suite
├── BUG_REPORT_TEMPLATE.md       # Template for bug reports
├── manual/                      # Manual test HTML files
│   ├── test-single-type.html
│   ├── test-partial-types.html
│   ├── test-config-error.html
│   └── test-invalid-types.html
└── bugs/                        # Bug reports directory
    ├── README.md
    ├── screenshots/             # Bug screenshots
    └── archive/                 # Resolved bugs
```

## Test Files

### Manual Test Files (`manual/`)

Each test file focuses on a specific configuration or feature:

| File | Purpose | Configuration |
|------|---------|--------------|
| `test-single-type.html` | Single feedback type (bug only) | `enabledTypes: ['bug']` |
| `test-partial-types.html` | Multiple but not all types | `enabledTypes: ['bug', 'suggestion']` |
| `test-config-error.html` | Empty array error handling | `enabledTypes: []` |
| `test-invalid-types.html` | Invalid type names | `enabledTypes: ['bug', 'invalid-type', 'suggestion']` |

**Main demo**: `demo.html` in project root (all features enabled)

## Running Tests

### Method 1: Automated Testing with Claude (Playwright MCP)

**For Claude Code users**: Claude can run automated browser tests using Playwright MCP.

```bash
# 1. Start server
./scripts/start-server.sh

# 2. Ask Claude to run tests
# "Run the Playwright test suite"
# or
# "Test the single-type configuration with Playwright"
```

**See**: `tests/PLAYWRIGHT_TESTING_GUIDE.md` for Claude-executable test cases

**Limitations**:
- ⚠️ Chrome/Chromium only (no Firefox, Safari, Edge)
- ⚠️ Cannot verify console messages
- ⚠️ Cannot access DevTools

### Method 2: Complete Manual Test Suite (Recommended for Releases)

Follow the comprehensive manual testing guide for cross-browser testing:

```bash
# 1. Start server
./scripts/start-server.sh

# 2. Open testing guide
open tests/MANUAL_TESTING_GUIDE.md

# 3. Execute all test cases (TC-001 through TC-017)
# 4. Test in multiple browsers (Chrome, Firefox, Safari, Edge)
# 5. Mark pass/fail for each test
# 6. Report any failures as bugs
```

### Method 3: Quick Smoke Test

Test critical paths only:

```bash
# Start server
./scripts/start-server.sh

# Test these files in your browser:
# 1. http://localhost:8000/demo.html (default config)
# 2. http://localhost:8000/tests/manual/test-single-type.html
# 3. http://localhost:8000/tests/manual/test-config-error.html

# Stop server
./scripts/stop-server.sh
```

### Method 4: Specific Feature Test

Test a specific feature or configuration:

```bash
# Start server
./scripts/start-server.sh

# Navigate to relevant test file
# Example: Testing single-type mode
open http://localhost:8000/tests/manual/test-single-type.html
```

## Writing New Tests

### Creating a New Test HTML File

1. Copy an existing test file or start from template:
   ```bash
   cp tests/manual/test-single-type.html tests/manual/test-new-feature.html
   ```

2. Update the configuration in the `<script>` section

3. Update the description in the `<div class="info">` section

4. Ensure script path is correct: `src="../../betahub-widget.js"`

5. Add test case to `MANUAL_TESTING_GUIDE.md`

### Test File Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test: Feature Name</title>
    <style>
        /* Standard test page styles */
        body { font-family: Arial, sans-serif; padding: 40px; background: #f0f0f0; }
        .info { background: #fff; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="info">
        <h1>Test: Feature Name</h1>
        <p><strong>Configuration:</strong> <code>configOption: value</code></p>
        <p><strong>Expected:</strong> Description of expected behavior</p>
    </div>

    <script src="../../betahub-widget.js"></script>
    <script>
        BetaHubWidget.init({
            projectId: 'pr-5287510306',
            authToken: 'tkn-15e6fbc1470613d5cfd2199edbde52157379b8c6dcd365441eabf8fea62d76a7',
            // Your test configuration here
        });
    </script>
</body>
</html>
```

## Reporting Bugs

### Creating a Bug Report

1. **Copy the template**:
   ```bash
   cp tests/BUG_REPORT_TEMPLATE.md tests/bugs/BUG-$(date +%Y-%m-%d)-description.md
   ```

2. **Fill out all sections**:
   - Test Case ID (if applicable)
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if needed)
   - Console output
   - Severity level

3. **Save screenshots** (if needed):
   ```bash
   mkdir -p tests/bugs/screenshots
   # Save your screenshots there
   ```

4. **File naming convention**:
   ```
   BUG-YYYY-MM-DD-short-description.md
   ```
   Examples:
   - `BUG-2024-11-03-submit-button-disabled.md`
   - `BUG-2024-11-03-modal-not-closing.md`

### Bug Severity Guidelines

- **Critical**: Widget completely broken, cannot initialize or submit
- **High**: Major feature not working, workaround exists
- **Medium**: Minor feature issue, doesn't block usage
- **Low**: Visual issue, typo, minor inconvenience

## Server Management

### Starting the Server

```bash
./scripts/start-server.sh
```

Features:
- ✅ Checks if server is already running
- ✅ Checks if port 8000 is available
- ✅ Saves PID for clean shutdown
- ✅ Shows all available test URLs
- ✅ Provides testing instructions

### Stopping the Server

```bash
./scripts/stop-server.sh
```

Features:
- ✅ Gracefully stops the server
- ✅ Cleans up PID file
- ✅ Force kills if necessary
- ✅ Checks for orphaned processes

### Troubleshooting

**Port 8000 already in use:**
```bash
# Find what's using the port
lsof -i :8000

# Kill the process
lsof -ti :8000 | xargs kill -9
```

**Server won't start:**
```bash
# Check if Python is installed
python3 --version

# Try running server manually
python3 -m http.server 8000
```

**Server won't stop:**
```bash
# Force kill all Python HTTP servers
pkill -9 -f "python3 -m http.server"
```

## Automated Testing (Future)

This project currently uses manual testing. Future enhancements could include:

- [ ] Playwright automated tests
- [ ] Jest unit tests for utility functions
- [ ] Visual regression testing
- [ ] CI/CD integration

## Best Practices

### Before Committing Code

- [ ] Run complete test suite
- [ ] All tests pass
- [ ] No console errors
- [ ] No visual regressions
- [ ] Bug reports filed for any issues

### After Adding Features

- [ ] Create test HTML file for new feature
- [ ] Add test cases to MANUAL_TESTING_GUIDE.md
- [ ] Update documentation
- [ ] Test in multiple browsers

### When Fixing Bugs

- [ ] Reproduce the bug using test file
- [ ] Fix the issue
- [ ] Verify fix with test case
- [ ] Archive bug report to `tests/bugs/archive/`

## Browser Compatibility

Test in these browsers when possible:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Note specific browser issues in bug reports.

## Questions?

For questions about testing:
1. Check this README
2. Review MANUAL_TESTING_GUIDE.md
3. See BUG_REPORT_TEMPLATE.md for reporting issues

---

**Happy Testing! 🧪**
