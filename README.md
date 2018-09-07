# ESLint
Yoast configuration for ESLint

[Configuring Rules](https://eslint.org/docs/user-guide/configuring#configuring-rules)

* 0 - turn the rule off
* 1 - turn the rule on as a warning (doesn’t affect exit code)
* 2 - turn the rule on as an error (exit code is 1 when triggered)


## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

### [Unreleased] -

### 3.1 - 2018-08-28

#### Added

* Adds warning when JSDoc is missing on all symbols.
* Adds warnings for JSX that make sense for our codestyle.
* Adds `keyword-spacing` rule as a warning.
* Adds warning for `no-shadow` rule.
* Adds warning for `prefer-const` rule.

#### Changed

* Bumps `ecmaVersion` up to 2018 so the parser doesn't error when it encounters newer syntax.
