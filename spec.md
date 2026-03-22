# Nadi Cards - Predict Tab

## Current State
VedicNumerologyApp has 4 tabs: New, Saved, Compare, Months. There is an existing auth system with sectionLevel, admin login, and admin-created user accounts. PredictionPanel component exists for natal chart predictions. NatalChart and YearChartGrid components exist.

## Requested Changes (Diff)

### Add
- 5th tab: **Predict** (paid/gated) added to the tab bar after Months
- Predict tab requires the user to be logged in (same admin-created credentials system). If not logged in, show a login prompt/gate.
- After login, show:
  - Full DOB form (Day, Month, Year) + Show Natal Chart button
  - After showing chart: 4 collapsible/togglable sub-sections below the Natal chart:
    1. **Nature** - Full paragraph predictions about personality/nature for each number 1-9, based on Basic number
    2. **Career** - Full paragraph career predictions per number 1-9, based on Destiny number  
    3. **Nature + Career** - Combined section with both nature paragraph and career info for the person's specific numbers
    4. **Compare** - Two DOB forms side by side, showing two Natal charts side by side for comparison
- Nature and Career prediction content: full rich paragraphs per number (1-9), not just bullet points

### Modify
- VedicNumerologyApp.tsx: add Predict tab trigger and content

### Remove
- Nothing removed

## Implementation Plan
1. Create PredictTab.tsx component with:
   - Auth gate (check if user is logged in via useAuth, show login prompt if not)
   - DOB form (reuse same Day/Month/Year pattern)
   - Natal chart display using NatalChart component
   - 4 sub-section tabs/accordions: Nature, Career, Nature+Career, Compare
   - Nature section: full paragraphs for each number 1-9
   - Career section: full paragraphs for each number 1-9
   - Nature+Career section: shows combined for the user's specific Basic and Destiny numbers
   - Compare section: two DOB inputs with two NatalChart side by side
2. Add rich paragraph content for nature (numbers 1-9) and career (numbers 1-9)
3. Integrate PredictTab into VedicNumerologyApp.tsx as the 5th tab
