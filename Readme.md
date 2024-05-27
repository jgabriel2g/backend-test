# Prueba Tecnica para BeMaster

En este proyecto se presenta la solucion para la prueba tecnica de desarrollador full stack con enfoque en backend.

En este repo se escribio la solucion para el punto 1.

## Estructura del Proyecto
El proyecto utiliza una arquitectura hexagonal dividida en tres capas principales:

1. **Dominio**: Contiene las entidades y las interfaces de los casos de uso y los repositorios.
2. **Aplicación**: Incluye los casos de uso (lógica de la aplicación) que orquestan las operaciones del dominio.
3. **Infraestructura**: Provee las implementaciones concretas de las interfaces definidas en el dominio, como repositorios y adaptadores de servicios externos.

## Requisitos Previos
Antes de ejecutar el proyecto, asegúrate de tener instalado Node.js y npm.

## Instalación y Ejecución
Para instalar y ejecutar el proyecto, sigue estos pasos:

```bash
# Instalar dependencias
npm install

# Compilar el proyecto
npm run build

# Iniciar la aplicación
npm start
```

## Funcionamiento del Código

### Repositorio de github
Para realizar una solicitud a GitHub y obtener los repositorios más populares de un usuario, se utiliza el siguiente método en los repositorios:
```typescript
import axios from "axios";
import { GithubRepository } from "../../domain/repositories/githubRepository";
import { repositoryReponse } from "../../domain/entities/response";

export default class Github implements GithubRepository {
  async getMostPopularRepositoriesByUsername(
    username: string,
    page: number,
    per_page: number
  ): Promise<repositoryReponse[]> {
    try {
      const url = `https://api.github.com/users/${username}/repos`;
      const params = {
        type: "owner",
        sort: "stargazers",
        direction: "desc",
        page: page,
        per_page: per_page,
      };

      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching repositories:", error);
      throw new Error("Failed to fetch repositories");
    }
  }
}
```
### Caso de uso
Se ha implementado un caso de uso que se encarga de resolver el problema del punto 1 de la prueba, obteniendo los 10 repositorios más populares de Google
```typescript
import { repositoryReponse } from "../../domain/entities/response";
import { GithubRepository } from "../../domain/repositories/githubRepository";
import { Github } from "../../domain/usecases/github";

export class GithubUseCase implements Github {
  constructor(private repository: GithubRepository) {}

  async getMostPopularRepositoriesByGoogle(): Promise<repositoryReponse[]> {
    return await this.repository.getMostPopularRepositoriesByUsername(
      "google",
      1,
      10
    );
  }
}
```

### Ejecucion y resultados esperados
Para poder visualizar los resultados haremos una peticion al endpoint `localhost:{PORT}/api/google`.

Al realizar la request deberías obtener una lista de los 10 repositorios más populares de Google, ordenados por la cantidad de estrellas (stargazers).


# Otros puntos de la prueba

## Nomeclatura
En este punto se nos requiere interpretar una funcion y renombrarla para hacerla legible
```javascript
function f(x, y, z) {
    let a = x + y;
    let b = a * z;
    let c = Math.sin(b);
    return c;
}

function calculateSineOfProductOfSum(input1, input2, input3) {
    let sum = input1 + input2;
    let product = sum * input3;
    let result = Math.sin(product);
    return result;
}
```

## Pensamiento logico
Para este punto se requiere realizar una funcion que devuelva los numeros impares desde el 1 hasta el indicado, mi solucion fue:

```javascript
function getOddNumbersUpTo(x) {
    if (x < 1 || !Number.isInteger(x)) {
        return "Please provide a positive integer.";
    }
    
    let result = [];
    for(let i = 1; i <= x; i++) {
        if (i % 2 !== 0) {
            result.push(i);
        }
    }
    return result;
}
```

de hecho la podemos probar simplemente ejecutando `node src/point2.js` ahi deje ejemplos con resultados esperados.

## Modelado de base de datos

### Script Completo en Inglés

```sql
-- Enable the uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the authors table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    biography TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the collaborators table
CREATE TABLE collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    specialty VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the videos table
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255) NOT NULL,
    author_id UUID NOT NULL,
    publication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL
);

