# Bug Reports

This directory contains bug reports discovered during manual testing.

## How to Report a Bug

1. Copy the template:
   ```bash
   cp ../BUG_REPORT_TEMPLATE.md BUG-YYYY-MM-DD-short-description.md
   ```

2. Fill out all sections of the template

3. Save screenshots to `screenshots/` subdirectory (if needed):
   ```bash
   mkdir -p screenshots
   ```

4. Name your bug report file descriptively:
   - Format: `BUG-YYYY-MM-DD-short-description.md`
   - Example: `BUG-2024-11-03-submit-button-disabled.md`

5. Include the bug report in your commit when fixing the issue

## Bug Report Lifecycle

1. **Reported** - Bug discovered and documented
2. **Confirmed** - Bug reproduced and verified
3. **In Progress** - Fix is being worked on
4. **Fixed** - Fix implemented and committed
5. **Verified** - Fix tested and confirmed working
6. **Closed** - Bug report archived (moved to `archive/` folder)

## Organization

- Active bug reports: This directory
- Screenshots/videos: `screenshots/` subdirectory
- Resolved bugs: `archive/` subdirectory (create when needed)

## Tips

- Be as detailed as possible in reproduction steps
- Include console output and error messages
- Attach screenshots for visual issues
- Note if the bug is intermittent or consistent
- Test in multiple browsers if possible
