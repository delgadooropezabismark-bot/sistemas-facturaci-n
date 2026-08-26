---

## Diseño de Interfaz

Los diseños, diagramas de navegación y prototipos del sistema se encuentran en la carpeta **/docs/design/**:

- 📐 [Diagrama de Navegación — Imagen](docs/design/diagrama_navegacion_hotell.png)
- 📐 [Diagrama de Navegación — Archivo Fuente](docs/design/diagrama_navegacionhotel.drawio)
- 📝 [Formulario de Registro](docs/design/Registro.png)
- 📋 [Listado de Facturas](docs/design/Listado.png)
- 📊 [Reporte de Ingresos](docs/design/Reporte.png)




## Diseño Detallado — Diagramas UML (PlantUML)

Los diagramas de Casos de Uso, Secuencia, Estados y Clases del Sprint 1 se encuentran en la carpeta **/docs/uml/**:

### HU-01: Registrar datos del huésped
- 📐 [Casos de Uso](docs/uml/HU01_casos.png) · [Código](docs/uml/HU01_casos.puml.txt)
- 📐 [Diagrama de Secuencia](docs/uml/HU01_secuencia.png) · [Código](docs/uml/HU01_secuencia.puml.txt)
- 📐 [Diagrama de Estados](docs/uml/HU01_estados.png) · [Código](docs/uml/HU01_estados.puml.txt)
- 📐 [Diagrama de Clases](docs/uml/HU01_clases.png) · [Código](docs/uml/HU01_clases.puml.txt)

### HU-02: Validar CI / NIT
- 📐 [Casos de Uso](docs/uml/HU02_casos.png) · [Código](docs/uml/HU02_casos.puml.txt)
- 📐 [Diagrama de Secuencia](docs/uml/HU02_secuencia.png) · [Código](docs/uml/HU02_secuencia.puml.txt)
- 📐 [Diagrama de Estados](docs/uml/HU02_estados.png) · [Código](docs/uml/HU02_estados.puml.txt)
- 📐 [Diagrama de Clases](docs/uml/HU02_clases.png) · [Código](docs/uml/HU02_clases.puml.txt)

### HU-03: Registrar habitación y fechas
- 📐 [Casos de Uso](docs/uml/HU03_casos.png) · [Código](docs/uml/HU03_casos.puml.txt)
- 📐 [Diagrama de Secuencia](docs/uml/HU03_secuencia.png) · [Código](docs/uml/HU03_secuencia.puml.txt)
- 📐 [Diagrama de Estados](docs/uml/HU03_estados.png) · [Código](docs/uml/HU03_estados.puml.txt)
- 📐 [Diagrama de Clases](docs/uml/HU03_clases.png) · [Código](docs/uml/HU03_clases.puml.txt)


##  Diseño de Arquitectura de Datos

El modelo de datos cumple con la Tercera Forma Normal (3FN) y garantiza integridad referencial mediante claves primarias y foráneas.

### Modelo Relacional
![Modelo Relacional](docs/database/modelo_relacional.png)

###  Archivos del modelo
- 📐 [Diagrama de Base de Datos — Imagen](docs/database/modelo_relacional.png)
- 📐 [Diagrama — Archivo Fuente](docs/database/modelo_relacional.dbml.txt)
- 📝 [Esquema SQL de Creación](docs/database/esquema.sql)

# Sistema de Facturación Hotelera (Bolivia) - Arquitectura SOLID

Sistema digitalizado de gestión de hospedajes y facturación computarizada para establecimientos hoteleros, cumpliendo con la normativa fiscal de Bolivia (SIN), las historias de usuario del PRD (HU01, HU02, HU03) y refactorizado bajo principios **SOLID** y **Clean Architecture**.

---

## Principios SOLID Aplicados

1. **S - Responsabilidad Única (SRP):**
   - **Validadores:** Funciones puras e independientes para C.I., NIT, rango de fechas y tarifas en `src/validators/`.
   - **Servicios:** Clases de dominio dedicadas (`GuestService`, `RoomService`, `StayService`, `BillingService`, `FiscalService`).
   - **Componentes:** Descomposición en subcomponentes atómicos (formularios modales, tablas, tarjetas de cálculo reactivo, resúmenes KPI).

2. **O - Abierto / Cerrado (OCP):**
   - **Strategy Pattern** para validación de documentos (`DocumentValidatorStrategies`), permitiendo extender con nuevos tipos de documentos sin modificar el código base existente.
   - Motor de cálculo fiscal ampliable para normativas tributarias.

3. **L - Sustitución de Liskov (LSP):**
   - Proveedores de almacenamiento (`SupabaseStorageProvider` y `LocalStorageProvider`) con contratos idénticos e intercambiables sin alterar la lógica de negocio.

4. **I - Segregación de Interfaces (ISP):**
   - Custom Hooks específicos (`useGuests`, `useRooms`, `useStays`, `useInvoices`) para evitar componentes monolíticos y optimizar el ciclo de renderizado.

5. **D - Inversión de Dependencias (DIP):**
   - La capa de presentación y los servicios dependen de abstracciones (Repositorios/Servicios), desacoplados de la base de datos o almacenamiento físico.

---

## Estructura Modular del Proyecto (`src/`)

```text
hotel-billing-system/
├── index.html                  # HTML base con fuentes Inter
├── package.json                # Dependencias y scripts
├── vite.config.js              # Configuración de Vite
├── tailwind.config.js          # Tokens de diseño y colores
├── postcss.config.js           # PostCSS
├── .env.example                # Plantilla de variables de entorno
├── .env                        # Variables locales
├── supabase_schema.sql         # Script SQL con DDL, restricciones y datos semilla
└── src/
    ├── main.jsx                # Punto de entrada de React
    ├── App.jsx                 # Orquestador principal de estado y rutas
    ├── index.css               # Directivas de Tailwind y estilos de impresión
    ├── context/
    │   └── AuthContext.jsx     # Contexto de roles (Recepción / Gerencia)
    ├── validators/             # Capa de Validaciones Puras (SRP & OCP)
    │   ├── ValidationResult.js # Encapsulación estándar de respuestas
    │   ├── documentValidators.js # C.I. (7-8 dígitos) y NIT (9-13 dígitos)
    │   ├── stayValidators.js   # Rango de fechas (mínimo 1 día) y tarifas
    │   └── guestValidator.js   # Validación integral HU01
    ├── repositories/           # Capa de Acceso a Datos (LSP & DIP)
    │   ├── storageContract.js
    │   ├── localStorageProvider.js
    │   ├── supabaseStorageProvider.js
    │   ├── guestRepository.js
    │   ├── roomRepository.js
    │   ├── stayRepository.js
    │   └── invoiceRepository.js
    ├── services/               # Capa de Dominio y Lógica Fiscal (SRP & DIP)
    │   ├── fiscalService.js    # IVA (13%), IT (3%), código control, CSV SIN
    │   ├── guestService.js     # Lógica HU01
    │   ├── roomService.js      # Catálogo e inventario
    │   ├── stayService.js      # Check-in y cálculo reactivo en tiempo real HU02/HU03
    │   └── billingService.js   # Emisión y anulación fiscal
    ├── hooks/                  # Custom Hooks Específicos (ISP)
    │   ├── useGuests.js
    │   ├── useRooms.js
    │   ├── useStays.js
    │   └── useInvoices.js
    ├── components/
    │   ├── guests/
    │   │   ├── GuestModal.jsx  # Modal HU01 con validación reactiva
    │   │   └── GuestTable.jsx  # Tabla de directorio de huéspedes
    │   ├── stays/
    │   │   ├── CheckinModal.jsx # Formulario modal HU02 / HU03
    │   │   ├── CheckoutConfirmModal.jsx # Confirmación de salida y emisión
    │   │   ├── StayCalculationCard.jsx  # Tarjeta reactiva de subtotal instantáneo
    │   │   └── StayTable.jsx   # Tabla de historial y activas
    │   ├── invoices/
    │   │   ├── InvoiceTable.jsx # Historial de facturas y acciones
    │   │   └── CancelInvoiceModal.jsx # Motivo fiscal de anulación obligatorio
    │   ├── reports/
    │   │   └── FiscalKpis.jsx  # Métricas tributarias (IVA, IT, Recaudación)
    │   ├── Navbar.jsx          # Barra de navegación
    │   ├── Sidebar.jsx         # Menú lateral
    │   ├── Layout.jsx          # Shell visual
    │   ├── ProtectedRoute.jsx  # Guardián de rutas por rol
    │   ├── StatusBadge.jsx     # Badges de estado con código de color
    │   └── InvoiceModal.jsx    # Factura oficial lista para impresión
    └── pages/
        ├── DashboardPage.jsx   # Panel general con KPIs
        ├── HuespedesPage.jsx   # HU01: Directorio y registro
        ├── HabitacionesPage.jsx# HU02: Catálogo y tarifas
        ├── HospedajesPage.jsx  # HU02/HU03: Check-in reactivo
        ├── FacturasPage.jsx    # Emisión y anulación fiscal
        ├── ReportesPage.jsx    # Vista contable / impositiva (Gerencia)
        └── LoginPage.jsx       # Selector de perfiles
```

---

## Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

