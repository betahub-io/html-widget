# Manual Testing Guide - BetaHub Widget

This guide provides comprehensive test cases for manually testing the BetaHub Feedback Widget in **multiple browsers** with **console verification**. Follow these steps to ensure all functionality works correctly after making changes.

> **Note for Claude Code Users**: Claude can run automated tests using Playwright MCP (Chrome only, no console access). See `PLAYWRIGHT_TESTING_GUIDE.md` for automated testing procedures. This manual guide is recommended for:
> - Cross-browser testing (Firefox, Safari, Edge)
> - Console log verification
> - DevTools inspection
> - Production release validation

## Prerequisites

1. Start the local test server:
   ```bash
   ./scripts/start-server.sh
   ```

2. Open your browser's Developer Tools (F12) to monitor console logs

## Test Execution

Each test case includes:
- **Test ID**: Unique identifier
- **Description**: What is being tested
- **Steps**: How to perform the test
- **Expected Result**: What should happen
- **Pass/Fail**: Check the box when passing

---

## 1. Default Configuration Tests

### TC-001: All Feedback Types Enabled (Default)

**File**: `demo.html`

**Description**: Test that all three feedback types work when no `enabledTypes` is specified.

**Steps**:
1. Navigate to `http://localhost:8000/demo.html`
2. Check browser console for initialization message
3. Click the "Feedback" button
4. Observe the modal

**Expected Result**:
- ✅ Console shows: `BetaHub Widget: Enabled feedback types: bug, suggestion, support`
- ✅ Modal displays three type selector buttons: "Bug Report", "Suggestion", "Support"
- ✅ "Bug Report" button is active (selected) by default
- ✅ "Steps to Reproduce" field is visible for bugs
- ✅ All buttons are clickable and change the form appropriately

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-002: Bug Report Submission Flow

**File**: `demo.html`

**Description**: Test complete bug report submission.

**Steps**:
1. Open the feedback modal
2. Ensure "Bug Report" is selected
3. Fill in Description: "Test bug report"
4. Fill in Steps to Reproduce: "1. Open widget\n2. Click submit"
5. Click "Submit Feedback"

**Expected Result**:
- ✅ Submit button is disabled until both fields are filled
- ✅ Character counters update as you type
- ✅ Submit button becomes enabled when both fields have content
- ✅ Clicking submit shows loading state ("Submitting...")
- ✅ Success modal appears after submission
- ✅ Form clears after closing success modal

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-003: Suggestion Submission Flow

**File**: `demo.html`

**Description**: Test suggestion submission (no steps field).

**Steps**:
1. Open the feedback modal
2. Click "Suggestion" button
3. Verify "Steps to Reproduce" field disappears
4. Fill in Description: "Test suggestion"
5. Click "Submit Feedback"

**Expected Result**:
- ✅ "Steps to Reproduce" field is hidden for suggestions
- ✅ Placeholder text changes to "Describe your suggestion in detail..."
- ✅ Submit button enables with just description filled
- ✅ Submission completes successfully

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-004: Support Ticket Submission Flow

**File**: `demo.html`

**Description**: Test support ticket submission.

**Steps**:
1. Open the feedback modal
2. Click "Support" button
3. Verify "Steps to Reproduce" field disappears
4. Fill in Description: "Test support request"
5. Click "Submit Feedback"

**Expected Result**:
- ✅ "Steps to Reproduce" field is hidden for support
- ✅ Placeholder text changes to "What do you need help with?"
- ✅ Email field appears (if `requireEmail` or `showEmailField: 'always'`)
- ✅ Submit button enables appropriately
- ✅ Submission completes successfully

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## 2. Single Feedback Type Tests

### TC-005: Single Type (Bug Only)

**File**: `tests/manual/test-single-type.html`

**Description**: Test widget with only bug reports enabled.

**Steps**:
1. Navigate to `http://localhost:8000/tests/manual/test-single-type.html`
2. Check browser console for initialization
3. Click the "Feedback" button

