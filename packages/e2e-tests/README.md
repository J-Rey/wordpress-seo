# Yoast E2E Tests package

e2e-tests implementation for Yoast SEO plugin.

## Usage

Inside your `wordpress-seo` run the following commands:

```
cd packages/e2e-tests
yarn
```
to install the packages dependencies.

Then the command `yarn test` to run the tests.

All the tests are located in the `specs` folder.

## Configuration

### Headless mode

The default configuration of the packages runs the test in headless mode.
If you want to run in non-headless mode, uncomment the ` // headless: false,` line in `jest.puppeteer.config.js`.

## Slow Motion

If you want to slows down Puppeteer operations by a specified amount of milliseconds,
uncomment the ` // slowMo: 30,` line in `jest.puppeteer.config.js`, and edit the `slowMo` value.