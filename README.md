# NLCI Express Train Portal & ADO.NET Case Study Suite

An enterprise-grade ASP.NET & ADO.NET Train Booking Management Application built with React, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start Guide (VS Code & Localhost)

Follow these simple steps to run this project locally on your machine in **Visual Studio Code**:

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Installed automatically with Node.js
- **VS Code**: Recommended code editor ([Download VS Code](https://code.visualstudio.com/))

---

### Step-by-Step Local Setup

1. **Open the Project in VS Code**:
   - Open Visual Studio Code.
   - Click `File` -> `Open Folder...` (or `Cmd+O` / `Ctrl+O`).
   - Select this project root folder.

2. **Open the Terminal in VS Code**:
   - Press `` Ctrl + ` `` (or `Terminal` -> `New Terminal`).

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Open your web browser and navigate to:
     [http://localhost:3000](http://localhost:3000)

---

## 🛠 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the local Vite development server at `http://localhost:3000`.
- `npm run build`: Compiles and builds the production-ready static bundle inside the `dist/` directory.
- `npm run preview`: Previews the production build locally.
- `npm run lint` / `npm run typecheck`: Validates TypeScript type checking across all files with zero errors.

---

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── AskHrModal.tsx               # HR support modal dialog
│   │   ├── BookingForm.tsx              # CRUD Train booking modal form
│   │   ├── BookingList.tsx              # Full database records data grid table
│   │   ├── CaseStudyExam.tsx            # Case Study evaluation module
│   │   ├── CodeStudio.tsx               # ADO.NET C# code generator studio
│   │   ├── Header.tsx                   # Role-aware header & persona switcher
│   │   ├── LoginPage.tsx                # Role authentication login screen
│   │   ├── RoleSelectionPage.tsx        # Role picker modal
│   │   ├── SeatMapModal.tsx             # Interactive coach seat map visualizer
│   │   ├── SqlConsole.tsx               # Interactive SQL query console engine
│   │   ├── TicketReceipt.tsx            # Printable e-Ticket receipt generator
│   │   ├── Toast.tsx                    # ADO.NET execution logs toast banner
│   │   ├── TrainMainSceneDashboard.tsx  # Active train scene dashboard
│   │   └── TrainQuestionnaireWizard.tsx # Train setup wizard step-by-step
│   ├── data/
│   │   └── initialData.ts               # Default train bookings & test personas
│   ├── App.tsx                          # Core React application container & state
│   ├── index.css                        # Tailwind CSS configuration & environment themes
│   ├── main.tsx                         # React entry point
│   └── types.ts                         # Global TypeScript interfaces & types
├── index.html                           # Application HTML entry document
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # TypeScript compiler options
└── vite.config.ts                       # Vite bundler configuration
```

---

## 👥 Test Personas & Access Roles

The app includes built-in test personas to test role-based permissions:

- **Karthik Raja (Admin)**: Full administrative access (CRUD operations, SQL query console, ADO.NET C# code generator, Case Study exam).
- **Priya Sharma / Rajesh Kumar (Viewer)**: Passenger view restricted strictly to viewing and printing their own train e-Tickets.

---

## 📜 License
Internal Enterprise Application — NLCI Corporation.
