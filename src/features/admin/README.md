# Admin Feature Module

This module provides the back-office administration clients, actions, and security systems to manage inquiries, products, blogs, SEO metadata, media assets, activity logs, and email templates.

## Structure

- **components/**: Admin view interfaces
  - `SettingsClient.js`: Control panel for company hours, locations, contacts, and emails
  - `SeoClient.js`: Custom SEO page title and meta descriptions editor
  - `UsersClient.js`: Admin accounts and authentication control
  - `MediaClient.js`: Image uploader and assets list
  - `LogsClient.js`: Read-only system action logs
  - `EmailTemplatesClient.js`: Customizable notifications template editor
  - `NewsletterClient.js`: Subscriber listings and mass email options
  - `CropModal.js`: Image cropper modal using aspect ratio presets
- **services/**: Next.js server actions managing database mutations
  - `authActions.js`: Secure login, OTP validation, and credentials reset actions
  - `emailTemplatesActions.js`: Email template management actions
  - `mediaActions.js`: File upload and deletion triggers
  - `newsletterActions.js`: Newsletter signups and campaigns execution
  - `seoActions.js`: Metadata save and update triggers
  - `settingsActions.js`: Global config update actions
  - `usersActions.js`: Admin accounts creation and credentials update actions
- **index.js**: Standardized public API barrel file

## Communication Rules

- Direct imports into this feature from other features (except standard shared UI controls) are strictly prohibited.
- Communication with page components must happen via root exports (`@/features/admin`).
- Follows the unidirectional dependency flow standard: Admin View Client Components -> Server Actions (Services) -> MongoDB Schemas.