**Expected Result**:
- ✅ Console shows: `BetaHub Widget: Enabled feedback types: bug`
- ✅ Feedback Type section is completely hidden (no badge, no buttons)
- ✅ Form shows Description and Steps to Reproduce fields
- ✅ Bug-specific placeholder text is shown
- ✅ Form functions correctly for bug submission

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## 3. Partial Feedback Type Tests

### TC-006: Partial Types (Bug + Suggestion)

**File**: `tests/manual/test-partial-types.html`

**Description**: Test widget with only bug and suggestion types enabled.

**Steps**:
1. Navigate to `http://localhost:8000/tests/manual/test-partial-types.html`
2. Check browser console
3. Click the "Feedback" button
4. Try clicking each visible button

**Expected Result**:
- ✅ Console shows: `BetaHub Widget: Enabled feedback types: bug, suggestion`
- ✅ Only "Bug Report" and "Suggestion" buttons are visible
- ✅ "Support" button is hidden (display: none)
- ✅ Both visible buttons work correctly
- ✅ Switching between types updates form appropriately

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## 4. Configuration Error Tests

### TC-007: Empty Array Error

**File**: `tests/manual/test-config-error.html`

**Description**: Test error handling when `enabledTypes` is empty.

**Steps**:
1. Navigate to `http://localhost:8000/tests/manual/test-config-error.html`
2. Check browser console for errors
3. Click the "Feedback" button

**Expected Result**:
- ✅ Console shows ERROR: `BetaHub Widget Configuration Error: The 'enabledTypes' array is empty...`
- ✅ Console shows Fix suggestion
- ✅ Configuration error modal appears instead of feedback form
- ✅ Modal title: "⚙️ Configuration Error: No Feedback Types Enabled"
- ✅ Modal shows clear error message and fix instructions
- ✅ Close button works

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-008: Invalid Type Names

**File**: `tests/manual/test-invalid-types.html`

**Description**: Test warning when invalid types are mixed with valid ones.

**Steps**:
1. Navigate to `http://localhost:8000/tests/manual/test-invalid-types.html`
2. Check browser console for warnings
3. Click the "Feedback" button

**Expected Result**:
- ✅ Console shows WARNING: `BetaHub Widget: Invalid feedback type(s) ignored: invalid-type`
- ✅ Console shows: `Valid types are: bug, suggestion, support`
- ✅ Console shows: `BetaHub Widget: Enabled feedback types: bug, suggestion`
- ✅ Widget functions normally with only valid types
- ✅ Only Bug and Suggestion buttons appear

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## 5. UI/UX Tests

### TC-009: Cancel Confirmation

**File**: `demo.html`

**Description**: Test cancel confirmation when user has unsaved changes.

**Steps**:
1. Open feedback modal
2. Type some text in Description field
3. Click "Cancel" button

**Expected Result**:
- ✅ Cancel confirmation modal appears
- ✅ Modal asks: "Are you sure you want to cancel? Your feedback will be lost."
- ✅ "No, Keep Writing" button closes confirmation and returns to form with text preserved
- ✅ "Yes, Discard" button closes all modals and clears form
- ✅ Clicking "Cancel" with empty form closes immediately (no confirmation)

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-010: Character Counters

**File**: `demo.html`

**Description**: Test real-time character counting.

**Steps**:
1. Open feedback modal
2. Type in Description field
3. Type in Steps to Reproduce field (for bugs)
4. Observe character counters

**Expected Result**:
- ✅ Description counter shows: `X / 2000`
- ✅ Steps counter shows: `X / 1000`
- ✅ Counters update in real-time as you type
- ✅ Fields enforce maxlength (cannot type beyond limit)

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-011: Button Position

**File**: Create test files with different `position` values

**Description**: Test floating button positioning.

**Steps**:
1. Test each position: `bottom-right`, `bottom-left`, `top-right`, `top-left`
2. Verify button appears in correct corner

