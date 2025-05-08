# Amazon Data Analytics Platform

A full-stack application for data visualization and manipulation using Next.js, .NET, and Azure SQL Server.

## Project Structure

```
.
├── frontend/          # Next.js frontend application
└── backend/          # .NET backend API
```

## Prerequisites

- Node.js 18+ 
- .NET 8 SDK
- Azure SQL Server instance
- Azure account (for SQL Server)

## Setup Instructions

### Backend (.NET)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update the connection string in `appsettings.json` with your Azure SQL Server credentials

4. Run the application:
```bash
dotnet run
```

### Frontend (Next.js)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
```

## Features

- Data visualization using Chart.js
- CRUD operations for data management
- Real-time data updates
- Secure authentication
- Responsive design

## Tech Stack

- Frontend:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Chart.js
  - React Query

- Backend:
  - .NET 8
  - Entity Framework Core
  - Azure SQL Server
  - JWT Authentication

## License

MIT
