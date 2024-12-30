# Car repair register - frontend

Frontend application providing GUI in React.js.

## Technologies required for development

- Node.js (>=22)
- Docker (>=26.0.1)
- Docker compose (>=2.26.1)

## Development

While development it is required to have Postgres database, Keycloak and Backend running. It can be runned by prepared `docker-compose.yaml` file. This development environment can be started by command:

- `docker compose up -d`

It will run database on port 5432 and backend on port 80 exposed by traefik and internal api on port 9090 for healthcheck (not used in frontend).

After database and backend is running, you can start development server by commands:

- `npm install` (only if you didn't run it before or you modifed package.json file)
- `npm run apigen` (only if you need generate openapi without starting/buildin app)
- `npm run dev`

React App will start in development mode on port 5173. |

## Building docker image

There is provided Dockerfile and sh script build-image.sh. You can use this script to build docker image.

## License

Project is licensed under [MIT](./LICENSE.txt) License. There are 3rd party libraries which can be part of builded docker images. List of this libraries can be found in [LIBRARIES](./LIBRARIES). Other than that this project use development libraries too. Please look at [package.json](./package.json) if you are interested in complete list of direct dependencies of this project.

## How to update list of used libraries

If added new dependencies, list of used libraries can be updated using this script

`npm run licenseReport`

WHILE RUNNING IT WILL INSTANLL GLOBALLY license-report LIBRARY

## Environment variables

API_BASE_PATH="/api/car-repair-register"
KEYCLOAK_REALM="evidence"
KEYCLOAK_CLIENT="evidence-public"
KEYCLOAK_URL="http://localhost/auth"