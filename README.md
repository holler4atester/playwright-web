// Playwright Typescript test framework to demonstrate e2e test for Get Gas Plan scenario

## Project Reflections + Personal comments



### Development workflow used to build the project: 
1. install playwright, using pnpm 
2. generate user journey using codegen
3. modify codegen steps for verifying pdf (to avoid interacting with native browser's pdf viewer)
4. download PDF using playwright's request, and the PDF url
5. save the PDF to filesystem with path: 'tests/e2e/downloads/'
6. update the locators for better stability
7. create page objects - base page + pricing page
8. create fixture for page objects (to avoid instantiating each page in each test file)
9. add helper for pdf/downloads
