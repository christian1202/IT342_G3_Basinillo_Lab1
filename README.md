# Portkey ⛴️

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

<div align="center">
  <img src="./public/screenshot.png" alt="Dashboard Screenshot" width="800" />
  <p><em>(Place your screenshot in <code>public/screenshot.png</code>)</em></p>
</div>

<div align="center">
  <a href="https://it-342-g3-basinillo-lab1.vercel.app/">
    <img src="https://img.shields.io/badge/View_Demo-2EA44F?style=for-the-badge&logo=vercel&logoColor=white" alt="View Demo" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/christian1202/IT342_G3_Basinillo_Lab1/issues">
    <img src="https://img.shields.io/badge/Report_Bug-CB2431?style=for-the-badge&logo=github&logoColor=white" alt="Report Bug" />
  </a>
</div>

---

## 📖 About the Project

**Portkey** is a modern logistics management platform designed to streamline shipment tracking and provide real-time visibility into your supply chain.
It replaces outdated legacy systems with a secure, responsive dashboard that empowers users to manage their cargo consignments effortlessly from anywhere in the world.

## ✨ Key Features

- **🔐 Next-Gen Authentication**: Secure, middleware-protected routes using Supabase Auth (supports Email/Password & OAuth).
- **🛡️ Row Level Security (RLS)**: Data sovereignty is enforced at the database layer — users can strictly access only their own shipment records.
- **⚡ Optimistic UI**: Instant feedback on interactions (creating, editing, deleting) ensures the application feels snappy and responsive.
- **📱 Responsive Mobile Design**: Fully optimized layout that adapts seamlessly from desktop dashboards to mobile devices.
- **📊 Real-time Metrics**: Dynamic dashboard widgets that calculate and display shipment statuses (In-Transit, Delivered, Pending) on the fly.
- **🔎 Global Search & Filtering**: (Planned) Quickly locate any shipment by Bill of Lading, Container Number, or Status.

## 🏗️ Technical Architecture

### Tech Stack

| Domain          | Technology          | Details                                                            |
| :-------------- | :------------------ | :----------------------------------------------------------------- |
| **Frontend**    | **Next.js 14**      | App Router, Server Components, Server Actions (future-proof)       |
|                 | **TypeScript**      | Strict type safety for both UI and API interactions                |
|                 | **Tailwind CSS**    | Utility-first styling with responsive design & dark mode readiness |
|                 | **Lucide React**    | Consistent, lightweight SVG iconography                            |
| **State/Forms** | **React Hook Form** | Performant usage of uncontrolled inputs                            |
|                 | **Zod**             | Schema validation for forms and API responses                      |
|                 | **Custom Hooks**    | Encapsulated logic for data fetching (`useShipments`)              |
| **Backend**     | **Spring Boot 3**   | Java framework for building production-grade capabilities          |
|                 | **Spring Data JPA** | Abstraction layer for database interactions                        |
|                 | **Spring Web**      | RESTful web service creation                                       |
|                 | **Maven**           | Dependency management and build lifecycle                          |
| **Database**    | **Supabase**        | Managed Backend-as-a-Service (PostgreSQL + Auth)                   |
|                 | **PostgreSQL**      | Relational database with Row Level Security (RLS) policies         |
| **DevOps**      | **Vercel**          | Frontend deployment & CI/CD                                        |

### Database Schema

#### 1. `shipments` Table

Core entity tracking cargo movements.

| Column             | Type          | Default              | Description                                                                 |
| :----------------- | :------------ | :------------------- | :-------------------------------------------------------------------------- |
| `id`               | `UUID`        | `gen_random_uuid()`  | Primary Key                                                                 |
| `user_id`          | `UUID`        | (FK -> `auth.users`) | Owner of the shipment                                                       |
| `bl_number`        | `TEXT`        |                      | **Unique** Bill of Lading Number                                            |
| `vessel_name`      | `TEXT`        |                      | Name of the vessel                                                          |
| `container_number` | `TEXT`        |                      | Container ID                                                                |
| `arrival_date`     | `TIMESTAMPTZ` |                      | Estimated Time of Arrival                                                   |
| `status`           | `ENUM`        | `'PENDING'`          | `PENDING`, `IN_TRANSIT`, `ARRIVED`, `CUSTOMS_HOLD`, `RELEASED`, `DELIVERED` |
| `created_at`       | `TIMESTAMPTZ` | `now()`              | Timestamp of creation                                                       |

