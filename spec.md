# ASTROPALM-DESSTINY / Nadi Cards Numerology App

## Current State
- NatalChart.tsx uses DESTINY_COLOR = "#16a34a" (green)
- DownloadChartDialog.tsx uses DESTINY_COLOR = "#16a34a" (green)
- HoroscopePage.tsx downloads a plain text (.txt) report with no color styling
- The horoscope page uses default app colors, not the numerology green/gold scheme

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- **NatalChart.tsx**: Change DESTINY_COLOR from green (#16a34a) to yellow (#eab308). Update the color legend in NatalChart display accordingly if shown.
- **DownloadChartDialog.tsx**: Change DESTINY_COLOR from "#16a34a" to "#eab308" (yellow). Update COLOR_LEGEND entry for Destiny to yellow. Destiny cells in canvas drawings now render in yellow.
- **HoroscopePage.tsx**: The "Download Report" button currently downloads a .txt file. Change it to also produce a visual download (or make the existing report styled). More specifically, apply the same color theme as numerology (green header #2E8B57, gold border #c8a96e, white backgrounds) to the horoscope page's visual elements (tabs, headers, buttons) so it matches numerology's look.

### Remove
- Nothing

## Implementation Plan
1. In NatalChart.tsx: change DESTINY_COLOR constant to "#eab308"
2. In DownloadChartDialog.tsx: change DESTINY_COLOR constant to "#eab308", update COLOR_LEGEND destiny color
3. In HoroscopePage.tsx: update the page's primary styling to use green (#2E8B57) for headers, section titles, active tabs, and primary buttons — matching numerology's color scheme. This makes "horoscope same colour like numerology".
