# Changelog

All notable changes to this project will be documented in this file.

## [0.0.25] - 2025-11-15
### Fixed
- Ensure CLI-loaded schemas share the same Zod registry so foreign keys and table metadata persist, restoring relationship output in generated D2 diagrams.

### Added
- CLI unit test covering relationship parsing/mapping to guard against regressions.

---

## [0.0.24] - 2025-11-11
### Changed
- Switched publish workflow to use npm OIDC Trusted Publisher (provenance) for secure automated releases.
- Added npm version badge to README.
- Improved CI workflow and release automation.

### Added
- Extension methods: `parseProperties` and `parseRelationships` for Zod schemas.
- Tests for new extension methods.

### Fixed
- Various test and workflow reliability improvements.

---

## [0.0.23] - 2025-11-09
### Changed
- Automated release workflow using tag triggers and NPM_TOKEN (deprecated in 0.0.24).
- Minor bug fixes and documentation updates.

---

## [0.0.22] - 2025-11-09
### Added
- Initial implementation of `getTableName` and `getPrimaryKey` parser utilities.
- Unit tests for new parser functions.
- CI pipeline and integration tests for exports.

---

## [Unreleased]
### Added
- ...
### Changed
- ...
### Fixed
- ...
