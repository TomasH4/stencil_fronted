# Stencil - Frontend

Este es el frontend de **Stencil**, una plataforma web diseñada para conectar clientes con tatuadores (Tattoo Artists). La aplicación permite a los usuarios buscar artistas, ver su portafolio, dejar reseñas y agendar citas.

El proyecto está construido utilizando **Next.js** (App Router), React y TypeScript, con un enfoque en componentes modulares y una experiencia de usuario rápida y dinámica.

## Requisitos Previos

- [Node.js](https://nodejs.org/es/) (versión 18 o superior)
- npm o yarn

## Variables de Entorno

Para que la aplicación pueda conectarse con el backend, necesitas configurar las variables de entorno. 
Crea un archivo llamado `.env.local` en la raíz de la carpeta `frontend` y añade la siguiente variable:

```env
# URL base de la API del backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

*(Si ya tienes el backend desplegado, reemplaza `http://localhost:3000/api/v1` por tu URL de producción, por ejemplo `https://tu-backend.up.railway.app/api/v1`)*.

## Setup y Ejecución Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Comandos Útiles

- `npm run dev`: Inicia el servidor en modo desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia el servidor en modo producción (requiere compilar primero).
- `npm run lint`: Ejecuta el linter (ESLint) para encontrar problemas en el código.
