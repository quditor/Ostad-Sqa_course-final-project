# OrangeHRM Test Automation Project

UI automation (Playwright), API tests (Postman / Newman) and manual test cases.

The UI automation and the manual test cases target the public OrangeHRM demo site
(https://opensource-demo.orangehrmlive.com). The API tests (Part D) are a separate task: a Postman
collection that is independent of the OrangeHRM UI tests.

## 1. Project overview

| Part | What it contains | Folder |
|---|---|---|
| Part A: UI automation | 4 end-to-end scenarios written with Playwright and the Page Object Model | `tests/`, `pageObjects/` |
| Part B: Manual test cases | Written manual test cases for the same application | `manual-tests/` |
| Part C: GitHub workflow | Public repository with all automation code, the manual test case sheet and the saved reports, built up through step-by-step commits | whole repository, reports in `reports/` |
| Part D: API tests | Separate task: Postman collection executed from the command line with Newman | `api-tests/` |

### UI scenarios

| # | Scenario | Spec file |
|---|---|---|
| 1 | Login with an invalid username/password and verify the error message | `tests/InvalidLogin.spec.js` |
| 2 | Login, PIM, add a new employee (random name from test data + random id), search it by Employee Id, logout | `tests/Addemployee.spec.js` |
| 3 | Login, Admin, search a user, edit role/status, save, refresh and verify the change persisted | `tests/Adminusermanagement.spec.js` |
| 4 | Login, Leave, apply leave with specific dates, verify "Pending Approval" in My Leave, cancel it, verify "Cancelled" | `tests/Leavemanagement.spec.js` |

Each scenario logs in by itself, so every scenario can run alone or together with the others, in any order.

**Scenarios 3 (Admin) and 4 (Leave) need test data that is created by hand on the demo site first. See section 5.**

## 2. Tech stack

- Node.js (18 or newer) and JavaScript (CommonJS)
- [Playwright Test](https://playwright.dev) for UI tests
- Page Object Model with a `POManager` class
- JSON test data (`utils/orangeHrmTestData.json`)
- Playwright HTML report and Allure report for UI results
- Postman + [Newman](https://github.com/postmanlabs/newman) (with the `htmlextra` reporter) for API tests
- GitHub Actions for CI (`.github/workflows/playwright.yml`)

## 3. Project structure

```
.
├── pageObjects/            Page object classes + POManager
├── tests/                  4 UI spec files
├── utils/                  orangeHrmTestData.json (test data)
├── api-tests/              Postman collection for the API task (and environment file, if any)
├── manual-tests/           Manual test case document(s)
├── playwright.config.js
├── package.json
└── README.md
```

## 4. Setup

Prerequisites: Node.js 18+, Git, and Java 8+ only if you want to open the Allure report (check with `java -version`).

```bash
git clone https://github.com/quditor/Ostad-Sqa_course-final-project.git
cd Ostad-Sqa_course-final-project
npm install
npx playwright install
```

## 5. Test data prerequisites (check before running)

The OrangeHRM demo site is public and **resets itself automatically from time to time**. A reset deletes
data that was created by hand. Two UI scenarios depend on such data, so **check it manually before
running them, and create it with the steps below if it is missing.**

Scenarios 1 (invalid login) and 2 (add employee) create everything they need themselves. The API tests
do not use the OrangeHRM site at all.

| Scenario | What must exist on the site | Value in `utils/orangeHrmTestData.json` |
|---|---|---|
| 3. Admin user management | A user with the username `fuad_855850` | `TARGET_USERNAME` |
| 4. Leave apply and cancel | Leave entitlement (balance) for the leave type `US - Personal` for the employee who logs in, and free weekdays for the dates | `LEAVE_FROM_DATE`, `LEAVE_TO_DATE` |

### 5.1 Admin scenario: create the user `fuad_855850`

1. Log in as `Admin` / `admin123`.
2. Go to **Admin, User Management, Users** and click **Add**.
3. Fill in the form:
   - **User Role:** `ESS` or `Admin`
   - **Employee Name:** start typing and pick an employee from the suggestions
   - **Status:** `Enabled`
   - **Username:** `fuad_855850`
   - **Password** and **Confirm Password:** any password that meets the rules shown on the form
4. Click **Save**.
5. Check it: on the Users page search for the username `fuad_855850`. One record should be found.

The test reads the username from `TARGET_USERNAME`. To use another user, create that user and change the
value in the JSON file. Do not use `Admin` itself. The test switches the user's role and status on every
run, so it can be repeated.

### 5.2 Leave scenario: add a leave entitlement

1. Log in as `Admin` / `admin123`.
2. Go to **Leave, Entitlements, Add Entitlements**.
3. Choose the employee(s):
   - **Individual Employee:** type the name that is shown in the top-right corner after login, or
   - **Multiple Employees:** select the location / sub unit that contains that employee.
4. **Leave Type:** `US - Personal` (this is the type used in `pageObjects/LeavePage.js`; if you use another type, change it there).
5. **Leave Period:** the current period.
6. **Entitlement:** a number with up to two decimals, for example `10.00` (enough for the two days the test applies for).
7. Click **Save** and confirm.
8. Check it: go to **Leave, Apply**, choose `US - Personal`. **Leave Balance** must be more than 0.

The employee who applies for leave is the one linked to the logged-in user (name in the top-right corner).
On a reset demo site this name can change, so repeat the check.

### 5.3 Leave scenario: dates

- Look at the placeholder in the From Date box on the **Leave, Apply** page. It is either `yyyy-mm-dd` or `yyyy-dd-mm`.
  Write `LEAVE_FROM_DATE` and `LEAVE_TO_DATE` in that same order. Example for Monday 12 and Tuesday 13 October 2026:
  - `yyyy-mm-dd`: `"2026-10-12"` and `"2026-10-13"`
  - `yyyy-dd-mm`: `"2026-12-10"` and `"2026-13-10"`
- Use weekdays that have not passed yet. A weekend-only range counts as zero days and cannot be submitted.
- If an earlier run stopped before it cancelled the request, a pending leave may still exist for those dates and the
  site will refuse an overlapping request. Cancel it under **Leave, My Leave**, or choose different dates.

### 5.4 If a scenario fails

| Symptom | Likely cause |
|---|---|
| Admin test fails at the search step | The user `fuad_855850` does not exist (the demo site was reset). Repeat 5.1. |
| Leave test fails after clicking Apply, or no row appears in My Leave | No entitlement or balance is 0 (repeat 5.2), the date format or dates are wrong (5.3), or the leave type name is different. |

## 6. Running the UI tests (Part A)

Before the first run, complete the prerequisites in section 5 (needed for the Admin and Leave scenarios).

Run one scenario:

```bash
npm run test:login       # scenario 1: invalid login
npm run test:employee    # scenario 2: add employee
npm run test:admin       # scenario 3: admin user edit
npm run test:leave       # scenario 4: leave apply and cancel
```

Run all four scenarios one after another in a single suite (one worker, so they run sequentially):

```bash
npm run test:ui
```

Useful options:

```bash
npx playwright test --headed            # watch the browser
npx playwright test --ui                # Playwright UI mode
npx playwright test --debug             # step-by-step debugging
```

## 7. Running the API tests (Part D)

The API tests are a separate task from the OrangeHRM UI scenarios. They are a Postman collection
(`api-tests/OrangeHRM-SQA-API.postman_collection.json`) with its environment file
(`api-tests/batch-18.postman_environment.json`), executed with Newman against the public
[JSONPlaceholder](https://jsonplaceholder.typicode.com) fake REST API. An internet connection is needed.

| # | Request | What it checks |
|---|---|---|
| 1 | `get-all-users` (`GET /users`) | status 200, response is JSON, each user has `id`, `name` and `email` |
| 2 | `Update request` (`PUT /users/6`) | status 200, returned id matches the stored id, phone is not empty |

Run the whole collection:

```bash
npm run test:api
```

Run one request on its own:

```bash
npm run test:api:users      # get-all-users
npm run test:api:update     # Update request
```

JSONPlaceholder accepts update requests but does not save them permanently, so the API tests can be
repeated as often as needed.

You can also import the collection file into the Postman app and run it from there.

## 8. Running everything together (UI, then API)

```bash
npm run test:all
```

This runs the four UI scenarios in sequence and then the API collection. The API run still starts
even if a UI test fails, and both reports are created.

## 9. Reports (generated after every run)

| Suite | Report | Where it is created | How to open |
|---|---|---|---|
| UI | Playwright HTML report | `playwright-report/` (created automatically after every run) | `npm run report:html` |
| UI | Allure report | results in `allure-results/` after every run | `npm run report:allure` (builds `allure-report/` and opens it) |
| API | Newman HTML report | `api-report/api-report.html` (created after every run) | open the file in a browser |

The HTML report is configured with `open: 'never'`, so a run never waits for a report server and the
next command can start straight away.

To start a clean Allure report, delete the old results first:

```bash
npx rimraf allure-results allure-report
```

## 10. Manual test cases (Part B)

Manual test cases are in the [`manual-tests/`](./manual-tests) folder.

## 11. CI

`.github/workflows/playwright.yml` runs the UI tests on every push and uploads the HTML report as a
build artifact (open the run on the Actions tab and download `playwright-report`).

## 12. Notes about the OrangeHRM demo site (UI tests only)

The OrangeHRM demo is a shared public site that resets and changes over time.

- **Prerequisite data:** the Admin and Leave scenarios need data created by hand first (section 5). Because the site resets itself, check this data before every run.
- **Slow responses:** timeouts are increased in `playwright.config.js` because the demo site can be slow.
- **Shared data:** other people use the same demo, so users, employees and leave requests that you did not create may appear. The tests only use the data named in `utils/orangeHrmTestData.json`.
# Ostad-Sqa_course-final-project