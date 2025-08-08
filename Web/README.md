# React Template with Authentication

A modern React application template built with TypeScript, Vite, and Tailwind CSS. This template includes:

- 🔐 Authentication system with protected routes
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔒 Role-based access control
- 📝 Form handling with React Hook Form and Zod validation
- 🚀 Fast development with Vite
- 📦 TypeScript for type safety

## Features

- **Authentication**: Login/logout functionality with token management
- **Protected Routes**: Route protection based on authentication status
- **Role-based Access**: Different access levels for users and admins
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Form Validation**: Robust form handling with Zod schema validation
- **Type Safety**: Full TypeScript support throughout the application

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── auth/           # Authentication context and protected routes
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── layout/         # Layout components
├── pages/          # Page components
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── api/            # API integration
```

## Usage

### Login
- Use any email and password (minimum 6 characters)
- Emails containing "admin" will get admin role
- Other emails will get user role

### Navigation
- **Dashboard**: Available to all authenticated users
- **Admin Panel**: Only available to users with admin role
- **Logout**: Available in the sidebar

## Technologies Used

- React 19
- TypeScript
- Vite
- React Router DOM
- React Hook Form
- Zod (validation)
- Tailwind CSS
- Axios (HTTP client)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
