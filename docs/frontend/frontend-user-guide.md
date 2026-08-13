# XIRV Systems Frontend User Guide

**Project:** XIRV Systems – Enterprise Intelligence Platform
**Document Version:** 1.0
**Status:** Active
**Last Updated:** August 2026

---

# 1. Purpose

This document serves as a user guide for the XIRV Systems frontend application, explaining how to navigate and use the platform's features.

---

# 2. Getting Started

## Accessing the Application

The application is accessible via the following URLs:

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5173` |
| Staging | `http://xirv-frontend.s3-website-ap-southeast-2.amazonaws.com` |
| Production | Custom domain (planned) |

## System Requirements

* Modern web browser (Chrome, Firefox, Safari, Edge)
* JavaScript enabled
* Internet connection
* Screen resolution of 1024px or wider (recommended)

---

# 3. Navigation

## Sidebar Navigation

The sidebar provides access to all major sections:

| Section | Description |
|---------|-------------|
| Dashboard | System overview and metrics |
| AI Intelligence | AI chat and RAG queries |
| Knowledge Base | Document management |
| Workflows | Workflow automation |
| Analytics | Usage statistics and reports |
| Settings | User profile and preferences |

## User Menu

Located in the top-right corner:

* User name and role
* Logout option
* Profile access

---

# 4. Dashboard

## Overview

The dashboard provides a high-level view of the platform's status and activity.

### Sections

* **Hero Section**: Welcome message and quick actions
* **System Overview**: Platform status and health
* **Metric Cards**: Key metrics (AI Engine, Knowledge Base, System Health)
* **Quick Actions**: Shortcuts to common tasks
* **Recent Activity**: Recent user actions and events

---

# 5. AI Intelligence

## Overview

The AI Intelligence section provides conversational AI capabilities with document context.

### Features

* **Chat Interface**: Send messages to AI assistants
* **Streaming Responses**: Real-time response streaming
* **Source Attribution**: References to supporting documents
* **Model Selection**: Choose between available AI models
* **Document Context**: Option to include specific documents for context

### Usage

1. Type a message in the chat input.
2. Press Enter or click Send.
3. View the streaming response.
4. Review source citations for verification.

---

# 6. Knowledge Base

## Overview

The Knowledge Base provides document management and organization features.

### Features

* **Document Upload**: Upload files to the knowledge base
* **Document List**: Browse and search documents
* **Categories**: Organize documents by category
* **Tags**: Apply flexible tags to documents
* **Document Status**: Draft, Published, Archived
* **Document Search**: Search by title, description, or content

### Document Upload Process

1. Click "Upload Document".
2. Enter title and description.
3. Select a file to upload.
4. Choose a category (optional).
5. Add tags (optional).
6. Click Upload.

### Document Management

* **View**: Click on a document to view details
* **Edit**: Update title, description, or category
* **Status**: Change document status (Draft → Published → Archived)
* **Delete**: Remove document from the system

---

# 7. Workflows

## Overview

The Workflows section provides workflow automation capabilities.

### Features

* **Workflow List**: View and manage workflows
* **Create Workflow**: Build new workflows
* **Workflow Execution**: Execute active workflows
* **Task Board**: Manage workflow tasks
* **Approvals**: Review and process approvals

### Workflow States

| State | Description |
|-------|-------------|
| Draft | Workflow is being created or edited |
| Active | Workflow is ready for execution |
| Paused | Workflow is temporarily disabled |
| Archived | Workflow is no longer in use |

### Creating a Workflow

1. Click "+ Create Workflow".
2. Enter a name and description.
3. Select trigger type (Manual, Scheduled, Event, Webhook).
4. Define the workflow steps using JSON.
5. Click Create.

### Executing a Workflow

1. Navigate to the workflow detail page.
2. Click "Execute".
3. Confirm execution.
4. View the execution history.

### Task Management

* **View Tasks**: Access the Task Board
* **Update Status**: Start, Complete, or Cancel tasks
* **Review Approvals**: Approve or reject approval requests

---

# 8. Analytics

## Overview

The Analytics section provides data visualization and reporting.

### Features

* **Dashboard Charts**: Visual representation of metrics
* **Usage Statistics**: Platform usage data
* **Document Analytics**: Document creation and activity
* **AI Analytics**: AI usage and performance

### Metrics Available

| Metric | Description |
|--------|-------------|
| Total Users | Registered users |
| Total Documents | Documents in the knowledge base |
| AI Requests | Number of AI queries |
| Workflow Executions | Workflow runs |
| Active Sessions | Concurrent users |

---

# 9. Settings

## Overview

The Settings section allows users to manage their account.

### Features

* **Profile**: View and edit user information
* **Password Change**: Update account password
* **Account Management**: Delete account (with confirmation)

### Profile Management

* Update first name and last name
* Change email address
* View role information

### Password Security

* Current password required for changes
* Strong password guidelines
* Confirmation before saving

---

# 10. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Quick navigation (planned) |
| `Enter` | Submit forms |
| `Esc` | Close modals |
| `Ctrl + Enter` | Send AI message |

---

# 11. Troubleshooting

## Common Issues

### Can't Log In

* Verify email and password.
* Check caps lock.
* Use "Forgot Password" if needed.

### Document Upload Fails

* Check file size limits.
* Verify file format support.
* Ensure network connectivity.

### Workflow Not Executing

* Verify workflow is Active.
* Check for missing dependencies.
* Review execution logs.

### AI Not Responding

* Verify API connectivity.
* Check model availability.
* Ensure proper authentication.

---

# 12. Support

## Help Resources

* API Documentation: `/api/docs`
* GitHub Repository: `github.com/Xhenzouu/xirv-systems`
* Portfolio: `hensonbrix-portfolio.vercel.app`

## Contact

For support or questions, please contact the development team through GitHub issues or the provided email.

---

# 13. Summary

The XIRV Systems frontend provides a comprehensive interface for managing knowledge, AI interactions, and workflow automation. This guide covers the essential features and common use cases for the platform.