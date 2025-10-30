# TrackBuddy - Project Management & Issue Tracking

A modern, full-stack project management and issue tracking application built with Next.js, TypeScript, Prisma, and NextAuth.js.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sambhavnrana/issue-tracker
cd trackbuddy
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory by renaming `.env.sample`:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/trackbuddy"

# NextAuth.js
AUTH_SECRET="your-secret-key-here"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

### 5. Database Setup

1. Create a MySQL database named `trackbuddy`
2. Run the database migrations:

```bash
npx prisma migrate dev
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 How to Use

### Getting Started with TrackBuddy

#### 1. **Authentication**

- Visit the application and click "Log In" in the top right corner
- Sign in with your Google account
- You'll be redirected to the dashboard after successful authentication

#### 2. **Creating Your First Organization**

- From the dashboard, click on "Organizations" in the navigation
- Click the "+ New Organization" button
- Fill in the organization name and add team members (optional)
- Click "Create Organization"

#### 3. **Setting Up Projects**

- Navigate to your organization page
- Click "+ New Project" to create your first project
- Provide a project name and description

#### 4. **Managing Issues**

- Go to the "Issues" section from the navigation
- Click "+ New Issue" to create your first issue
- Fill in the issue details:
  - **Title**: Clear, descriptive title
  - **Description**: Detailed description of the issue
  - **Organization**: Select the relevant organization
  - **Project**: Choose the project this issue belongs to
  - **Status**: Set initial status (Open, In Progress, Closed)

#### 5. **Tracking Progress**

- **Dashboard**: View overview of all your issues with charts and statistics
- **Issue List**: See all issues with filtering and sorting options
- **Individual Issues**: Click on any issue to view details and update status

### Key Features Walkthrough

#### **Dashboard Overview**

- **Issue Summary Cards**: Quick view of Open, In Progress, and Closed issues
- **Issue Chart**: Visual representation of issue distribution
- **Latest Issues**: Recent activity feed
- **Quick Actions**: Direct links to create new issues or organizations

#### **Organization Management**

- **My Organizations**: Organizations you've created
- **Assigned Organizations**: Organizations you're a member of
- **Project Management**: Create and manage projects within organizations
- **Member Management**: Add/remove team members with specific roles

#### **Issue Management**

- **Status Tracking**: Update issue status (Open → In Progress → Closed)
- **Filtering**: Filter by status, project, or organization
- **Sorting**: Sort by title, status, or creation date
- **Search**: Find specific issues quickly

#### **Project Overview**

- **Project Dashboard**: View project-specific statistics
- **Issue List**: See all issues within a project
- **Team Management**: Manage project members and roles
- **Project Settings**: Edit project details and description

### Best Practices

#### **Organization Structure**

- Create separate organizations for different companies/clients
- Use projects to organize work by features, sprints, or teams
- Assign appropriate roles to team members

#### **Issue Management**

- Use clear, descriptive titles for issues
- Provide detailed descriptions with context
- Update status regularly to keep track of progress
- Assign issues to appropriate team members

#### **Team Collaboration**

- Invite team members to organizations and projects
- Use appropriate roles for different team members
- Keep issue descriptions and updates clear for team visibility

### Navigation Guide

- **Dashboard** (`/dashboard`): Overview of all your issues and organizations
- **Issues** (`/issues/list`): View and manage all issues
- **Organizations** (`/organizations`): Manage your organizations and projects
- **New Issue** (`/issues/new`): Create a new issue
- **New Organization** (`/organizations/new`): Create a new organization

## 📁 Project Structure

```
trackbuddy/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── issues/        # Issue management endpoints
│   │   ├── organizations/ # Organization endpoints
│   │   └── projects/      # Project endpoints
│   ├── auth/              # Authentication configuration
│   ├── components/        # Reusable UI components
│   ├── dashboard/         # Dashboard pages
│   ├── issues/            # Issue management pages
│   ├── organizations/     # Organization pages
│   └── lib/               # Utility functions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── middleware.ts          # Next.js middleware
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client

## 🗄️ Database Schema

The application uses a hierarchical structure:

- **Organizations** → **Projects** → **Issues**
- **Users** can belong to multiple organizations
- **Project Members** have specific roles per project
- **Issues** are always associated with a project

### Key Models:

- `User` - Application users
- `Organization` - Top-level entities
- `Project` - Projects within organizations
- `Issue` - Issues within projects
- `ProjectMember` - User-project relationships with roles
- `OrganizationMember` - User-organization relationships

## 🔐 Authentication & Authorization

- **Google OAuth** for user authentication
- **JWT sessions** for secure session management
- **Role-based access control** at the project level
- **Organization-level permissions** for creators and members

### Styling

- All components use TailwindCSS for consistent styling
- Custom components are located in `app/components/`
- Global styles are in `app/globals.css`
- Has custom brand color palette defined in `tailwind.config.ts`:

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
