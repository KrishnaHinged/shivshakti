# CRM Feature Module

This module manages client lead retrieval, inquiry management, automatic email notifications, and customer relationship logging.

## Structure

- **components/**: Admin view interfaces
  - `InquiriesClient.js`: Unified data table showing names, numbers, email inquiries, and custom color configurations with pagination, status updates, and logging fields
- **repositories/**: Data access layer
  - `inquiry.repository.js`: MongoDB data layer handling creation, retrieval, and status updates for inquiries
- **services/**: CRM business actions
  - `actions.js`: Server actions managing inquiry creation, status modifications (New, Contacted, Completed), and email updates
- **index.js**: Standardized public API barrel file

## Unidirectional Dependency Rules

- Direct imports into this feature from other features are not permitted.
- The `ProductInquiryForm` imports `{ createInquiryAction }` exclusively via the public CRM barrel `@/features/crm`.
