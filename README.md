# CEL Developer Documentation Platform

This is a Next.js application generated with [Create Fumadocs](https://github.com/fuma-nama/fumadocs) and enhanced with AI-powered features for comprehensive documentation and user management.

## 🚀 Quick Start

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## 🏗️ Architecture Overview

This platform combines modern web technologies with AI-enhanced documentation generation:

### Core Technologies
- **Next.js 15.1.2** - React framework with App Router
- **Fumadocs** - Documentation framework with MDX support
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **File-based Storage** - Development data persistence

### AI Integration
- **Content Generation** - AI-powered documentation creation
- **Architecture Analysis** - Automated system documentation
- **Code Documentation** - Intelligent code commenting and explanations

## 📚 Documentation Generation Rules

### AI-Generated Content Guidelines

#### 1. **Content Structure**
- Use semantic headings (H1-H6) for proper hierarchy
- Include code examples with syntax highlighting
- Provide real-world use cases and scenarios
- Add interactive elements where appropriate

#### 2. **Documentation Types**
- **API Documentation** - Auto-generated from code annotations
- **User Guides** - Step-by-step tutorials with screenshots
- **Architecture Docs** - System design and component relationships
- **Best Practices** - Industry standards and recommendations

#### 3. **AI Content Quality Standards**
- **Accuracy** - Verify technical information against source code
- **Clarity** - Use simple, understandable language
- **Completeness** - Cover all necessary aspects of the topic
- **Consistency** - Maintain uniform style and terminology

## 🏛️ System Architecture

### Application Layers

```
┌─────────────────────────────────────────────────┐
│                 Presentation Layer               │
├─────────────────────────────────────────────────┤
│  Next.js App Router  │  Fumadocs UI Components  │
├─────────────────────────────────────────────────┤
│                 Business Logic Layer            │
├─────────────────────────────────────────────────┤
│  Authentication     │  User Management         │
│  Content Generation │  Database Operations      │
├─────────────────────────────────────────────────┤
│                 Data Layer                      │
├─────────────────────────────────────────────────┤
│  File Storage       │  MDX Content            │
│  JSON Database      │  Static Assets           │
└─────────────────────────────────────────────────┘
```

### Key Components

#### Frontend Architecture
- **Layout System** - Responsive design with navigation
- **Component Library** - Reusable UI components
- **State Management** - React hooks and context
- **Route Protection** - Authentication guards

#### Backend Architecture
- **API Routes** - RESTful endpoints for data operations
- **Authentication** - JWT-based session management
- **File System** - JSON-based data persistence
- **Middleware** - Request processing and validation

## 🔐 Authentication & Authorization

### User Roles
- **Admin** - Full system access and user management
- **Member** - Documentation access and contribution
- **Customer** - Limited access to public documentation

### Security Features
- **JWT Tokens** - Secure session management
- **OTP Verification** - Email-based two-factor authentication
- **Role-based Access** - Granular permission control
- **Secure Cookies** - HTTP-only cookie storage

## 📖 Features

### Documentation Management
- **Live Preview** - Real-time MDX rendering
- **Version Control** - Git-based content management
- **Search Integration** - Full-text search capabilities
- **Navigation** - Auto-generated table of contents

### User Management
- **Admin Dashboard** - User CRUD operations
- **Profile Management** - User settings and preferences
- **Activity Tracking** - Login and access logs
- **Bulk Operations** - Batch user management

### AI-Enhanced Features
- **Auto-Documentation** - Generate docs from code
- **Content Suggestions** - AI-powered writing assistance
- **Architecture Visualization** - System diagram generation
- **Code Analysis** - Automated code review and documentation

## 🛠️ Development Guidelines

### Code Organization
```
/app                 # Next.js App Router pages
/components          # Reusable React components
/lib                 # Utility functions and services
/content             # MDX documentation files
/public              # Static assets
/.storage            # Development data (gitignored)
```

### AI Content Creation Rules

#### Documentation Standards
1. **Semantic Structure** - Use proper heading hierarchy
2. **Code Examples** - Include working code snippets
3. **Visual Aids** - Add diagrams and screenshots
4. **Cross-references** - Link related documentation
5. **Version Tags** - Mark content with version information

#### Quality Assurance
1. **Technical Review** - Validate against implementation
2. **User Testing** - Ensure clarity and usability
3. **Accessibility** - Follow WCAG guidelines
4. **Performance** - Optimize for fast loading
5. **SEO Optimization** - Include proper metadata

## 🚀 Deployment

### Environment Setup
- **Development** - Local file storage and hot reload
- **Staging** - Vercel preview deployments
- **Production** - Edge Config and optimized builds

### CI/CD Pipeline
- **Code Quality** - ESLint and TypeScript checks
- **Testing** - Unit and integration tests
- **Documentation** - Auto-generated API docs
- **Deployment** - Automated Vercel deployments

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs
