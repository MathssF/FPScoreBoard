# FPScoreBoard

Frontend para visualización de estadísticas de [MatchZy](https://github.com/shobhit-pathak/MatchZy) para CS2.

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd FPScoreBoard
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Accede en el navegador: `http://localhost:3000`

## Configuración

Después de instalar, necesitas configurar la conexión de datos. Hay dos opciones:

### Opción 1: Archivo .env

Crea un archivo `.env` basado en `.env.example` y completa con los datos de tu base de datos MySQL o los endpoints de la API.

### Opción 2: Página de Configuración

Accede a la página de configuración en `/start-config` y completa la información solicitada:

- **Idioma**: Selecciona entre Portugués, Inglés o Español
- **Fuente de Datos**: Elige entre MySQL o API
  - Si MySQL: Completa los datos de la base de datos (host, puerto, usuario, contraseña, nombre de la base de datos)
  - Si API: Completa la URL base de la API y los endpoints

## Prioridad de Configuración

Para datos de API y base de datos, el archivo `.env` siempre tiene prioridad sobre `config.json`.

Para la bandera `needConfig` (que controla si el enlace de configuración aparece en el menú), el `config.json` tiene prioridad sobre `.env`.

Y si hay tanto una base de datos como una API, la API tendrá prioridad en las llamadas.

## Uso

Después de configurar correctamente, puedes acceder a las siguientes páginas:

- `/` - Página de inicio
- `/dashboard/matchs-stats` - Estadísticas de partidos
- `/dashboard/players-matchs` - Jugadores y sus partidos
- `/dashboard/maps-stats` - Estadísticas de mapas

El enlace "Config" aparece en el menú solo cuando la configuración no ha sido completada aún.

## Contribución

¿¿Quieres contribuir al proyecto? Envía tu Pull Request a la rama `development`.

## Rama Tests

La rama `tests` contiene herramientas para probar una base de datos MySQL local, útil para desarrollo y depuración.

## Tecnologías

- **Next.js (16.0.1)**: Framework React con renderizado del lado del servidor y rutas de API integradas
- **React (19.2.0)**: Biblioteca principal para la construcción de la interfaz
- **Tailwind CSS (v4)**: Framework de estilización utility-first
- **MySQL2**: Controlador para conexión a base de datos MySQL
- **TypeScript**: Supersets de JavaScript con tipado estático
- **ESLint**: Herramienta de análisis de código
- **Dotenv**: Gestión de variables de entorno
- **Faker.js**: Generación de datos falsos para pruebas
- **Ts-node**: Ejecución de TypeScript en Node.js