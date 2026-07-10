# NHS HRA & CWT Enterprise Data Warehouse Dashboard

🔗 **Live Production URL:** [https://nhs-dashboard-beta.vercel.app](https://nhs-dashboard-beta.vercel.app)

A modern, high-performance dual-purpose dashboard application built with Next.js, React, and Tailwind CSS. It serves two main functions:
1. **NHS HRA Dashboard**: Operational tracking, capacity planning, and turnaround analysis for health research applications.
2. **CWT Enterprise EDW Showcase**: A premium presentation of an Enterprise Data Warehouse architecture, data pipelines, and business outcomes built for global scale.

## Features

### NHS HRA Operations
* **Application Registry**: Detailed tracking and filtering of research applications.
* **Capacity Planner**: Hierarchical capacity and workload management.
* **Turnaround Analysis**: Performance metrics and SLA tracking.
* **Market Report**: Overview of market distribution and active studies.

### CWT Enterprise EDW (Showcase)
* **Architecture & Flow**: Detailed diagrams of current vs. future states, medallion architectures, and end-to-end data flow.
* **Data Model**: Visual representation of the Kimball Star Schema used for reporting.
* **Security & Quality**: Robust RBAC, data governance, and data quality metrics.
* **Microsoft Fabric & Azure**: Overview of the technology stack powering the warehouse.

## Tech Stack
* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Charting**: Recharts
* **Icons**: Lucide React

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

* `/src/app` - Contains the Next.js routes for both NHS and CWT pages.
  * `/src/app/cwt` - Directory for all the CWT Enterprise EDW static showcase pages.
* `/src/components` - Shared React components (Sidebar, KpiCard, DataTable, etc).
* `/src/lib` & `/src/types` - Type definitions and mock data generation utilities.
* `/public/data` - Local JSON data powering the charts and tables.