#### 2. `shipment_documents` Table

Stores metadata for files attached to shipments.

| Column          | Type          | Default                | Description                                    |
| :-------------- | :------------ | :--------------------- | :--------------------------------------------- |
| `id`            | `UUID`        | `gen_random_uuid()`    | Primary Key                                    |
| `shipment_id`   | `UUID`        | (FK -> `shipments.id`) | Links to parent shipment (`ON DELETE CASCADE`) |
| `document_type` | `TEXT`        |                        | e.g., `INVOICE`, `PACKING_LIST`                |
| `file_url`      | `TEXT`        |                        | Supabase Storage URL                           |
| `uploaded_at`   | `TIMESTAMPTZ` | `now()`                | Upload timestamp                               |

### Folder Structure

```ascii
.
├── backend/
│   └── basinillo/                # Spring Boot Backend
│       ├── src/main/java/.../basinillo
│       │   ├── config/           # Security & App Config
│       │   ├── controller/       # REST Controllers (Endpoints)
│       │   ├── dto/              # Data Transfer Objects
│       │   ├── entity/           # JPA Entities (DB Models)
│       │   ├── repository/       # Data Access Interfaces
│       │   └── service/          # Business Logic Layer
│       └── pom.xml               # Maven Dependencies
├── web/                          # Next.js Frontend
│   ├── app/                      # App Router URLs
│   │   ├── dashboard/            # Protected User Dashboard
│   │   ├── login/                # Auth Pages
│   │   └── shipments/            # Shipment Management Views
│   ├── components/
│   │   ├── dashboard/            # Metrics & Widgets
│   │   ├── layout/               # Sidebar, Header, Shell
│   │   ├── shipments/            # Card, List, Form Components
│   │   └── ui/                   # Reusable UI Library
│   ├── hooks/                    # Custom React Hooks (useShipments)
│   ├── lib/                      # Supabase Client setup
│   ├── services/                 # Frontend API Services
│   ├── types/                    # Shared TypeScript Interfaces
│   ├── middleware.ts             # Auth Protection Middleware
│   └── proxy.ts                  # Server-Side Token Management
└── README.md                     # Project Documentation
```

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js** (v18.17.0 or wider) & **npm/pnpm** (for Web App)
- **Java JDK 17+** & **Maven** (for Backend API)
- **Supabase Account** (for Database & Auth)

### 1. Web App (Frontend)

The frontend is a Next.js application located in the `web` directory.

1. **Navigate to the web directory**

   ```bash
   cd web
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the `web/` directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 2. Backend Service (Spring Boot)

The backend is a Spring Boot application located in `backend/basinillo`, utilizing Maven.

1. **Navigate to the backend directory**

   ```bash
   cd backend/basinillo
   ```

2. **Configure Database Connection**
   Ensure `src/main/resources/application.properties` has your Supabase connection string:

   ```properties
   spring.datasource.url=jdbc:postgresql://<SUPABASE_HOST>:6543/postgres
   spring.datasource.username=<DB_USER>
   spring.datasource.password=<DB_PASSWORD>
   ```

3. **Build and Run**
   ```bash
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

## 🔌 API Endpoints

The Spring Boot backend exposes the following RESTful endpoints for shipment management:

| Method | Endpoint              | Description                   | Payloads / Params                             |
| :----- | :-------------------- | :---------------------------- | :-------------------------------------------- |
| `POST` | `/api/shipments`      | Create a new shipment         | Body: `{ userId, blNumber, vesselName, ... }` |
| `GET`  | `/api/shipments`      | List all shipments for a user | Query: `?userId=<UUID>`                       |
| `GET`  | `/api/shipments/{id}` | Get a single shipment details | Path: `id` (UUID)                             |

## 🛣️ Roadmap / Future Improvements

- [ ] **Dark Mode Support**: Full theme toggling for comprehensive accessibility.
- [ ] **Document Export**: Ability to export shipment lists to CSV or PDF.
- [ ] **Email Notifications**: Automated alerts for status changes (e.g., when a shipment arrives).
- [ ] **Map Integration**: Visualizing vessel locations on an interactive world map.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Built with ❤️ by Christian Jay Basinillo</p>
