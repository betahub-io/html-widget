# Playwright MCP Testing Guide

This guide is for **Claude Code** to execute browser tests using Playwright MCP. These tests can be run automatically by Claude to verify widget functionality.

## Important Limitations

### Browser Limitations
- ⚠️ **Chrome/Chromium Only** - Playwright MCP runs only in Chrome
- ❌ Cannot test Firefox, Safari, or Edge
- ❌ Cross-browser compatibility requires human testing

### DevTools Limitations
Claude using Playwright MCP **cannot**:
- ❌ Access browser DevTools / Console
- ❌ See console.log messages
- ❌ Inspect console errors or warnings
- ❌ View Network tab
- ❌ Inspect Shadow DOM structure in DevTools

### What Claude CAN Do
Claude using Playwright MCP **can**:
- ✅ Navigate to pages
- ✅ Click elements
- ✅ Fill forms
- ✅ Take screenshots
- ✅ Read page snapshots (accessibility tree)
- ✅ Verify visible UI elements
- ✅ Test user interactions
- ✅ Test in Chrome/Chromium browser only

## Prerequisites for Claude

Before running tests, Claude should:

1. Start the test server:
   ```bash
   python3 -m http.server 8000 &
   ```

2. Navigate to test pages using Playwright MCP

3. Take screenshots to verify visual appearance

4. Test interactions (clicks, typing, form submission)

## Test Execution Checklist

### TC-P001: Default Configuration - All Types Enabled

**File**: `demo.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/demo.html
2. Take screenshot to verify page loaded
3. Click feedback button (ref from snapshot)
4. Take screenshot of modal
5. Verify all three type buttons are visible
6. Click each type button and verify form updates
7. Close modal
```

**Expected Visual Results**:
- ✅ Three type buttons visible: "Bug Report", "Suggestion", "Support"
- ✅ Modal opens with correct layout
- ✅ Form fields appear/disappear based on type selection

**Note**: Cannot verify console messages about enabled types.

---

### TC-P002: Single Type Mode (Bug Only)

**File**: `tests/manual/test-single-type.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/tests/manual/test-single-type.html
2. Click feedback button
3. Take screenshot of modal
4. Verify type selector section is NOT visible
5. Verify only Description and Steps to Reproduce fields are visible
```

**Expected Visual Results**:
- ✅ No type selector buttons visible
- ✅ No type badge visible (entire section hidden)
- ✅ Description field visible
- ✅ Steps to Reproduce field visible

**Note**: Cannot verify console message "Enabled feedback types: bug"

---

### TC-P003: Partial Types (Bug + Suggestion)

**File**: `tests/manual/test-partial-types.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/tests/manual/test-partial-types.html
2. Click feedback button
3. Take screenshot
4. Count visible type buttons (should be 2)
5. Click "Bug Report" button
6. Verify Steps to Reproduce field appears
7. Click "Suggestion" button
8. Verify Steps to Reproduce field disappears
```

**Expected Visual Results**:
- ✅ Only 2 type buttons visible
- ✅ "Bug Report" and "Suggestion" buttons present
- ✅ Support button NOT visible
- ✅ Form updates correctly when switching types

---

### TC-P004: Configuration Error Modal

**File**: `tests/manual/test-config-error.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/tests/manual/test-config-error.html
2. Click feedback button
3. Take screenshot
4. Verify error modal appears instead of feedback form
5. Verify modal title contains "Configuration Error"
6. Verify "How to fix" section is visible
7. Click "Close" button
8. Verify modal closes
```

**Expected Visual Results**:
- ✅ Error modal appears (not feedback form)
- ✅ Modal title: "⚙️ Configuration Error: No Feedback Types Enabled"
- ✅ Error message visible
- ✅ "How to fix" section visible with code example
- ✅ Close button works

**Note**: Cannot verify console errors.

---

### TC-P005: Invalid Types (Filtering)

**File**: `tests/manual/test-invalid-types.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/tests/manual/test-invalid-types.html
2. Click feedback button
3. Take screenshot
4. Verify only 2 type buttons visible (Bug Report, Suggestion)
5. Verify widget functions normally
```

**Expected Visual Results**:
- ✅ Widget loads successfully
- ✅ Only Bug Report and Suggestion buttons visible
- ✅ No error modal (invalid types filtered out)

**Note**: Cannot verify console warning about invalid type.

---

### TC-P006: Form Interaction - Bug Report

**File**: `demo.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/demo.html
2. Click feedback button
3. Verify "Bug Report" is selected
4. Type in Description: "Test bug description"
5. Type in Steps to Reproduce: "1. Test\n2. Steps"
6. Take screenshot showing filled form
7. Verify Submit button becomes enabled
8. Click Submit button
9. Wait for response
10. Take screenshot of result modal
```

**Expected Visual Results**:
- ✅ Submit button disabled when form empty
- ✅ Character counters update as typing
- ✅ Submit button enables when both fields filled
- ✅ Success modal appears after submission (or error modal if API fails)

**Note**: This will actually submit to the real API. Success depends on network/API availability.

---

### TC-P007: Form Interaction - Type Switching

**File**: `demo.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/demo.html
2. Click feedback button
3. Verify "Bug Report" selected, Steps field visible
4. Click "Suggestion" button
5. Take screenshot
6. Verify Steps field is hidden
7. Click "Support" button
8. Take screenshot
9. Verify Steps field still hidden
10. Click "Bug Report" button
11. Verify Steps field visible again
```

