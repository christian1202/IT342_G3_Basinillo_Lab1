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
  <a href="https://your-demo-url.vercel.app">
    <img src="https://img.shields.io/badge/View_Demo-2EA44F?style=for-the-badge&logo=vercel&logoColor=white" alt="View Demo" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/yourusername/portkey/issues">
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

| Domain       | Technology                  | Description                                                     |
| :----------- | :-------------------------- | :-------------------------------------------------------------- |
| **Frontend** | **Next.js 14** (App Router) | React Framework for Production, utilizing Server Components.    |
|              | **TypeScript**              | Strict static typing for robust, maintainable code.             |
|              | **Tailwind CSS**            | Utility-first CSS framework for rapid UI development.           |
|              | **Lucide React**            | Beautiful, consistent icon library.                             |
| **Backend**  | **Supabase**                | Open Source Firebase alternative (PostgreSQL + Auth + Storage). |
|              | **PostgreSQL**              | Powering the relational data model.                             |
| **Tools**    | **React Hook Form**         | Performant, flexible forms with easy validation.                |
|              | **Zod**                     | TypeScript-first schema validation for forms and API data.      |
|              | **Vercel**                  | Zero-configuration deployment platform.                         |

### Database Schema (`public.shipments`)

| Column Name        | Type          | Description                                                                                   |
| :----------------- | :------------ | :-------------------------------------------------------------------------------------------- |
| `id`               | `UUID`        | Primary Key, default `gen_random_uuid()`                                                      |
| `user_id`          | `UUID`        | Foreign Key to `auth.users`, ensures ownership                                                |
| `bl_number`        | `TEXT`        | Unique Bill of Lading Number                                                                  |
| `vessel_name`      | `TEXT`        | Name of the carrying vessel                                                                   |
| `container_number` | `TEXT`        | ID of the shipping container                                                                  |
| `arrival_date`     | `TIMESTAMPTZ` | Estimated Time of Arrival (ETA)                                                               |
| `status`           | `ENUM`        | Lifecycle state (`PENDING`, `IN_TRANSIT`, `ARRIVED`, `CUSTOMS_HOLD`, `RELEASED`, `DELIVERED`) |
| `created_at`       | `TIMESTAMPTZ` | Record creation timestamp                                                                     |

### Folder Structure

```ascii
/web
├── app/                  # Next.js App Router
│   ├── dashboard/        # Protected Dashboard route
│   ├── login/            # Authentication pages
│   ├── shipments/        # CRUD Shipment views
│   └── page.tsx          # Landing Page
├── components/           # Reusable UI Components
│   ├── dashboard/        # Dashboard-specific widgets
│   ├── layout/           # Sidebar, Navbar, Application Shell
│   ├── shipments/        # ShipmentCard, ShipmentList, ShipmentForm
│   └── ui/               # Atoms: Button, Input, Modal, Skeleton
├── lib/                  # Utilities & Configuration
│   └── supabase.ts       # Supabase Client configuration
├── services/             # Data Access Layer (API calls)
├── types/                # TypeScript Interfaces & Zod Schemas
└── middleware.ts         # Route protection middleware
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js** (v18.17.0 or wider)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/portkey.git
   cd portkey/web
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root of the `web` directory and add your Supabase credentials:

   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛣️ Roadmap / Future Improvements

- [ ] **Dark Mode Support**: Full theme toggling for comprehensive accessibility.
- [ ] **Document Export**: Ability to export shipment lists to CSV or PDF.
- [ ] **Email Notifications**: Automated alerts for status changes (e.g., when a shipment arrives).
- [ ] **Map Integration**: Visualizing vessel locations on an interactive world map.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Built with ❤️ by Christian Jay Basinillo</p>
