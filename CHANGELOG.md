# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-31

### Added

- Initial release
- Full TypeScript client for Emporia Vue API
- Authentication via AWS Cognito (username/password and token-based)
- Device management (list devices, get status, update channels)
- Energy usage data retrieval (real-time and historical)
- Smart outlet and EV charger control
- Electric vehicle status monitoring
- Persistent token storage (file-based and in-memory providers)
- Custom token storage provider interface
- Automatic token refresh
- Retry logic with exponential backoff for API resilience
- Comprehensive error types (AuthenticationError, ApiError, NetworkError, TimeoutError)
- Simulator mode for testing
