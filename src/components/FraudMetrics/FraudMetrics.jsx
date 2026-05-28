// Este pinta las 4 metricas/graficas del dashboard
import { arc, pie } from "d3"; // pie calcula los ángulos de cada trozo del donut. arc convierte esos ángulos en una forma SVG
import "bootstrap-icons/font/bootstrap-icons.css";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../BooleanDonutChart/Tooltip"; // Importa componentes para mostrar un tooltip cuando pasas el ratón por encima de cada sector

const compactFormatter = new Intl.NumberFormat("es-ES"); // formatear números en formato español

// Objeto con estilos reutilizables. pill son las clases del texto tipo etiqueta. fill es el color de relleno de la barra
const toneClasses = {
  red: {
    pill: "bg-[#f8e7e4] text-[#a83a32]",
    fill: "bg-[#a83a32]",
  },
  orange: {
    pill: "bg-[#f7e1d3] text-[#ad5d26]",
    fill: "bg-[#d56b45]",
  },
  green: {
    pill: "bg-[#edf4dc] text-[#5f8738]",
    fill: "bg-[#72983f]",
  },
  mint: {
    pill: "bg-[#e5f3ed] text-[#4f9072]",
    fill: "bg-[#dfeee8]",
  },
};

// Color del borde izquierdo de cada tarjeta
const cardClasses = {
  impact: "border-l-[#b7791f]",
  crossBorder: "border-l-[#5944c8]",
  destination: "border-l-[#b45309]",
  device: "border-l-[#337a5b]",
};

// Importe de una transacción
function getAmount(transaction) {
  return Number(transaction.importe_transaccion ?? transaction.importe ?? 0);
}

// Convierte valores tipo booleano a true o false
function readFlag(value) {
  return value === true || value === 1 || value === "1";
}

// Comprueba si un valor existe. Devuelve false si es null o undefined
function hasValue(value) {
  return value !== null && value !== undefined;
}

// Saber si una transacción es fraude
function isFraud(transaction) {
  if (hasValue(transaction.prediction?.is_fraud)) return readFlag(transaction.prediction.is_fraud); // Existe o no
  if (hasValue(transaction.is_fraud)) return readFlag(transaction.is_fraud); // Si no existe mira en transaction.is_fraud
  return Number(transaction.prediction?.prob_fraud ?? transaction.prob_fraud ?? 0) >= 0.7; // Si no existe is_fraud, usa la probabilidad. Si prob_fraud >= 0.7(70%), considera que es fraude. Es decir: 70% o más = fraude
}

// Calcula si el fraude es bajo, medio o alto
function getImpactLevel(transaction) {
  const impact = transaction.prediction?.impacto_fraude ?? transaction.impacto_fraude; // Busca el campo impacto_fraude. Primero dentro de prediction. Luego directamente en la transacción.
  if (hasValue(impact)) return Number(impact); // Si existe lo devuelve como número

  const amount = getAmount(transaction); // Si no existe impacto_fraude, calcula el impacto usando el importe
  if (amount > 2000) return 3; // 3 = alto > 2000
  if (amount > 500) return 2; // 2 = medio > 500
  return 1; // 1 = bajo <= 500
}

// Devuelve true si la transacción es transfronteriza. Usa es_transfronteriza
function isCrossBorder(transaction) {
  return readFlag(transaction.prediction?.es_transfronteriza ?? transaction.es_transfronteriza);
}

// Devuelve true si el destino está marcado como alto riesgo
function isHighRiskDestination(transaction) {
  return readFlag(transaction.destino_alto_riesgo);
}

// Comprueba si el dispositivo no era reconocido
function isUnknownDevice(transaction) {
  const value = transaction.dispositivo_reconocido;

  if (value === false) return true; // false = no reconocido
  if (value === true) return false; // true = reconocido
  if (value === 1 || value === "1") return true; // 1 = dispositivo no reconocido
  if (value === 0 || value === "0") return false; // 0 = dispositivo reconocido

  return false; // Si no sabe interpretarlo devuelve false
}