**Expected Visual Results**:
- ✅ Steps to Reproduce field shows/hides correctly
- ✅ Placeholder text changes for each type
- ✅ Active button styling updates

---

### TC-P008: Cancel Confirmation Flow

**File**: `demo.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/demo.html
2. Click feedback button
3. Type something in Description field
4. Click "Cancel" button
5. Take screenshot
6. Verify cancel confirmation modal appears
7. Click "No, Keep Writing" button
8. Verify returned to form with text preserved
9. Click "Cancel" again
10. Click "Yes, Discard"
11. Verify all modals close
```

**Expected Visual Results**:
- ✅ Cancel confirmation modal appears when form has content
- ✅ "No, Keep Writing" returns to form
- ✅ "Yes, Discard" closes everything
- ✅ Text is preserved when clicking "No, Keep Writing"

---

### TC-P009: Empty Form Cancel (No Confirmation)

**File**: `demo.html`

**Steps for Claude**:
```
1. Navigate to http://localhost:8000/demo.html
2. Click feedback button
3. Do NOT type anything
4. Click "Cancel" button
5. Verify modal closes immediately (no confirmation)
```

**Expected Visual Results**:
- ✅ Modal closes immediately without confirmation when form is empty

---

### TC-P010: Button Positioning

**Test with different position values**

**Steps for Claude**:
```
For each position: bottom-right, bottom-left, top-right, top-left:
1. Navigate to test page with that position config
2. Take screenshot
3. Verify button appears in correct corner
```

**Expected Visual Results**:
- ✅ Button appears in specified corner
- ✅ Button is clickable
- ✅ Modal opens correctly from any position

---

## Visual Regression Testing

When making changes to the widget, Claude should:

1. Take screenshots of each test case BEFORE changes
2. Make the code changes
3. Take screenshots of each test case AFTER changes
4. Compare screenshots to identify visual regressions

### Screenshot Naming Convention:
```
test-name-before.png
test-name-after.png
```

## Limitations That Require Human Testing

The following test cases **require human verification** because Claude cannot:

### Cross-Browser Testing Required:
- ⚠️ **All test cases** - Playwright MCP uses Chrome only
- Firefox compatibility testing
- Safari compatibility testing
- Edge compatibility testing
- Browser-specific rendering issues

### Console Verification Required:
- TC-001: Cannot verify console log "Enabled feedback types: bug, suggestion, support"
- TC-005: Cannot verify console log "Enabled feedback types: bug"
- TC-006: Cannot verify console log "Enabled feedback types: bug, suggestion"
- TC-007: Cannot verify console ERROR messages
- TC-008: Cannot verify console WARNING messages

### DevTools Required:
- TC-013: Network error testing (need to disable network in DevTools)
- TC-014: API error handling (need to see network responses)
- TC-017: CSS isolation (need to inspect Shadow DOM in DevTools)

### Accessibility Testing Required:
- TC-015: Keyboard navigation (Playwright can do this but needs specific implementation)
- TC-016: Screen reader compatibility (requires actual screen reader)

### Theme Testing Required:
- TC-012: Theme variations (Claude can take screenshots but cannot verify color accuracy without visual comparison)

### Recommendation:
**For production releases**, always run human tests in multiple browsers:
- Chrome (covered by Playwright MCP)
- Firefox (human testing required)
- Safari (human testing required)
- Edge (human testing required)

## Running Tests as Claude

### Quick Smoke Test:
```bash
# 1. Start server
python3 -m http.server 8000 &

# 2. Run key test cases
- TC-P001: Default config
- TC-P002: Single type
- TC-P004: Config error

# 3. Take screenshots and verify visuals
# 4. Report any visual issues found
```

### Full Test Suite:
```
Execute all TC-P001 through TC-P010 test cases
Take screenshots at each step
Verify expected visual results
Report any failures
```

## Reporting Issues Found by Playwright

When Claude finds issues during Playwright testing:

1. **Save screenshot evidence**: Use descriptive names like `issue-submit-button-disabled.png`
2. **Document what was tested**: Include test case ID and steps
3. **Describe visual discrepancy**: What was expected vs what was seen
4. **Note**: Mention "Found via Playwright MCP" in the bug report
5. **Provide URL and snapshot**: Include the page snapshot from Playwright

## Example Playwright Test Execution

```
User: "Test the single-type configuration"

Claude:
1. Starting HTTP server on port 8000
2. Navigating to test-single-type.html
3. Taking initial screenshot
4. Clicking feedback button
5. Taking screenshot of modal
6. Verifying type selector is not visible ✅
7. Verifying description field is visible ✅
8. Verifying steps field is visible ✅
9. Test PASSED - Screenshot saved as test-single-type-result.png
```

## Tips for Claude

1. **Always take screenshots** - They're the primary verification method
2. **Use page snapshots** - Read the accessibility tree to verify elements exist
3. **Test interactions** - Click, type, and verify state changes
4. **Compare before/after** - Visual regression is caught through screenshots
5. **Report limitations** - Be explicit about what cannot be verified (console logs)
6. **Focus on visuals** - Modal appearance, button visibility, form field presence
7. **Test user flows** - Complete interactions like form submission workflows

---

**Note**: This guide is optimized for automated testing by Claude using Playwright MCP. For console verification and DevTools inspection, refer to `MANUAL_TESTING_GUIDE.md` for human testing procedures.
