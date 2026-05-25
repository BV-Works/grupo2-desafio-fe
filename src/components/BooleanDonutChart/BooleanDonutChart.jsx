import { pie, arc } from "d3"; // pie calcula los ángulos de cada trozo del donut. arc convierte esos ángulos en una forma SVG
import { ClientTooltip, TooltipContent, TooltipTrigger } from "./Tooltip"; // Importa componentes para mostrar un tooltip cuando pasas el ratón por encima de cada sector

// Primer gradiente: empieza rosa y termina morado y Segundo gradiente: empieza azul y termina verde
const colors = [
    {
        colorFrom: "text-pink-400",
        colorTo: "text-purple-400",
    },
    {
        colorFrom: "text-sky-400",
        colorTo: "text-lime-400",
    },
];

function BooleanDonutChart({ title, data }) {
    // Adaptamos los datos al formato del ejemplo de Rosen: name, value y colores Tailwind
    const chartData = data.map((item, index) => ({
        name: item.label,
        value: item.value,
        colorFrom: colors[index % colors.length].colorFrom,
        colorTo: colors[index % colors.length].colorTo,
    }));

    const radius = Math.PI * 100; // Define el radio del donut
    const gap = 0.02; // Define separación entre sectores del donut

    // pie calcula los angulos de cada sector segun el value de cada item
    const pieLayout = pie()
        .sort(null)
        .value((item) => item.value)
        .padAngle(gap); // sort(null) -> Evita que D3 reordene los datos. .value -> Le dice que use item. padAngle -> value para calcular el tamaño de cada sector. Añade separación entre sectores

    // arc convierte cada angulo en el path SVG que dibuja el donut
    const arcGenerator = arc()
        .innerRadius(radius * 0.45)
        .outerRadius(radius)
        .cornerRadius(8); // innerRadius -> Define el agujero interior del donut. outerRadius -> Define el tamaño exterior del donut. outerRadius -> Redondea las esquinas de cada sector

    const labelRadius = radius * 0.78; // Define dónde se colocarán las etiquetas internas
    // Crea otro arco, pero solo para calcular posición de etiquetas
    const arcLabel = arc()
        .innerRadius(labelRadius)
        .outerRadius(labelRadius); // Al tener el mismo radio interior y exterior, se usa como línea guía para posicionar textos

    const arcs = pieLayout(chartData); // Convierte los datos en sectores con ángulos
    const total = chartData.reduce((sum, item) => sum + item.value, 0); // Suma todos los valores para mostrar el total en el centro

    const computeAngle = (slice) => ((slice.endAngle - slice.startAngle) * 180) / Math.PI; // Calcula cuántos grados ocupa cada sector
    const minAngleToShowLabel = 20; // Solo muestra etiqueta si el sector mide más de 20 grados. Esto evita textos apretados en sectores pequeños

    return (
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-sm sm:p-4">
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-main)] sm:mb-4 sm:text-base">
                {title}
            </h2>

            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(12rem,16rem)_1fr]">
                <div className="relative mx-auto w-full max-w-[14rem] sm:max-w-[16rem]">
                    {/* Define el área del SVG. Aquí el centro está en (0, 0). Por eso empieza en negativo -radius, -radius */}
                    <svg
                        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
                        className="overflow-visible"
                        role="img"
                        aria-label={title}
                    >
                        {/* Recorre cada sector del donut */}
                        {arcs.map((slice, index) => {
                            const midAngle = (slice.startAngle + slice.endAngle) / 2; // Calcula el ángulo central del sector. Sirve para orientar el gradiente

                            return (
                                <ClientTooltip key={slice.data.name}>
                                    {/* Define la parte sobre la que puedes pasar el ratón */}
                                    <TooltipTrigger>
                                        {/* Agrupa el sector y su gradiente */}
                                        <g>
                                            {/* Dibuja el sector. d={arcGenerator(slice)} crea la forma SVG. fill=url(...) usa un gradiente como color. */}
                                            <path
                                                fill={`url(#donutColors-${index})`}
                                                d={arcGenerator(slice)}
                                            />
                                            {/* Define el gradiente de ese sector */}
                                            <linearGradient
                                                id={`donutColors-${index}`}
                                                x1="0"
                                                y1="0"
                                                x2="1"
                                                y2="0"
                                                gradientTransform={`rotate(${(midAngle * 180) / Math.PI - 90}, 0.5, 0.5)`} // Rota el gradiente según la posición del sector
                                            >
                                                {/* Primer color del gradient */}
                                                <stop
                                                    offset="0%"
                                                    stopColor="currentColor"
                                                    className={slice.data.colorFrom}
                                                />
                                                {/* Segundo color del gradient */}
                                                <stop
                                                    offset="100%"
                                                    stopColor="currentColor"
                                                    className={slice.data.colorTo}
                                                />
                                            </linearGradient>
                                        </g>
                                    </TooltipTrigger>
                                    {/* Contenido que aparece al hacer hover */}
                                    <TooltipContent>
                                        <div className="font-medium text-[var(--color-text-main)]">
                                            {slice.data.name}
                                        </div>
                                        <div className="text-sm text-[var(--color-text-muted)]">
                                            {slice.data.value.toLocaleString("es-ES")}
                                        </div>
                                    </TooltipContent>
                                </ClientTooltip>
                            );
                        })}

                        <text
                            textAnchor="middle"
                            y="-8"
                            className="fill-[var(--color-text-main)] text-5xl font-bold"
                        >
                            {total}
                        </text>
                        <text
                            textAnchor="middle"
                            y="32"
                            className="fill-[var(--color-text-muted)] text-xl"
                        >
                            total
                        </text>
                    </svg>

                    {/* Capa encima del donut para poner etiquetas. pointer-events-none hace que esta capa no bloquee el tooltip*/}
                    <div className="pointer-events-none absolute inset-0">
                        {/* Recorre los sectores otra vez para pintar etiquetas */}
                        {arcs.map((slice) => {
                            const angle = computeAngle(slice); // Calcula el tamaño del sector
                            if (angle <= minAngleToShowLabel) return null; // Si el sector es pequeño, no pinta etiqueta

                            const [x, y] = arcLabel.centroid(slice); // Calcula el punto central donde irá la etiqueta
                            const nameLeft = `${50 + (x / radius) * 38}%`; // Convierte coordenadas SVG a porcentajes CSS para colocar el texto
                            const nameTop = `${50 + (y / radius) * 38}%`;

                            return (
                                // Pinta el nombre dentro del sector
                                <div
                                    key={slice.data.name}
                                    className="absolute max-w-20 -translate-x-1/2 -translate-y-1/2 truncate text-center text-[10px] font-semibold text-white sm:text-xs"
                                    style={{
                                        left: nameLeft,
                                        top: nameTop,
                                        marginLeft: x > 0 ? "2px" : "-2px",
                                        marginTop: y > 0 ? "2px" : "-2px",
                                    }}
                                >
                                    {slice.data.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <ul className="grid gap-2">
                    {/* Recorre cada dato */}
                    {chartData.map((item, index) => (
                        <li
                            key={item.name}
                            className="grid grid-cols-[0.75rem_1fr_auto] items-center gap-2 text-sm text-[var(--color-text-main)]"
                        >
                            <span
                                className={`h-3 w-3 rounded-full ${colors[index % colors.length].colorFrom}`}
                                aria-hidden="true"
                            >{/* Crea el círculo de color */}
                                <span className="block h-full w-full rounded-full bg-current" />{/* Rellena el círculo usando el color actual */}
                            </span>
                            <span>{item.name}</span>
                            <strong>{item.value}</strong>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default BooleanDonutChart;