// Calcula porcentaje
function getPercent(value, total) {
  if (!total) return 0; // Si total es 0 devuelve 0 para evitar errores
  return Math.round((value / total) * 100);
}

// Componente reutilizable para cada tarjeta
function MetricCard({ tone, children }) { // tone -> saber el color. children -> contenido de dentro
  return (
    // Crea tarjeta 
    <article
      className={`min-h-[190px] rounded-lg border border-l-4 border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--color-border-dark)] hover:shadow-md sm:p-6 ${cardClasses[tone]}`}  // cardClasses[tone] -> para poner el borde izquierdo según el tipo
    >
      {children}
    </article>
  );
}

// Componente para el encabezado de cada tarjeta
function MetricHeader({ icon, title }) {
  return (
    <div className="mb-1 flex items-center gap-1 text-[var(--color-text-muted)]">
      <i className={`bi ${icon} inline-flex text-[0.95rem] leading-none`} aria-hidden="true" />
      <h3 className="text-[0.95rem] font-bold">{title}</h3>
    </div>
  );
}

// Crea una etiqueta tipo pastilla. Por defecto usa tono rojo
function Pill({ children, tone = "red" }) {
  return (
    // Pinta el contenido con colores según el tono
    <span className={`inline-flex min-h-[1.35rem] items-center rounded-full px-2 py-0.5 text-xs font-bold leading-tight ${toneClasses[tone].pill}`}>
      {children}
    </span>
  );
}

// Componente para pintar una barra horizontal
function MiniBar({ label, value, max, tone = "red" }) {
  // Calcula el ancho de la barra 
  const width = max ? Math.max((value / max) * 100, value > 0 ? 8 : 0) : 0; // El 8 sirve para que una barra pequeña se vea aunque tenga poco valor

  return (
    <div className="grid items-center gap-1 text-sm text-[var(--color-text-main)] min-[560px]:grid-cols-[minmax(7rem,9rem)_minmax(5rem,1fr)_3.25rem] min-[560px]:gap-2">
      <span className={`inline-flex min-h-[1.35rem] items-center rounded-full px-2 py-0.5 text-xs font-bold leading-tight ${toneClasses[tone].pill}`}>
        {label}
      </span>
      <span className="h-2 overflow-hidden rounded-full bg-[#f8f1ee]">
        <span className={`block h-full rounded-full ${toneClasses[tone].fill}`} style={{ width: `${width}%` }} /> {/* La barra se rellena según el porcentaje { width: `${width}%` */}
      </span>
      <strong className="text-sm min-[560px]:justify-self-end">{compactFormatter.format(value)}</strong>
    </div>
  );
}

// Pinta una gráfica donut
function DonutMetric({ value, total, label, remainderLabel = "resto", color, emptyColor = "#eee9fb" }) {
  const percent = getPercent(value, total);
  const radius = 58; // Tamaño donut
  const chartData = [
    { name: label, value, color },
    { name: remainderLabel, value: Math.max(total - value, 0), color: emptyColor },
  ]; // Crea los dos trozos del donut: La parte principal. El resto
  const pieLayout = pie()
    .sort(null) // mantiene el orden
    .value((item) => item.value) // indica qué propiedad usa para calcular el tamaño
    .padAngle(0.03); // deja separación entre trozos
  const arcGenerator = arc()
    .innerRadius(radius * 0.58) // crea el agujero del donut
    .outerRadius(radius) // es el radio exterior
    .cornerRadius(7); // redondea las esquinas
  const arcs = pieLayout(chartData); // Convierte los datos en trozos calculados para SVG

  return (
    <div className="relative grid aspect-square w-full max-w-32 place-items-center" aria-label={`${percent}% ${label}`}>
      {/* Crea el SVG del donut */}
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        role="img"
        aria-label={`${percent}% ${label}`}
        className="h-full w-full overflow-visible"
      >
        {/* Recorre cada trozo del donut */}
        {arcs.map((slice) => (
          <ClientTooltip key={slice.data.name}>
            <TooltipTrigger>
              {/* Dibuja cada trozo */}
              <path
                d={arcGenerator(slice)} // genera el dibujo SVG
                fill={slice.data.color} // pone el color
                className="cursor-pointer transition-opacity hover:opacity-85"
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="font-medium text-[var(--color-text-main)]">
                {slice.data.name}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                {compactFormatter.format(slice.data.value)} txn
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {getPercent(slice.data.value, total)}%
              </div>
            </TooltipContent>
          </ClientTooltip>
        ))}
      </svg>
      <span
        className="pointer-events-none absolute inset-0 grid place-items-center text-center text-xs leading-tight text-[var(--color-text-muted)]"
        aria-hidden="true"
      >
        <span>
          <strong className="block text-base" style={{ color }}>{percent}%</strong>
          {label}
        </span>
      </span>
    </div>
  );
}