**Expected Result**:
- ✅ `bottom-right`: Button in bottom-right corner (default)
- ✅ `bottom-left`: Button in bottom-left corner
- ✅ `top-right`: Button in top-right corner
- ✅ `top-left`: Button in top-left corner
- ✅ Button is always visible and clickable

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-012: Theme Support

**File**: Test theme variations in `demo.html`

**Description**: Test different theme options.

**Steps**:
1. Test `theme: 'pastel-blue'` (default)
2. Test `theme: 'light'`
3. Test `theme: 'dark'`

**Expected Result**:
- ✅ Pastel blue theme displays correctly
- ✅ Light theme displays correctly
- ✅ Dark theme displays correctly
- ✅ All text is readable against backgrounds
- ✅ Button colors match theme

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## 6. Error Handling Tests

### TC-013: Network Error Handling

**File**: `demo.html`

**Description**: Test error handling when API is unreachable.

**Steps**:
1. Open feedback modal
2. Fill in required fields
3. **Disable network in browser DevTools** (Offline mode)
4. Click "Submit Feedback"

**Expected Result**:
- ✅ Error modal appears
- ✅ Modal title: "❌ Submission Failed"
- ✅ Error message explains the issue
- ✅ "Try Again" button allows retry
- ✅ "Cancel" button closes error modal
- ✅ Form data is preserved (not cleared)

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-014: API Error Handling

**File**: `demo.html` with invalid credentials

**Description**: Test error handling when API returns error (e.g., 401, 403).

**Steps**:
1. Temporarily change `authToken` to invalid value
2. Fill in and submit feedback

**Expected Result**:
- ✅ Error modal appears with appropriate message
- ✅ Error details shown in error box
- ✅ Retry functionality works
- ✅ Form data preserved

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## 7. Accessibility Tests

### TC-015: Keyboard Navigation

**File**: `demo.html`

**Description**: Test keyboard accessibility.

**Steps**:
1. Use Tab key to navigate through form
2. Use Enter/Space to activate buttons
3. Use Escape to close modals (if implemented)

**Expected Result**:
- ✅ All interactive elements are focusable
- ✅ Focus order is logical (top to bottom)
- ✅ Focus indicators are visible
- ✅ Enter/Space activates buttons
- ✅ Tab navigation works in modals

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

### TC-016: Screen Reader Compatibility

**File**: `demo.html`

**Description**: Test with screen reader (optional, advanced).

**Steps**:
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate through the widget
3. Listen to announcements

**Expected Result**:
- ✅ All form labels are announced
- ✅ Button states are announced
- ✅ Error messages are announced
- ✅ Modal roles are properly announced

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## 8. Shadow DOM Isolation Tests

### TC-017: CSS Isolation

**File**: `demo.html`

**Description**: Test that widget styles don't conflict with page styles.

**Steps**:
1. Open demo.html
2. Inspect widget elements with DevTools
3. Verify styles are scoped to shadow DOM

**Expected Result**:
- ✅ Widget styles are encapsulated in shadow DOM
- ✅ Page styles don't affect widget appearance
- ✅ Widget styles don't leak to page
- ✅ Widget looks consistent regardless of page styles

**Status**: [ ] Pass / [ ] Fail

**Notes**: _______________

---

## Post-Testing Checklist

After completing all tests:

- [ ] All tests passed
- [ ] Any failures documented in bug reports
- [ ] Console shows no unexpected errors
- [ ] Browser console shows no warnings (except expected config warnings)
- [ ] No visual glitches or layout issues
- [ ] Widget performs well (no lag, fast loading)

## Reporting Bugs

If you find issues during testing:

1. Create a bug report using `tests/BUG_REPORT_TEMPLATE.md`
2. Include test case ID
3. Provide screenshots if applicable
4. Note browser and OS version
5. Save report as `tests/bugs/BUG-YYYY-MM-DD-description.md`

## Stopping the Test Server

When finished testing:
```bash
./scripts/stop-server.sh
```

---

## Notes for Developers

- Run full test suite before committing changes
- Update test cases when adding new features
- Keep test files in sync with main widget code
- Document any new configuration options with test cases
