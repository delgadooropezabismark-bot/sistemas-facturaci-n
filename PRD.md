Product Requirements Document (PRD): Sistema de Facturación Hotelera
1. Visión
Objetivo del MVP
El objetivo de este Producto Mínimo Viable (MVP) es digitalizar y automatizar el proceso de facturación de un establecimiento hotelero en un plazo de 2 semanas. Se busca sustituir el registro manual por una solución digital que garantice la integridad de los datos fiscales y elimine los errores de cálculo en un 90%.
Usuarios
Personal de Recepción: Responsable de la entrada de datos, registro de huéspedes y emisión de facturas en el check-out.
Gerencia / Área Contable: Usuario que consulta reportes de ingresos e historial de facturación para la gestión administrativa.
Problema que resuelve
Actualmente, el hotel opera con procesos manuales (cuadernos y hojas de cálculo), lo que deriva en:
Errores frecuentes en montos de facturación.
Datos fiscales de clientes incorrectos o incompletos.
Demoras excesivas en la entrega de facturas al cliente.
Dificultad para consolidar reportes de ingresos fiables para impuestos.
2. Stack Tecnológico
Se recomienda el siguiente stack para cumplir con el despliegue en 2 semanas:
Frontend: React: Permite crear una interfaz reactiva y basada en componentes, facilitando la validación de formularios en tiempo real.
Estilos: Tailwind CSS: Agiliza el diseño de la interfaz mediante utilidades predefinidas, asegurando un look profesional y responsive sin invertir tiempo excesivo en CSS personalizado.
Backend & Base de Datos: Supabase: Ofrece una base de datos PostgreSQL robusta, autenticación integrada y APIs automáticas (BaaS). Es ideal para este proyecto porque elimina la necesidad de configurar un servidor backend desde cero, permitiendo centrarse en la lógica de negocio.
3. Modelo de Datos
Basado en el diseño de arquitectura y diccionario de datos del proyecto:
Tabla: huésped
Atributo	Tipo	Restricciones
id_huesped	INT	PK, Autoincremental
ci_nit	VARCHAR(15)	UNIQUE, No Nulo
tipo_documento	VARCHAR(4)	'CI' o 'NIT'
nombre_completo	VARCHAR(100)	No Nulo
razon_social	VARCHAR(100)	Nulo (Opcional)
telefono	VARCHAR(20)	Nulo (Opcional)
direccion	VARCHAR(200)	Nulo (Opcional)
fecha_registro	DATE	No Nulo (Default: Actual)
Tabla: habitación
Atributo	Tipo	Restricciones
id_habitacion	INT	PK, Autoincremental
numero	VARCHAR(10)	UNIQUE, No Nulo
tipo	VARCHAR(30)	Nulo (Opcional)
tarifa_base	DECIMAL(10,2)	No Nulo, > 0
estado	VARCHAR(15)	No Nulo (Disponible/Ocupada)
Tabla: hospedaje
Atributo	Tipo	Restricciones
id_hospedaje	INT	PK, Autoincremental
id_huesped	INT	FK -> huésped
id_habitacion	INT	FK -> habitación
fecha_entrada	DATE	No Nulo
fecha_salida	DATE	No Nulo
tarifa_diaria_aplicada	DECIMAL(10,2)	No Nulo
dias	INT	No Nulo, >= 1
subtotal	DECIMAL(12,2)	No Nulo
estado	VARCHAR(15)	No Nulo (Pendiente/Finalizado)
Tabla: factura
Atributo	Tipo	Restricciones
id_factura	INT	PK, Autoincremental
id_hospedaje	INT	FK -> hospedaje (1:1)
fecha_emision	DATETIME	No Nulo (Default: Actual)
monto_total	DECIMAL(12,2)	No Nulo
nit_emisor	VARCHAR(15)	No Nulo (Fijo)
nombre_emisor	VARCHAR(100)	No Nulo (Fijo)
codigo_control	VARCHAR(50)	Nulo (Según normativa)
estado	VARCHAR(15)	No Nulo (Emitida/Anulada)
4. Reglas de Negocio
Validación de Identidad:
CI: Debe contener entre 7 y 8 dígitos numéricos únicamente.
NIT: Debe contener entre 9 y 13 dígitos numéricos únicamente.
Lógica de Fechas: La fecha de salida debe ser estrictamente posterior a la fecha de entrada.
Cálculo de Estancia:
Los días de hospedaje se calculan automáticamente (salida - entrada).
El mínimo de días a cobrar es siempre 1, incluso si el check-out es el mismo día.
Finanzas: La tarifa diaria debe ser siempre mayor a 0. El subtotal es el producto de dias * tarifa_diaria_aplicada.
Normativa de Facturación (Bolivia):
Toda factura debe incluir el NIT del hotel emisor y un número secuencial correlativo.
Debe registrarse la fecha y hora exacta de emisión.
El monto total debe reflejar el subtotal más impuestos aplicables según ley.
El sistema debe permitir marcar una factura como "Emitida" o "Anulada".
5. Backlog del MVP (Historias de Usuario)
HU01: Registrar huésped con validación de documento
Como recepcionista, quiero registrar los datos personales de un huésped, para que la información fiscal sea correcta antes de iniciar el hospedaje.
Criterios de Aceptación:
El sistema debe obligar a llenar "Nombre Completo" y "CI/NIT".
Si el formato de CI/NIT no cumple las reglas (longitud o caracteres no numéricos), el sistema debe bloquear el guardado y mostrar una alerta.
HU02: Registrar habitación, fechas y tarifa
Como recepcionista, quiero asignar una habitación y un rango de fechas a un huésped, para establecer las condiciones del servicio.
Criterios de Aceptación:
El sistema debe permitir seleccionar una habitación disponible.
Se deben ingresar fechas de entrada y salida.
La tarifa puede ser editada manualmente sobre la base, pero nunca ser 0 o negativa.
HU03: Calcular días y subtotal automáticamente
Como sistema, quiero calcular el tiempo de estadía y el monto acumulado, para evitar errores humanos en la cuenta final.
Criterios de Aceptación:
Al cambiar las fechas, el campo "Días" debe actualizarse automáticamente.
El subtotal debe refrescarse inmediatamente si cambian los días o la tarifa.
El cálculo debe ser visible para el recepcionista antes de confirmar el registro.


