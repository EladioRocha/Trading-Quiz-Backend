# Trading-Quiz-Backend

API de cuestionarios de trading con Express y MongoDB. Incluye usuarios, lecciones, quizzes, notificaciones y clasificación, además de documentación JSDoc.

## Estructura

- [docs](docs)
- [src](src)

## Preparación y uso

Configura MongoDB, puerto y autenticación antes de iniciar. La documentación existente está en [docs/index.html](docs/index.html) y se genera con `npm run doc`. El frontend complementario es [Trading-Quiz-Frontend](https://github.com/EladioRocha/Trading-Quiz-Frontend).

### Raíz del repositorio

Requiere Node.js. Este paquete no fija una versión del runtime; valida compatibilidad con las dependencias antes de actualizarlo.

```sh
npm ci
npm run dev
```

Comandos declarados en [package.json](package.json):

| Comando | Acción |
| --- | --- |
| `npm run doc` | `jsdoc -c jsdoc.json` |
| `npm run dev` | `nodemon ./src/index` |
| `npm run start` | `node ./src/index` |

## Configuración detectada en el código

Estas son referencias explícitas a variables de entorno, no una garantía de que toda la configuración esté externalizada. Los nombres y archivos permiten localizar dónde se usan; los valores deben corresponder a tu entorno.

| Variable | Referencia |
| --- | --- |
| `BCRYPT_SALT_ROUNDS` | [src/helpers/password.js](src/helpers/password.js) |
| `CACHE_DURATION` | [src/helpers/cacheMemory.js](src/helpers/cacheMemory.js) |
| `JWT_SECRET_KEY` | [src/services/userService.js](src/services/userService.js) |
| `MONGO_URI_LOCAL` | [src/index.js](src/index.js) |
| `PORT` | [src/index.js](src/index.js) |
| `PORT_DEV` | [src/index.js](src/index.js) |

No guardes credenciales reales en la documentación. Si hay `.env.example`, úsalo como referencia y revisa cómo carga la configuración el punto de entrada.

## Validación y estado

Esta guía se contrastó con el árbol de archivos y los manifiestos del repositorio. No se ha validado una ejecución completa contra servicios externos, bases de datos o hardware. Las versiones y los scripts mostrados describen el código actual; no implican que sus dependencias antiguas sigan siendo compatibles.

## Documentación previa

Se conserva como referencia histórica, incluidas las imágenes y atribuciones originales. Los enlaces a demos y servicios no se han comprobado.

# Trading-Quiz-Backend

To go to the frontend and see the views click [here](https://github.com/EladioRocha/Trading-Quiz-Frontend)