function LegendDot({ className }) {
  return <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${className}`} />;
}

// Componente principal
function FraudMetrics({ transactions = [], isLoading = false, error = "" }) {
  const frauds = transactions.filter(isFraud); // Filtra solo las transacciones que son fraude
  const fraudBase = frauds.length ? frauds : transactions; // Si hay fraudes, usa solo fraudes. Si no hay fraudes, usa todas las transacciones. Esto evita que el dashboard se quede vacío
  const totalFrauds = fraudBase.length; // Total de transacciones que se van a analizar

  // Crea los datos para la tarjeta de impacto
  const impactRows = [
    // Cuenta cuántas transacciones son impacto alto 0 3, impacto medio = 2 e impacto bajo = 1
    { label: "Alto >2kEUR", value: fraudBase.filter((transaction) => getImpactLevel(transaction) === 3).length, tone: "red" },
    { label: "Medio >500EUR", value: fraudBase.filter((transaction) => getImpactLevel(transaction) === 2).length, tone: "orange" },
    { label: "Bajo <500EUR", value: fraudBase.filter((transaction) => getImpactLevel(transaction) === 1).length, tone: "green" },
  ];
  const maxImpact = Math.max(...impactRows.map((row) => row.value), 1); // Busca el valor más alto para escalar las barras. Así la barra más grande ocupa el máximo ancho

  const crossBorder = fraudBase.filter(isCrossBorder).length; // Cuenta fraudes transfronterizos
  const local = Math.max(totalFrauds - crossBorder, 0); // Calcula fraudes del mismo país
  const highRiskDestination = fraudBase.filter(isHighRiskDestination).length; // Cuenta fraudes con destino de alto riesgo
  const normalDestination = Math.max(totalFrauds - highRiskDestination, 0); // Calcula destinos normales
  const unknownDevice = fraudBase.filter(isUnknownDevice).length; // Cuenta fraudes con dispositivo desconocido
  const knownDevice = Math.max(totalFrauds - unknownDevice, 0); // Calcula dispositivos reconocidos

  if (isLoading) {
    return <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 text-[var(--color-text-muted)]">Cargando metricas...</p>;
  }

  if (error) {
    return <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 text-[var(--color-text-muted)]">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
      {/* Crea la tarjeta de impacto */}
      <MetricCard tone="impact">
        <MetricHeader icon="bi-bar-chart-line" title="Fraudes por nivel de impacto" />
        <p className="mb-2 flex flex-wrap items-center gap-2 text-[clamp(1.7rem,5vw,2.25rem)] font-extrabold leading-none text-[#a45a1f]">
          {compactFormatter.format(totalFrauds)} <span className="text-base font-bold text-[var(--color-text-main)]">fraudes detectados</span> {/* Muestra el total de fraudes */}
        </p>
        {/* Recorre las filas de impacto y pinta una barra por cada una */}
        <div className="mt-4 grid gap-2">
          {impactRows.map((row) => (
            <MiniBar key={row.label} max={maxImpact} {...row} />
          ))}
        </div>

        <p className="mt-4 text-sm leading-snug text-[var(--color-text-main)]">Clasificado por el importe de la transaccion fraudulenta</p>
      </MetricCard>
      
      {/* Tarjeta de transacciones transfronterizas */}
      <MetricCard tone="crossBorder">
        <MetricHeader icon="bi-globe2" title="Transacciones transfronterizas" />
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <strong className="text-[clamp(2rem,6vw,2.65rem)] leading-none text-[#5944c8]">{getPercent(crossBorder, totalFrauds)}%</strong>{/* Muestra el porcentaje */}
          <Pill>de los fraudes son transfronterizos</Pill>
        </div>
        {/* Pinta el donut */}
        <div className="mt-4 grid items-center gap-4 min-[560px]:grid-cols-[minmax(6.25rem,8rem)_1fr]">
          <DonutMetric value={crossBorder} total={totalFrauds} label="exterior" remainderLabel="mismo pais" color="#5944c8" />
          <ul className="grid gap-1 text-sm text-[var(--color-text-main)]">
            <li className="flex items-center gap-1"><LegendDot className="bg-[#5944c8]" /> Otro pais: {compactFormatter.format(crossBorder)} txn</li>
            <li className="flex items-center gap-1"><LegendDot className="bg-[#eee9fb]" /> Mismo pais: {compactFormatter.format(local)} txn</li>
            <li className="flex items-start gap-1 leading-snug text-[var(--color-text-muted)]">{getPercent(crossBorder, totalFrauds)} de cada 100 fraudes vienen desde otro pais</li>
          </ul>
        </div>
      </MetricCard>

      {/* Tarjeta de destinos sospechosos */}
      <MetricCard tone="destination">
        <MetricHeader icon="bi-exclamation-triangle" title="Destinos de alto riesgo" />
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <strong className="text-[clamp(2rem,6vw,2.65rem)] leading-none text-[#a3482c]">{getPercent(highRiskDestination, totalFrauds)}%</strong> {/* Porcentaje de fraudes con destino de alto riesgo */}
          <Pill>destino sospechoso</Pill>
        </div>
        {/* Pinta dos barras comparativas */}
        <div className="mt-4 grid gap-2">
          <MiniBar label="Destino sospechoso" value={highRiskDestination} max={Math.max(highRiskDestination, normalDestination, 1)} tone="orange" />
          <MiniBar label="Destino normal" value={normalDestination} max={Math.max(highRiskDestination, normalDestination, 1)} tone="mint" />
        </div>
        <p className="mt-4 text-sm leading-snug text-[var(--color-text-main)]">Mas de la mitad de los fraudes detectados van a cuentas destino marcadas como sospechosas</p>
      </MetricCard>

      {/* Tarjeta de dispositivos */}
      <MetricCard tone="device">
        <MetricHeader icon="bi-phone" title="Dispositivos no reconocidos en fraudes" />
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <strong className="text-[clamp(2rem,6vw,2.65rem)] leading-none text-[#337a5b]">{getPercent(unknownDevice, totalFrauds)}%</strong> {/* Porcentaje de dispositivos desconocidos */}
          <Pill>dispositivo desconocido</Pill>
        </div>
        {/* Pinta un donut para comparar -> desconocido vs reconocido */}
        <div className="mt-4 grid items-center gap-4 min-[560px]:grid-cols-[minmax(6.25rem,8rem)_1fr]">
          <DonutMetric value={unknownDevice} total={totalFrauds} label="desconocido" remainderLabel="reconocido" color="#337a5b" emptyColor="#e2f2ea" />
          <ul className="grid gap-1 text-sm text-[var(--color-text-main)]">
            <li className="flex items-center gap-1"><LegendDot className="bg-[#337a5b]" /> No reconocido: {compactFormatter.format(unknownDevice)} txn</li>
            <li className="flex items-center gap-1"><LegendDot className="bg-[#e2f2ea]" /> Reconocido: {compactFormatter.format(knownDevice)} txn</li>
            <li className="flex items-start gap-1 leading-snug text-[var(--color-text-muted)]">{getPercent(unknownDevice, totalFrauds)} de cada 100 fraudes usaron un dispositivo desconocido</li>
          </ul>
        </div>
      </MetricCard>
    </div>
  );
}

export default FraudMetrics; // Exporta el componente para poder usarlo en DashboardPage
