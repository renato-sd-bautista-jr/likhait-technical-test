# Pull Request Documentation

## PR 1: BUG-001 — Expense Ordering Fix
**Branch:** `bugfix/BUG-001-expense-ordering`

### Problem
Expenses were ordered by `created_at` (database insertion timestamp) instead of the actual expense `date` field. This caused newly added expenses to appear in the wrong position in the list.

### Changes

#### Backend: `app/controllers/api/expenses_controller.rb`
- **Line 12**: Changed filter from `created_at` to `date` when querying expenses by year/month
- **Line 3**: Changed `index` sort order from `created_at: :desc` to `date: :desc, created_at: :desc` so most recent dates appear first

#### Frontend: `HistoryPage.tsx`, `RecentTransactions.tsx`, `api.ts`
- Added `fetchRecentExpenses()` API call at `GET /api/expenses/recent`
- New `RecentTransactions` component — a highlighted blue gradient card showing the 5 most recent expenses
- Placed above the `CategoryBreakdown` and `CalendarExpenseTable` on the History page
- Recent transactions also appear in the normal monthly table (no duplication, just a quick-access section)

### Files Changed
```
backend/app/controllers/api/expenses_controller.rb
frontend/src/components/RecentTransactions.tsx        (new)
frontend/src/pages/HistoryPage.tsx
frontend/src/services/api.ts
```

### Testing
- All 10 existing RSpec tests pass
- Verified API returns 5 most recent expenses sorted by date DESC

---

## PR 2: FEATURE-001 — Category Management
**Branch:** `feature/FEATURE-001-category-management`

### Problem
Users could only select from 10 predefined categories. There was no way to create custom categories.

### Changes

#### Backend: Routes, Controller, Model
- **`config/routes.rb`**: Added `POST /api/categories` route
- **`controllers/api/categories_controller.rb`**: New `create` action accepting `{ category: { name } }`, returns created category or validation errors
- **`models/category.rb`**: Added validations — name must be present (max 100 chars) and unique (case-insensitive)

#### Frontend: ExpenseForm, api.ts
- **`ExpenseForm.tsx`**: Added "+ Add new category" link below the category dropdown. Clicking reveals an inline text input + "Add" button. On success the new category appears in the dropdown immediately and is auto-selected
- **`services/api.ts`**: Added `createCategory(name)` function calling `POST /api/categories`

#### Bug Fix Included: Date Filter in Expenses Controller
- The `expenses_controller.rb` index action filtered by `created_at` instead of `date`. Fixed to use `where(date: start_date..end_date)`

### Files Changed
```
backend/config/routes.rb
backend/app/controllers/api/categories_controller.rb   (new)
backend/app/controllers/api/expenses_controller.rb      (fix)
backend/app/models/category.rb
frontend/src/services/api.ts
frontend/src/components/ExpenseForm.tsx
frontend/src/components/Sidebar.tsx
frontend/src/pages/HistoryPage.tsx
frontend/src/components/CategoryForm.tsx                 (new)
```

### Testing
- All 10 existing RSpec tests pass
- TypeScript `tsc --noEmit` passes cleanly

---

## PR 3: BONUS-001 — Future Date Validation + Recent Transactions
**Branch:** `bonus/BONUS-001-future-date-validation`

### Problem
Users could create expenses with future dates, which is illogical for expense tracking. The date picker had no upper-bound restriction and no validation error.

### Changes

#### Backend Validation: `app/models/expense.rb`
- Added custom validation `date_not_in_future` — if `date > Date.current`, adds error "cannot be in the future"
- New model spec with 3 test cases: past date (valid), today (valid), future date (invalid)

#### Frontend Form Validation: `hooks/useExpenseForm.ts`
- Added future date check in `validateForm()` — compares `formData.date` against end-of-today
- Error message: "Future dates are not allowed"

#### Frontend Date Picker: `ExpenseForm.tsx`
- Added `max={todayStr}` attribute to the date `<input>`, preventing browser date picker from selecting future dates
- Added popup modal when future date is submitted — shows "Invalid Date" with explanation and an OK button

#### Docker & Performance
- Removed `./backend:/rails` volume mount from `docker-compose.yml` — pre-bundled gems from the image are used, eliminating gem re-install on every restart
- Removed `db:seed` from auto-startup command — seed inserts 4,350+ records and delays server start by ~2 minutes. Run manually via `docker compose exec backend rails db:seed`
- Changed `command` from `rails` to `bundle exec rails` for reliability
- Added `.gitattributes` to force LF line endings for `.rb`, `bin/*`, shell scripts, and Dockerfile (prevents CRLF shebang errors on Windows)

#### Recent Transactions (also on bugfix branch)
- Backend: `GET /api/expenses/recent` endpoint returning latest 5 expenses ordered by date
- Frontend: `RecentTransactions` component (blue gradient card) at top of History page, above the month filter
- Refreshes automatically when a new expense is added

### Files Changed
```
backend/app/models/expense.rb
backend/spec/models/expense_spec.rb
backend/config/routes.rb
backend/app/controllers/api/expenses_controller.rb
backend/.gitattributes                                              (new)
docker-compose.yml
frontend/src/components/ExpenseForm.tsx
frontend/src/hooks/useExpenseForm.ts
frontend/src/components/RecentTransactions.tsx                      (new)
frontend/src/pages/HistoryPage.tsx
frontend/src/services/api.ts
frontend/src/components/CategoryForm.tsx                            (new)
```

### Testing
- 13 RSpec tests (3 new model validation tests + 10 existing) — all pass
- TypeScript `tsc --noEmit` passes cleanly
- Verified API endpoint `GET /api/expenses/recent` returns correct data

---

## Setup Notes

### Quick Start
```powershell
docker compose build
docker compose up -d
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

### Seed Data (optional, slow)
```powershell
docker compose exec backend rails db:seed
```

### Run Backend Tests
```powershell
docker compose exec backend bundle exec rspec
```

### Rebuild After Code Changes
Since the backend volume mount was removed for performance, rebuild the image after any backend change:
```powershell
docker compose build backend
docker compose up -d --no-deps backend
```