## 7. Marco Legal y Ética de Datos

El presente sistema se diseña y opera en estricto cumplimiento del marco normativo vigente en el Estado Plurinacional de Bolivia:

### Habeas Data (Constitución Política del Estado — Art. 130)
El usuario titular de los datos personales tiene garantizado el **derecho de acceso, rectificación, actualización y eliminación** de su información personal almacenada en el sistema:

-  **Acceso:** El huésped puede solicitar copia de todos sus datos registrados (nombre, CI/NIT, teléfono, direcciones, historial de estancias y facturas emitidas a su nombre).
-  **Rectificación y Actualización:** El usuario puede solicitar corrección de datos incorrectos, desactualizados o incompletos.
-  **Eliminación:** El usuario puede solicitar la eliminación de sus datos personales, salvo aquella información que por disposición legal deba conservarse por plazos fiscales o tributarios.
-  **Mecanismo:** Las solicitudes se atienden mediante solicitud escrita al administrador del sistema, sin formalidades excesivas y sin costo para el titular.

###  Ley N° 164 de Telecomunicaciones, Tecnologías de Información y Comunicación
El sistema adopta los principios y estándares de la Ley 164:

-  **Neutralidad Tecnológica:** No se impone tecnología propietaria exclusiva; el sistema se basa en estándares abiertos (HTML, JavaScript, SQL).
-  **Seguridad de la Información:** Se protegen los datos personales y financieros mediante protocolos de cifrado en tránsito (HTTPS/TLS).
-  **Autenticidad e Integridad:** Se prevé la implementación de firma digital certificada conforme a normativa boliviana para la emisión y almacenamiento de facturas electrónicas.
-  **Interoperabilidad:** La factura se genera en formato estructurado que facilita su integración con sistemas fiscales oficiales.

###  Seguridad y Normativa ASFI (Principios Aplicables)
Aunque el sistema no es regulado directamente por ASFI, se aplican sus mejores prácticas de protección de datos financieros:

-  **Confidencialidad:** Datos sensibles (CI/NIT, montos, números de habitación) se protegen con control de acceso por roles.
-  **Encriptación:** Los campos sensibles se almacenan mediante técnicas de cifrado. Las contraseñas NUNCA se guardan en texto plano, se almacenan como valor hash irreversible.
-  **Registro de Eventos (Logs):** Se implementa una tabla de `logs_auditoría` que registra **quién accede, a qué datos, cuándo y qué operación realizó**, quedando dicho registro inalterable.
-  **Control de Accesos:** Solo usuarios autenticados pueden operar en el sistema. Cada factura queda identificada con el usuario que la emitió.
-  **Conservación:** Los registros de facturación y auditoría se conservan por el plazo legal establecido (5 años para efectos tributarios).

### Código Penal — Artículo 363 ter (Protección de Datos)
-  Se previene el **acceso indebido** ajenos al sistema mediante autenticación obligatoria.
-  Se protegen los datos contra alteración, destrucción o divulgación no autorizada.
-  Se establece que toda persona que acceda, intercepte, altere o divulgue datos sin autorización legítima se expone a responsabilidad penal conforme al Art. 363 ter del Código Penal Boliviano.
