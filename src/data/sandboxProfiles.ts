export interface SandboxProfile {
  id: string;
  rolCodigo: string;
  titulo: string;
  subtitulo: string;
  badge: string;
  badgeColor: string;
  descripcion: string;
  responsabilidades: string[];
  dispositivo: string;
  rutaDemo: string;
  loginRapido: {
    email: string;
    rol: string;
  };
}

export const ERP_BASE_URL = "https://vercel-sup-b-corp-gonzales.vercel.app";

export const SANDBOX_PROFILES: SandboxProfile[] = [
  {
    id: "admin",
    rolCodigo: "ADMIN",
    titulo: "Administrador de Sede",
    subtitulo: "Liderazgo operativo, compras a crédito y supervisión de piso",
    badge: "Control Integral",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    descripcion: "Gestiona las finanzas de la sede, calendarios de facturas por pagar (15 a 60 días), conciliación de pasarelas POS D+1 y la Matriz de Delegación de Herramientas para Soporte.",
    responsabilidades: [
      "Alta de personal Soporte y Staff con asignación de sede principal",
      "Matriz de Delegación de Herramientas (arqueo, inventario, CRM, WFM)",
      "Gestión de tesorería y facturas de compras a crédito",
      "Conciliación de lotes POS en tránsito y liquidaciones de staff"
    ],
    dispositivo: "Escritorio / Laptop",
    rutaDemo: `${ERP_BASE_URL}/admin`,
    loginRapido: {
      email: "martin.admin@vaikuntha.pe",
      rol: "ADMIN"
    }
  },
  {
    id: "soporte",
    rolCodigo: "SOPORTE",
    titulo: "Personal de Soporte & Workspaces",
    subtitulo: "El anfitrión multifuncional de baja fricción",
    badge: "Baja Fricción",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    descripcion: "Resuelve el dolor de la alta rotación. Opera a través de Workspaces diarios con mínima fricción (Recepción, Venta/POS, Taller) y va desbloqueando herramientas según madurez.",
    responsabilidades: [
      "Workspace Recepción: Saludo, búsqueda en <400ms y apertura de tickets OATC",
      "Workspace Venta: Cobro split-billing, cálculo de vuelto y emisión de CPEs SUNAT",
      "Workspace Taller: Despacho de insumos en balanza IoT con tara en gramos",
      "Drawer de Operaciones: Registro de gastos menores y adelantos de caja"
    ],
    dispositivo: "PC Touch Mostrador / Tablet Mostrador",
    rutaDemo: `${ERP_BASE_URL}/recepcion`,
    loginRapido: {
      email: "luciana.salazar@vaikuntha.pe",
      rol: "SOPORTE"
    }
  },
  {
    id: "staff",
    rolCodigo: "STAFF",
    titulo: "Especialista Staff Operativo",
    subtitulo: "El motor productivo del servicio directo",
    badge: "Móvil PWA",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    descripcion: "Atiende desde su smartphone personal o tablet de estación. Recibe alertas sonoras, anida tickets adicionales, solicita fórmulas al laboratorio y pre-cobra sin papel.",
    responsabilidades: [
      "Marcación de asistencia WFM con PIN o tarjeta Web NFC",
      "Recepción de órdenes OATC con cronómetro y ficha técnica del cliente",
      "Anidación de tickets adicionales (upselling) y apoyo entre colegas",
      "Solicitud de mezclas químicas en gramos exactos al laboratorio"
    ],
    dispositivo: "Smartphone Personal (PWA) / Tablet",
    rutaDemo: `${ERP_BASE_URL}/mobile/operacion`,
    loginRapido: {
      email: "jean.pierre@vaikuntha.pe",
      rol: "STAFF"
    }
  },
  {
    id: "kiosk",
    rolCodigo: "KIOSK",
    titulo: "Tótem Kiosko Dedicado",
    subtitulo: "Autoservicio para el lobby y marcación de colaboradores",
    badge: "Hardware Opcional",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    descripcion: "Terminal interactiva vertical de 21\". Ofrece bienvenida premium con check-in express por DNI, cortesías del bar, pasaporte de puntos y marcación rápida de staff.",
    responsabilidades: [
      "Check-in express de clientes por DNI en 20 segundos",
      "Solicitud de bebidas de cortesía (café, infusiones, agua mineral)",
      "Consulta de saldo y canje de Vaikuntha Points 💎",
      "Modo Staff seguro con PIN de 4 dígitos para entrada y refrigerio"
    ],
    dispositivo: "Tótem Táctil 21\" / Tablet Pedestal",
    rutaDemo: `${ERP_BASE_URL}/kiosk`,
    loginRapido: {
      email: "kiosk.miraflores@vaikuntha.pe",
      rol: "KIOSKO"
    }
  },
  {
    id: "superadmin",
    rolCodigo: "SUPERADMIN",
    titulo: "Superadmin (Owner Único)",
    subtitulo: "Control central de arquitectura y gobernanza multi-sede",
    badge: "Owner / Núcleo",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    descripcion: "El creador y dueño del proyecto. Acceso a la consola de desarrollo /dev, auditoría en tiempo real de logs del sistema y aprovisionamiento jerárquico de sedes.",
    responsabilidades: [
      "Aprovisionamiento global de sedes mediante el Kit Maestro de Excel (15 hojas)",
      "Creación exclusiva de administradores de sede (ADMIN)",
      "Monitoreo de logs en vivo (AUTH, CAJA, WFM, FINANZAS, OPERACION)",
      "Control de migraciones PostgreSQL y variables de entorno"
    ],
    dispositivo: "Estación de Trabajo / Laptop",
    rutaDemo: `${ERP_BASE_URL}/dev`,
    loginRapido: {
      email: "cristian.owner@vaikuntha.pe",
      rol: "SUPERADMIN"
    }
  }
];
