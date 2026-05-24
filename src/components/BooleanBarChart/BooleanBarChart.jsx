import { scaleBand, scaleLinear, max } from "d3"; // scaleBand: reparte categorías, por ejemplo "Noche" y "Día". scaleLinear: convierte valores numéricos en porcentajes. max: obtiene el valor máximo de un array
import { AnimatedBar } from "./AnimatedBar";

const colors = ["#F5A5DB", "#33C2EA", "#B89DFB", "#87db72"];

function BooleanBarChart({ title, data }) { // title: título de la gráfica y data: datos
    // Adaptamos los datos al formato del ejemplo de Rosen: key, value y color.
    const chartData = data
        .map((item, index) => ({
            key: item.label,
            value: item.value,
            color: colors[index % colors.length],
        }))
        .sort((a, b) => b.value - a.value); // color: colors[index % colors.length], Asigna un color según la posición del elemento. El % sirve para que, si hay más datos que colores, vuelva a empezar desde el primer color

    // scaleBand reparte las categorias en el eje vertical
    const yScale = scaleBand()
        .domain(chartData.map((item) => item.key))
        .range([0, 100])
        .padding(0.175);

    // scaleLinear convierte cada valor en un porcentaje de anchura de barra
    const xScale = scaleLinear()
        .domain([0, max(chartData, (item) => item.value) || 1])
        .range([0, 100]); // El valor mínimo es 0. El máximo será el valor más alto de los datos. El || 1 evita errores si no hay datos.

    // El margen izquierdo crece segun la etiqueta mas larga, pero queda limitado para movil
    const longestWord = max(chartData, (item) => item.key.length) || 1;
    const marginLeft = `clamp(36px, ${longestWord * 6}px, 92px)`; // Calcula el margen izquierdo

    return (
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-sm sm:p-4">
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-main)] sm:mb-4 sm:text-base">
                {title}
            </h2>
            {/* relative permite colocar elementos dentro con absolute. h-56: altura en móvil. sm:h-72: más altura en pantallas grandes. */}
            <div
                className="relative h-56 w-full sm:h-72"
                style={{
                    "--marginTop": "16px",
                    "--marginRight": "8px",
                    "--marginBottom": "25px",
                    "--marginLeft": marginLeft,
                }}
            >
                {/* absolute inset-0: ocupa todo el contenedor. z-10: se pone por encima. overflow-hidden: evita que algo se salga. */}
                <div
                    className="
                        absolute inset-0 z-10 overflow-hidden
                        h-[calc(100%-var(--marginTop)-var(--marginBottom))]
                        w-[calc(100%-var(--marginLeft)-var(--marginRight))]
                        translate-x-[var(--marginLeft)]
                        translate-y-[var(--marginTop)]
                    "
                > {/* h-[calc(100%-var(--marginTop)-var(--marginBottom))] -> Altura total menos margen superior e inferior | w-[calc(100%-var(--marginLeft)-var(--marginRight))] -> Anchura total menos margen izquierdo y derecho | translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] -> Mueve la zona de barras para dejar espacio a etiquetas y margen superior*/}
                    {/* Recorre cada dato para pintar una barra */}
                    {chartData.map((item, index) => {
                        const barWidth = xScale(item.value); // Calcula el ancho de la barra en porcentaje
                        const barHeight = yScale.bandwidth(); // Calcula la altura de cada barra
                        const shouldPlaceValueInside = barWidth > 82; // Si la barra es muy larga, el número se pone dentro. Si no, se pone fuera

                        return (
                            // Envuelve la barra en el componente animado
                            <AnimatedBar key={item.key} index={index}>
                                {/* Crea la barra como un div. rounded-r-md: redondea las esquinas derechas */}
                                <div
                                    className="absolute left-0 rounded-r-md"
                                    style={{
                                        top: `${yScale(item.key)}%`,
                                        width: `${barWidth}%`,
                                        height: `${barHeight}%`,
                                        backgroundColor: item.color,
                                    }}
                                />
                                {/* Pinta el número de la barra */}
                                <span
                                    className={`absolute -translate-y-1/2 text-xs font-bold ${
                                        shouldPlaceValueInside
                                            ? "-translate-x-6 text-white"
                                            : "translate-x-2 text-[var(--color-text-main)]"
                                    }`} // Si la barra es larga, el texto va dentro y blanco. Si la barra es corta, el texto va fuera y oscuro
                                    style={{
                                        top: `${yScale(item.key) + barHeight / 2}%`,
                                        left: `${barWidth}%`,
                                    }} // Coloca el número verticalmente en el centro de la barra y horizontalmente al final de la barra
                                >
                                    {item.value} {/* Muestra el valor */}
                                </span>
                            </AnimatedBar>
                        );
                    })}
                    {/* SVG para las líneas verticales de guía */}
                    <svg
                        className="h-full w-full text-slate-300"
                        viewBox="0 0 100 100" // Usa coordenadas de 0 a 100, como porcentajes
                        preserveAspectRatio="none" // Permite que el SVG se estire al tamaño del contenedor
                        aria-hidden="true"
                    >
                        {/* Crea 4 marcas del eje X */}
                        {xScale.ticks(4).map((value) => (
                            <g key={value} transform={`translate(${xScale(value)}, 0)`}> {/* Mueve cada línea a su posición horizontal */}
                                <line
                                    y1={0}
                                    y2={100}
                                    stroke="currentColor"
                                    strokeDasharray="6 5"// Hace la línea discontinua
                                    strokeWidth={0.5}
                                    vectorEffect="non-scaling-stroke"
                                />{/* Dibuja una línea vertical desde arriba hasta abajo */}
                            </g>
                        ))}
                    </svg>
                </div>
                {/* Este pinta las etiquetas de la izquierda */}
                <svg
                    className="
                        absolute inset-0 overflow-visible
                        h-[calc(100%-var(--marginTop)-var(--marginBottom))]
                        translate-y-[var(--marginTop)]
                    "
                >
                    {/* Mueve el grupo cerca del margen izquierdo */}
                    <g className="translate-x-[calc(var(--marginLeft)-8px)]">
                        {/* Pinta cada etiqueta: "Noche", "Día", etc */}
                        {chartData.map((item) => (
                            <text
                                key={item.key}
                                x="0"
                                y={`${yScale(item.key) + yScale.bandwidth() / 2}%`}
                                dy=".35em"
                                textAnchor="end"
                                fill="currentColor"
                                className="text-[10px] text-[var(--color-text-muted)] sm:text-xs"
                            >
                                {item.key}
                            </text>
                        ))}
                    </g>
                </svg>
                {/* Este pinta los números del eje inferior */}
                <svg
                    className="
                        absolute inset-0 overflow-visible
                        h-[calc(100%-var(--marginBottom))]
                        w-[calc(100%-var(--marginLeft)-var(--marginRight))]
                        translate-x-[var(--marginLeft)]
                        translate-y-4
                    "
                >
                    <g>
                        {/* Genera marcas numéricas */}
                        {xScale.ticks(4).map((value) => (
                            // Coloca cada número abajo en su posición correspondiente
                            <text
                                key={value}
                                x={`${xScale(value)}%`}
                                y="100%"
                                textAnchor="middle"
                                fill="currentColor"
                                className="text-[10px] tabular-nums text-[var(--color-text-muted)] sm:text-xs"
                            >
                                {value}
                            </text>
                        ))}
                    </g>
                </svg>
            </div>
        </section>
    );
}

export default BooleanBarChart;
