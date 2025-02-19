# Playwright & TypeScript E2E Testing Framework

## Introduction

This repository contains end-to-end (E2E) and API tests using **Playwright** and **TypeScript**.

For more information, check the official documentation:

- **[Node.js](https://nodejs.org/en/)** (Ensure Node.js 20+ is installed)
- **[Playwright](https://playwright.dev/)** (E2E testing framework)
- **[Typescript](https://www.typescriptlang.org/docs/)** (Typescript documentation)

---

## Getting Started

To set up this project, follow these steps:

1. **Install Node.js**
2. **Clone this repository:**
   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## Running Tests And Report

**Run All Tests**

```bash
 npm run test
```

**Run UI(E2E) Tests Only**

```bash
 npm run test:ui
```

**Run API Tests Only**

```bash
 npm run test:api
```

**Generate & View HTML Report**

```bash
 npx playwright show-report
```

## Writing Tests

### Locators

- Use the [documentation](https://playwright.dev/docs/locators) provided by Playwright for best practice
- Exception: Due to the nature of the Chatbot and Shadow DOM, CSS selectors are used where required

## Repository organization

### Tests

- All tests are located in the [tests](./tests) folder
- [UI tests](./tests/ui) → Contains end-to-end UI automation tests
- [API Tests](./tests/api) → Contains API test cases
- Use descriptive test names that clearly convey their business value

### Page Object Model

- An explanation over the Page Object Model can be found [here](https://playwright.dev/docs/pom)
- All page classes are added to [pages](./pages) folder
- When adding a new page, make sure to add it into ./fixtures/pages.ts, which also helps to maintain and read tests easily
- Each page should have a dedicated file, e.g., chatbot.page.ts.

### Other files

- Helpers can be found in the [utils](./utils) folder. Containing reusable helper functions for date handling, API requests, random test data, etc.
- Test data is found in the [test-data](./test-data) folder
- Types are declared in [types](./types)

## Continuous Integration (CI/CD)

- For integrating with CI/CD pipelines, refer to Playwright’s documentation [here](https://playwright.dev/docs/ci-intro)
