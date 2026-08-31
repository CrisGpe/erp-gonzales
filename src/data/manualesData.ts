export interface ManualDoc {
  id: string;
  numero: string;
  rol: string;
  titulo: string;
  subtitulo: string;
  icono: string;
  audiencia: string;
  nivelAcceso: number;
  filosofia: string;
  checklists: {
    titulo: string;
    items: string[];
  }[];
  modulosClave: {
    nombre: string;
    descripcion: string;
    pasos: string[];
  }[];
  videoUrlPlaceholder?: string;
  duracionEstimadaMin: number;
}

export const MANUALES_DATA: ManualDoc[] = [
  {
    id: "superadmin",
    numero: "01",
    rol: "SUPERADMIN",
    titulo: "Manual del Superadmin (Owner Único)",
    subtitulo: "Control total del SaaS, arquitectura, despliegues y provisión de sedes",
    icono: "👑",
    audiencia: "Owner / Creador del Proyecto (Exclusivo)",
    nivelAcceso: 100,
    filosofia: "El Superadmin tiene las llaves maestras del sistema. No se involucra en la microgestión de mostrador; su rol es aprovisionar sedes, crear usuarios Admin y monitorear la salud global del ecosistema.",
    checklists: [
      {
        titulo: "Checklist de Despliegue & Mantenimiento",
        items: [
          "Verificar estado de conexión y cuotas en Supabase PostgreSQL",
          "Auditar logs en /dev para descartar intentos de fuerza bruta (AUTH) o descuadres (CAJA)",
          "Validar variables de entorno en Vercel antes de cada versión",
          "Respaldar estructura relacional de 43 tablas maestras"
        ]
      }
    ],
    modulosClave: [
      {
        nombre: "Aprovisionamiento Jerárquico de Sedes",
        descripcion: "Carga masiva de datos en 3 niveles estrictos usando el Libro Maestro de Excel.",
        pasos: [
          "Descargar la plantilla maestra de 15 hojas en /dev",
          "Importar Nivel 1 (Sedes, Clientes, Roles, Emisores)",
          "Importar Nivel 2 (Agentes, Bienes, Ubicaciones, Cuentas)",
          "Importar Nivel 3 (Pasarelas, Esquemas, Inventario, Asignaciones Multi-Sede)"
        ]
      },
      {
        nombre: "Creación de Administradores de Sede",
        descripcion: "Dar de alta a los líderes operativos de sucursal.",
        pasos: [
          "Acceder a /admin/usuarios",
          "Crear usuario con rol ADMIN",
          "Asignar la(s) sede(s) que gestionará",
          "Generar PIN administrativo inicial"
        ]
      }
    ],
    duracionEstimadaMin: 8
  },
  {
    id: "admin",
    numero: "02",
    rol: "ADMIN",
    titulo: "Manual del Administrador de Sede",
    subtitulo: "Gobernanza operativa, finanzas, cuentas por pagar y matriz de delegación",
    icono: "🏢",
    audiencia: "Administradores de Sede, Gerentes Operativos, Jefes de Operaciones",
    nivelAcceso: 80,
    filosofia: "El Administrador gestiona el día a día del negocio. Es el único que da de alta a Soporte y Staff, y desbloquea herramientas a Soporte según la curva de madurez del colaborador.",
    checklists: [
      {
        titulo: "Checklist de Apertura Matutina",
        items: [
          "Verificar saldo de apertura de Caja Chica en mostrador (ej. S/ 500.00)",
          "Revisar facturas de compras a crédito por vencer (15, 30, 45, 60 días)",
          "Conciliar lotes de pasarelas POS D+1 contra abonos bancarios",
          "Validar dotación de personal disponible en el semáforo WFM"
        ]
      },
      {
        titulo: "Checklist de Cierre de Jornada",
        items: [
          "Auditar los arqueos ciegos entregados por el personal de caja",
          "Revisar la bandeja del cuadre del día y gastos menores aceptados",
          "Generar liquidaciones de comisiones para el personal Staff",
          "Evaluar desempeño para habilitar nuevas herramientas en la matriz"
        ]
      }
    ],
    modulosClave: [
      {
        nombre: "Matriz de Delegación Quirúrgica",
        descripcion: "Activar herramientas operativas a colaboradores de Soporte en 1-clic.",
        pasos: [
          "Ir a Sistema ➔ Usuarios y ubicar al colaborador de Soporte",
          "Habilitar 'Arqueo Ciego de Caja' tras superar el período de prueba",
          "Habilitar 'Control de Inventario & Kardex' para recepción física de compras",
          "Habilitar 'Gestión Avanzada de Agenda & CRM' o 'Supervisión WFM'"
        ]
      },
      {
        nombre: "Cuentas por Pagar & Calendario de Facturas",
        descripcion: "Control de compromisos a proveedores de insumos y mercadería.",
        pasos: [
          "Registrar factura de compra indicando condición de crédito (15/30/45/60d)",
          "Monitorear semáforo de vencimientos en /finanzas",
          "Efectuar pagos parciales o totales vinculando la cuenta bancaria de egreso"
        ]
      }
    ],
    duracionEstimadaMin: 12
  },
  {
    id: "soporte",
    numero: "03",
    rol: "SOPORTE",
    titulo: "Manual del Rol Soporte & Workspaces",
    subtitulo: "El anfitrión de baja fricción: Recepción, Venta/Caja, Taller y Herramientas",
    icono: "🤝",
    audiencia: "Todo el Personal de Apoyo a la Operación (Recepción, Caja, Taller)",
    nivelAcceso: 30,
    filosofia: "En Vaikuntha ERP no hay departamentos aislados. Todo el equipo de apoyo es Soporte. Para que un nuevo contratado genere valor en su primer día, opera en Workspaces limpios de baja fricción.",
    checklists: [
      {
        titulo: "Protocolo de Recepción & Bienvenida",
        items: [
          "Buscar al cliente por DNI o Celular en menos de 400ms",
          "Si es nuevo, registrar en 20 segundos con DNI y Nombre (+100 VP)",
          "Crear ticket OATC seleccionando servicio, sillón y especialista",
          "Monitorear tiempos de espera en sala para ofrecer cortesías"
        ]
      },
      {
        titulo: "Protocolo de Caja POS & Cobro",
        items: [
          "Seleccionar ticket OATC enviado a pre-cobro por el especialista",
          "Procesar cobro multi-método (Efectivo, Tarjeta, Yape)",
          "Verificar el cálculo automático de vuelto en pantalla gigante",
          "Emitir Boleta/Factura SUNAT y confirmar liberación en cascada"
        ]
      }
    ],
    modulosClave: [
      {
        nombre: "Workspace Recepción (/recepcion)",
        descripcion: "Lienzo de anfitrionaje para check-in rápido y monitoreo WFM.",
        pasos: [
          "Ingresar con PIN de 4 dígitos",
          "Check-in VIP con visualización de puntos de lealtad",
          "Asignación de sillón libre según semáforo en tiempo real"
        ]
      },
      {
        nombre: "Workspace Venta & POS (/caja)",
        descripcion: "Terminal de cobro ágil con emisión de comprobantes SUNAT PSE.",
        pasos: [
          "Cargar cuenta con servicios e insumos retail cruzados",
          "Procesar pago dividido (Split-billing)",
          "Liberación automática de sillón y especialista tras el pago"
        ]
      },
      {
        nombre: "Workspace Taller & Balanza IoT (/lab)",
        descripcion: "Despacho metrológico de tintes y recepción física de facturas.",
        pasos: [
          "Recibir pedido digital enviado por el colorista desde su móvil",
          "Tarar el bowl en la balanza electrónica a 0.0g",
          "Servir tinte y oxidante con precisión milimétrica y despachar"
        ]
      }
    ],
    duracionEstimadaMin: 15
  },
  {
    id: "staff",
    numero: "04",
    rol: "STAFF",
    titulo: "Manual del Especialista Staff (Suite Móvil)",
    subtitulo: "Operación en sillón desde smartphone/tablet: órdenes, insumos y comisiones",
    icono: "💈",
    audiencia: "Especialistas de Servicio (Coloristas, Estilistas, Terapeutas, Técnicos)",
    nivelAcceso: 20,
    filosofia: "El especialista no pierde tiempo en computadoras de mostrador. Trabaja directo en su teléfono o tablet: atiende órdenes de atención, pide insumos al laboratorio y liquida sus comisiones.",
    checklists: [
      {
        titulo: "Rutina Diaria en Estación",
        items: [
          "Marcar asistencia WFM con PIN o tarjeta Web NFC para figurar DISPONIBLE",
          "Recibir alerta háptica/sonora cuando recepción asigne una clienta",
          "Consultar ficha técnica capilar y notas de preferencia del cliente",
          "Finalizar servicio y enviar cuenta a pre-cobro con un solo toque"
        ]
      }
    ],
    modulosClave: [
      {
        nombre: "Gestión de Órdenes OATC & Tickets Anidados",
        descripcion: "Upselling y colaboración fluida en piso.",
        pasos: [
          "Iniciar atención activa y activar cronómetro de pose química",
          "Anidar ticket de servicio adicional (ej. tratamiento capilar)",
          "Solicitar apoyo a un colega (asistente de lavado o secado)"
        ]
      },
      {
        nombre: "Pedidos al Laboratorio & Bar",
        descripcion: "Insumos exactos sin moverse del sillón.",
        pasos: [
          "Presionar 'Pedir Insumos' y seleccionar tinte y gramos",
          "Recibir notificación cuando el bowl esté pesado y despachado",
          "Pedir cortesías al bar para la clienta (café, infusiones)"
        ]
      },
      {
        nombre: "Portal Móvil de Liquidación (/mobile/liquidacion)",
        descripcion: "Transparencia absoluta de comisiones y propinas.",
        pasos: [
          "Visualizar servicios acumulados y porcentaje de comisión en vivo",
          "Solicitar pago en caja si su régimen contempla liquidación diaria",
          "Revisar historial de pagos y recibos emitidos"
        ]
      }
    ],
    duracionEstimadaMin: 10
  },
  {
    id: "kiosk",
    numero: "05",
    rol: "KIOSK",
    titulo: "Manual del Tótem Kiosko Dedicado",
    subtitulo: "Autoservicio para lobby y marcación ultrarrápida de colaboradores",
    icono: "🖥️",
    audiencia: "Anfitriones, Clientes VIP y Personal de Sede",
    nivelAcceso: 0,
    filosofia: "Si la sede invierte en el tótem físico de 21\", este eleva la percepción del local a categoría cinco estrellas y resuelve el cuello de botella en recepción durante horas pico.",
    checklists: [
      {
        titulo: "Mantenimiento & Higiene del Tótem",
        items: [
          "Verificar encendido y carga en pantalla completa en /kiosk",
          "Limpiar el cristal con paño de microfibra desinfectante",
          "Verificar nivel de audio óptimo para alertas de bienvenida",
          "Comprobar retorno automático a pantalla de inicio tras 30s de inactividad"
        ]
      }
    ],
    modulosClave: [
      {
        nombre: "Check-in Express por DNI",
        descripcion: "La clienta anuncia su llegada y toma turno en 10 segundos.",
        pasos: [
          "Tocar 'Anunciar mi Llegada' y digitar DNI",
          "Verificación instantánea de cita y saludo personalizado",
          "Notificación automática a recepción y al móvil del estilista"
        ]
      },
      {
        nombre: "Bar de Cortesía & Puntos",
        descripcion: "Experiencia de hospitalidad desde el primer minuto.",
        pasos: [
          "Seleccionar bebida de cortesía (café espresso, infusiones)",
          "Consultar pasaporte de Vaikuntha Points 💎 acumulados",
          "Descubrir beneficios exclusivos del siguiente nivel VIP"
        ]
      },
      {
        nombre: "Modo Staff para Marcación WFM con PIN",
        descripcion: "Asistencia sin colas en terminal de mostrador.",
        pasos: [
          "Tocar ícono discreto 'Acceso Colaboradores' en esquina",
          "Digitar PIN de 4 dígitos o acercar tarjeta NFC",
          "Pulsar Entrada, Refrigerio o Salida y auto-retorno en 3s"
        ]
      }
    ],
    duracionEstimadaMin: 6
  },
  {
    id: "cliente",
    numero: "06",
    rol: "CLIENTE",
    titulo: "Manual del Portal Cliente (Web & Móvil)",
    subtitulo: "Autogestión de citas, seguimiento de orden en vivo e historial",
    icono: "👤",
    audiencia: "Clientes Finales, Pacientes y Usuarios de Salón/Spa",
    nivelAcceso: 0,
    filosofia: "El rol Cliente es una interfaz técnica de autoservicio que no exige recordar contraseñas difíciles. Permite reservar citas online, ver el estado de su atención y descargar sus boletas electrónicas.",
    checklists: [
      {
        titulo: "Autogestión del Consumidor",
        items: [
          "Acceso sin contraseña mediante DNI + enlace mágico",
          "Reserva de citas 24/7 eligiendo sede, servicio y especialista",
          "Seguimiento en tiempo real de su orden y tiempos de pose capilar",
          "Descarga de comprobantes electrónicos (PDF/XML) emitidos por SUNAT"
        ]
      }
    ],
    modulosClave: [
      {
        nombre: "Agendamiento Inteligente Online (/citas)",
        descripcion: "Disponibilidad real sincronizada con la agenda del salón.",
        pasos: [
          "Seleccionar sede más cercana y profesional favorito",
          "Elegir bloque horario garantizado sin sobrecupos",
          "Confirmación inmediata por WhatsApp con recordatorio automático"
        ]
      },
      {
        nombre: "Seguimiento en Vivo del Servicio",
        descripcion: "Transparencia total de cuenta y tiempos.",
        pasos: [
          "Escanear QR en sillón para ver servicios activos",
          "Consultar minutos restantes de pose de coloración",
          "Ver saldo de puntos ganados con la visita actual"
        ]
      }
    ],
    duracionEstimadaMin: 5
  }
];
