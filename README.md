# Mi Aplicación

Este repositorio contiene tanto el frontend como el backend de Mi Aplicación.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `frontend/`: Contiene el código del frontend de la aplicación.
- `backend/`: Contiene el código del backend de la aplicación.

## Configuración y Despliegue

### Frontend (Vercel)

1. Navega al directorio del frontend:

   ```
   cd frontend
   ```

2. Instala las dependencias:

   ```
   npm install
   ```

3. Para desarrollo local:

   ```
   npm run dev
   ```

4. Para desplegar en Vercel:

   - Asegúrate de tener una cuenta en [Vercel](https://vercel.com)
   - Instala la CLI de Vercel:
     ```
     npm install -g vercel
     ```
   - Inicia sesión en Vercel:
     ```
     vercel login
     ```
   - Despliega la aplicación:
     ```
     vercel
     ```

5. Para actualizaciones futuras:
   ```
   git push origin main
   ```
   Vercel desplegará automáticamente si está configurado el despliegue automático.

### Backend (Fly.io)

1. Navega al directorio del backend:

   ```
   cd backend
   ```

2. Instala las dependencias:

   ```
   npm install
   ```

3. Para desarrollo local:

   ```
   npm run dev
   ```

4. Para desplegar en Fly.io:

   - Asegúrate de tener una cuenta en [Fly.io](https://fly.io)
   - Instala la CLI de Fly:
     ```
     curl -L https://fly.io/install.sh | sh
     ```
   - Inicia sesión en Fly:
     ```
     fly auth login
     ```
   - Crea una nueva aplicación en Fly:
     ```
     fly launch
     ```
   - Configura las variables de entorno necesarias:
     ```
     fly secrets set NOMBRE_VARIABLE=valor
     ```
   - Despliega la aplicación:
     ```
     fly deploy
     ```

5. Para actualizaciones futuras:
   ```
   git push origin main
   fly deploy
   ```

## Variables de Entorno

Asegúrate de configurar las variables de entorno necesarias tanto en Vercel como en Fly.io para el correcto funcionamiento de la aplicación.

## Notas Adicionales

- Asegúrate de tener Node.js y npm instalados en tu sistema.
- Para el backend, es posible que necesites un Dockerfile en la raíz del proyecto para Fly.io.
- Consulta la documentación de [Vercel](https://vercel.com/docs) y [Fly.io](https://fly.io/docs/) para más detalles sobre la configuración y el despliegue.
