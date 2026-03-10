# Radiante Stock

App de control de stock de bebidas para Radiante Restaurante.

## Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Backend/CMS**: Payload 3.79 (admin en `/admin`)
- **Base de datos**: PostgreSQL
- **UI**: Tailwind v4 + shadcn/ui (new-york) + lucide-react
- **Server Actions**: next-safe-action v8 + Zod v4 + React Hook Form
- **Auth**: JWT en cookie httpOnly, decodificado en middleware
- **Package manager**: pnpm

## Setup

```bash
cp .env.example .env   # completar DATABASE_URL y PAYLOAD_SECRET
pnpm install
pnpm dev               # http://localhost:3000
```

### Variables de entorno

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL |
| `PAYLOAD_SECRET` | Secreto para firmar JWT — cualquier string largo y random |

## Estructura del proyecto

```
src/
├── app/
│   ├── (frontend)/          # Rutas del frontend
│   │   ├── (auth)/          #   Grupo sin nav
│   │   │   └── login/       #     Login (email o username)
│   │   ├── (app)/           #   Grupo con nav
│   │   │   ├── page.tsx     #     Vista General
│   │   │   ├── stock/       #     Gestion de stock (ajuste rapido + ingreso)
│   │   │   └── historial/   #     Historial de movimientos
│   │   ├── layout.tsx       #   Layout raiz (fuente, metadata, toaster)
│   │   └── globals.css      #   Tailwind v4 + CSS vars + tema
│   │
│   ├── (payload)/           # Admin panel y API de Payload (no tocar)
│   └── services/            # Logica de negocio
│       └── users.service.ts #   Login (email o username)
│
├── collections/             # Schemas de Payload
│   ├── Users.ts             #   name, username, email, auth
│   ├── Media.ts             #   Uploads
│   ├── Categorias.ts        #   Nombre unico
│   ├── Bebidas.ts           #   nombre, categoria (rel), stock
│   └── Movimientos.ts       #   bebida, tipo (ingreso/egreso), cantidad, usuario
│
├── components/
│   ├── Nav.tsx              # Nav responsive con logout
│   ├── StockManager.tsx     # Ajuste rapido de stock (+/- por bebida)
│   ├── BulkIngresoForm.tsx  # Ingreso de mercaderia en bulk
│   ├── admin/               # Componentes custom del admin de Payload
│   │   └── frontend-nav-links.tsx  # Links al frontend desde el admin
│   └── ui/                  # Componentes shadcn (no editar a mano)
│
├── lib/
│   ├── payload.ts           # Singleton de Payload
│   ├── safe-action-client.ts  # Action client base (logging, error handling)
│   ├── safe-actions.ts      # Action client autenticado (inyecta user en ctx)
│   └── utils.ts             # cn() para clases de Tailwind
│
├── middleware.ts            # Proteccion de rutas por JWT (sin DB)
├── payload.config.ts        # Config central de Payload
└── payload-types.ts         # Auto-generado — NO editar a mano
```

## Flujo de autenticacion

1. El usuario hace login en `/login` (email o username + password)
2. El server action llama a Payload, obtiene JWT y lo guarda en cookie httpOnly
3. `middleware.ts` decodifica el JWT (sin verificar firma — es Edge Runtime) y protege rutas:
   - `/`, `/stock`, `/historial` — requiere estar autenticado
   - `/login` — si ya esta autenticado, redirige a `/`
4. Las pages del server validan con `payload.auth({ headers })` (verificacion real)

## Colecciones

| Coleccion | Descripcion |
|---|---|
| **Users** | Usuarios con auth (email, username, name). Se crean desde `/admin` |
| **Categorias** | Tipos de bebida (Fernet, Gaseosa, Vino, etc). Se gestionan desde `/admin` |
| **Bebidas** | Cada bebida con su categoria y stock actual |
| **Movimientos** | Registro de cada ingreso/egreso con stock anterior y resultante |

## Comandos utiles

```bash
pnpm dev                    # Dev server
pnpm build && pnpm start    # Build de produccion

# Payload
pnpm generate:types         # Regenerar payload-types.ts (despues de cambiar schemas)
pnpm generate:importmap     # Regenerar importMap (despues de agregar componentes al admin)
pnpm payload migrate:create --name <nombre>  # Crear migracion
pnpm payload migrate        # Ejecutar migraciones pendientes

# Testing
pnpm test:int               # Tests de integracion (Vitest)
pnpm test:e2e               # Tests e2e (Playwright)

# Otros
npx tsc --noEmit            # Verificar tipos sin compilar
```

## Checklist para cambios comunes

### Agregar un campo a una coleccion
1. Editar el archivo en `src/collections/`
2. `pnpm generate:types`
3. `pnpm payload migrate:create --name add-campo-x`
4. `pnpm payload migrate`

### Agregar un componente al admin de Payload
1. Crear el componente en `src/components/admin/`
2. Referenciarlo en `payload.config.ts`
3. `pnpm generate:importmap`

### Agregar un componente de UI (shadcn)
```bash
npx shadcn@latest add <componente>
```
Los componentes se instalan en `src/components/ui/`.

### Crear una nueva server action autenticada
```ts
// src/app/(frontend)/(app)/mi-ruta/actions.ts
'use server'
import { authActionClient } from '@/lib/safe-actions'

export const miAction = authActionClient.action(async ({ ctx }) => {
  const userId = ctx.user.id  // usuario autenticado
  // ...
})
```

### Agregar una ruta protegida nueva
Agregar el path al `matcher` y a `protectedRoutes` en `src/middleware.ts`.
