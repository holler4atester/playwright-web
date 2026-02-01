A Playwright Typescript test framework to demonstrate e2e test for Get Gas Plan scenario on Origin Energy web

# Project Set up

```
git clone https://github.com/holler4atester/origin-test.git
cd origin-test
```

# Local set up and test runs

## Pre-requisites: 

```
#Install project dependencies
npm install

# Install playwright's browsers
npm run install:browsers
```

## Run tests on local machine (cmd line): 

```
# run all tests
npm test

# run headed (visible running in browser)
npm run test:headed

# run in UI mode for interactive debugging
npm run test:ui

# run a specific project (eg chromium)
npm run test:chromium
npm run test: webkit
npm run test:firefox

# view report
npm run report

# run tests that last failed
npm run test:failed

# tsc checks
npm run typecheck
```

# Run tests in Docker 
[Ensures tests run in a consistent, isolated environment across all machines]

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed + running on machine

## Run tests in docker

```
# Build docker image
docker build -t playwright-tests .

# Run tests in docker 
docker run --rm --init --ipc=host playwright-tests

```

# Personal/Project Reflections + comments

## TODOs

With more time: 
1. add eslint, prettier, lint-staged, husky
2. update tests to run on more devices/browsers (mobile not supported now)
3. add 'paths' to tsconfig to reduce overhead of import paths
4. add a docker-compose.yml (to simplify docker run scripts above)

## Development workflow used to build the project: 
1. install playwright, set up project
2. generate user journey using codegen
3. modify codegen steps for verifying pdf (to avoid interacting with native browser's pdf viewer)
4. download PDF using playwright's request, and the PDF url
5. save the PDF to filesystem with path: 'tests/e2e/downloads/'
6. update the locators for better stability
7. create page objects - base page + pricing page
8. create fixture for page objects (to avoid instantiating each page in each test file)
9. add helper for pdf/downloads
10. wrap test steps for report / trace readability
11. add docker config (most simple to get up and running)
12. package.json scripts
13. parse pdf, save pdf [simplified test by not parsing from saved version]