-- Create the video_collaborators table
CREATE TABLE video_collaborators (
    video_id UUID NOT NULL,
    collaborator_id UUID NOT NULL,
    PRIMARY KEY (video_id, collaborator_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (collaborator_id) REFERENCES collaborators(id) ON DELETE CASCADE
);

-- Create the comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the trigger function to validate password length
CREATE OR REPLACE FUNCTION validate_password()
RETURNS TRIGGER AS $$
BEGIN
    IF LENGTH(NEW.password) <= 8 THEN
        RAISE EXCEPTION 'Password must be longer than 8 characters.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for the users table
CREATE TRIGGER trigger_validate_password
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION validate_password();
```

### Restricciones de integridad incluidas:

1. **Tabla `users`**:
   - `id` es la clave primaria y se genera automáticamente usando `uuid_generate_v4()`.
   - `email` es único para evitar duplicados.
   - Validación de la longitud de la contraseña a través de un trigger.

2. **Tabla `authors`**:
   - `id` es la clave primaria.
   - `user_id` es una clave foránea que hace referencia a `id` en `users` y se elimina en cascada (`ON DELETE CASCADE`).

3. **Tabla `collaborators`**:
   - `id` es la clave primaria.
   - `user_id` es una clave foránea que hace referencia a `id` en `users` y se elimina en cascada (`ON DELETE CASCADE`).

4. **Tabla `videos`**:
   - `id` es la clave primaria.
   - `author_id` es una clave foránea que hace referencia a `id` en `authors`. Si el autor se elimina, se establece a `NULL` (`ON DELETE SET NULL`).

5. **Tabla `video_collaborators`**:
   - Clave primaria compuesta por `video_id` y `collaborator_id`.
   - `video_id` es una clave foránea que hace referencia a `id` en `videos` y se elimina en cascada (`ON DELETE CASCADE`).
   - `collaborator_id` es una clave foránea que hace referencia a `id` en `collaborators` y se elimina en cascada (`ON DELETE CASCADE`).

6. **Tabla `comments`**:
   - `id` es la clave primaria.
   - `video_id` es una clave foránea que hace referencia a `id` en `videos` y se elimina en cascada (`ON DELETE CASCADE`).
   - `user_id` es una clave foránea que hace referencia a `id` en `users` y se elimina en cascada (`ON DELETE CASCADE`).

7. **Tabla `reviews`**:
   - `id` es la clave primaria.
   - `video_id` es una clave foránea que hace referencia a `id` en `videos` y se elimina en cascada (`ON DELETE CASCADE`).
   - `user_id` es una clave foránea que hace referencia a `id` en `users` y se elimina en cascada (`ON DELETE CASCADE`).
   - Restricción `CHECK` para asegurarse de que la calificación (`rating`) esté entre 1 y 5.

Este modelo de datos permite gestionar vídeos con sus autores y colaboradores, así como los comentarios y reviews de los usuarios.
Las restricciones de integridad aseguran que las referencias entre tablas se mantengan coherentes y que los datos sean consistentes.


## Arquitectura del backend
Para este punto incluire las tecnologias que manejo e inspirandome en proyectos que he creado, lo pense con una arquitectura bastante robusta, pero cada tecnologia tiene su razon para estar ahi.

Entonces, en mi enfoque para una aplicacion de E-Commerce, pensandola en el mejor de los casos, yo utilizaria una arquitectura de microservicios para mejorar la escalabilidad y mantenibilidad.

### Tecnologias a usar

### Tecnologías a usar

1. **Gateway**:
    - **Apollo Router en Rust** para gestionar y orquestar las solicitudes GraphQL hacia los diferentes microservicios.
2. **Microservicios**:
    - **Node.js**: Para servicios de gestión de productos y pedidos.
    - **FastAPI (Python)**: Para servicios de gestión de usuarios y catálogos.
    - **Go**: Para el servicio de autenticación.
3. **Comunicación entre Servicios**:
    - **Kafka**: Para la comunicación basada en eventos.
    - **Protobuf**: Para la serialización eficiente de datos.
    - **gRPC**: Para comunicación directa de baja latencia entre ciertos servicios críticos.
4. **Bases de Datos**:
    - **PostgreSQL**: Para datos relacionales, como pedidos y usuarios.
    - **MongoDB**: Para datos no relacionales, como carritos de compras y sesiones.
5. **Cache**:
    - **Redis** para almacenamiento en caché y gestión de sesiones.
6. **Búsqueda**:
    - **Elasticsearch** para implementar búsquedas rápidas y eficientes en los catálogos de productos.
7. **Containerización**:
    - **Docker** para empaquetar y desplegar los microservicios.
8. **Infraestructura**:
    - **AWS** para desplegar los servicios, utilizar herramientas de mensajería (SNS/SQS), y almacenamiento de imágenes (S3).
9. **Patrones de Diseño**:
    - **Arquitectura Hexagonal**: Cada microservicio sigue una arquitectura hexagonal de tres capas (dominio, aplicación e infraestructura).
    - **Repository Pattern**: Para la abstracción de la lógica de acceso a datos.
    - **Cache-First**: Para mejorar el rendimiento mediante el uso extensivo de caché.

<img src="assets/apollo.svg" alt="Apollo Router" width="100" height="100">
<img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" width="100" height="100">
<img src="assets/fastapi.svg" alt="FastAPI" width="100" height="100">
<img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg" alt="Go" width="100" height="100">
<img src="assets/kafka.svg" alt="Kafka" width="100" height="100">
<img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="PostgreSQL" width="100" height="100">
<img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" alt="MongoDB" width="400" height="100">
<img src="assets/redis.svg" alt="Redis" width="100" height="100">
<img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" alt="Docker" width="200" height="100">
<img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" width="100" height="100">

### Nomeclatura
Para mantener una organización clara y consistente, utilizo la siguiente convención de nombres para los servicios:
- Microservicios: ms-{nombre-del-servicio}
  - Ejemplo: ms-auth, ms-product, ms-order
- Gateways: gateway-{nombre-del-gateway}
  - Ejemplo: gateway-api


### Organizacion de archivos
Cada microservicio sigue una estructura similar a esta para mantener la consistencia y facilitar la comprensión y el mantenimiento:
```
ms-auth/
├── cmd/
│   └── main.go
├── config/
│   └── config.go
├── internal/
│   ├── application/
│   │   └── services/
│   │       └── auth_service.go
│   ├── domain/
│   │   ├── entities/
│   │   │   └── user.go
│   │   ├── repositories/
│   │   │   └── user_repository.go
│   │   └── usecases/
│   │       └── authenticate_user.go
│   ├── infrastructure/
│   │   ├── grpc/
│   │   │   └── server.go
│   │   ├── kafka/
│   │   │   └── producer.go
│   │   ├── persistence/
│   │   │   ├── postgres/
│   │   │   │   └── user_repository_postgres.go
│   │   │   └── redis/
│   │   │       └── cache.go
│   │   ├── protobuf/
│   │   │   └── auth.proto
│   │   └── rest/
│   │       └── handler.go
├── scripts/
│   └── migrate.sh
├── Dockerfile
├── docker-compose.yml
├── go.mod
└── go.sum
```

### Despliegue en AWS
Utilizo Docker para contenerizar cada microservicio y los despliego en AWS utilizando herramientas 
como ECS (Elastic Container Service) y ECR (Elastic Container Registry).

### Conclucion
Mi enfoque utiliza una arquitectura de microservicios con un gateway GraphQL en Apollo Router, microservicios en Node.js,
FastAPI y Go, y una comunicación eficiente mediante Kafka y gRPC, este setup nos proporciona una base sólida escalable y de alto rendimiento.
La estructura de cada microservicio sigue principios de arquitectura hexagonal, asegurando la mantenibilidad y la escalabilidad.
Con Docker y AWS, garantizo un despliegue robusto y eficiente.


# Politicas de nomeclatura
El objetivo es definir reglas y estándares claros para la nomenclatura en el desarrollo de software dentro de la empresa.
Teniendo en cuenta que la uniformidad en la nomenclatura mejora la legibilidad del código, facilita su mantenimiento y promueve la colaboración efectiva entre los miembros del equipo.

## Bases de Datos

### Nombres de Bases de Datos

- Utilizar **snake_case** para los nombres de las bases de datos.
- Deben ser concisos pero descriptivos.

**Ejemplo**: `customer_records`, `financial_data`.

### Tablas y Columnas

- Utilizar **snake_case** para los nombres de las tablas y columnas.
- Evitar abreviaturas confusas y utilizar nombres que describan claramente el contenido.

**Ejemplo**: `order_items`, `last_login`.

## Variables y Funciones

### Variables

- Utilizar la convencion de cada lenguaje (snake_case, camelCase, etc...)
- Los nombres deben reflejar claramente el propósito de la variable y ser lo suficientemente descriptivos.

**Ejemplo**: `orderTotal`, `product_quantity`.

### Funciones

- Utilizar la convencion de cada lenguaje (snake_case, camelCase, etc...)
- Los nombres deben ser descriptivos y reflejar claramente la acción que realiza la función.
- Evitar nombres genéricos como `funcion1` o `realizarAccion`.

**Ejemplo**: `processPayment`, `generate_report`.

## Clases

- Utilizar la convencion de cada lenguaje
- Los nombres deben ser sustantivos y describir claramente la responsabilidad principal de la clase.

**Ejemplo**: `UsuarioModel`, `OrdenCompra`.

## Git

### Ramas

- Utilizar **kebab-case** para los nombres de las ramas.
- Los nombres deben ser descriptivos y reflejar claramente la finalidad de la rama.

**Ejemplo**: `feature/add-payment-gateway`, `fix/resolve-login-issue`.

### Commits

- Escribir mensajes de commit claros y concisos en inglés.
- Utilizar un encabezado que describa brevemente el cambio y agregar detalles adicionales en el cuerpo del commit si es necesario.

```plaintext
fix: correct calculation for total price

- Fixed rounding error in total price calculation.
- Added unit tests for price calculation.
```

### Tags

- Utilizar versiones semánticas para los tags de versión.

**Ejemplo**: `v1.0.0`, `v1.1.2`.

## Documentación

- Documentar el código con comentarios claros y significativos.
- Utilizar comentarios para explicar el propósito de bloques de código, funciones, clases y proporcionar contexto adicional cuando sea necesario.

```python
# Calculates the total price including taxes.
# Params:
# - price (float): The base price of the item.
# - tax_rate (float): The tax rate to apply.
# Returns:
# - float: The total price including taxes.
def calculateTotalPrice(price, tax_rate):
    return price + (price * tax_rate)
```

Este documento mantiene una estructura clara y proporciona directrices específicas para cada aspecto del desarrollo, garantizando que todos los miembros del equipo trabajen con los mismos estándares y prácticas.