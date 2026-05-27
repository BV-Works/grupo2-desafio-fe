import { scaleBand, scaleLinear, max } from "d3";

const probabilityBuckets = [
    { label: "0-25%", min: 0, max: 0.25 },
    { label: "25-50%", min: 0.25, max: 0.5 },
    { label: "50-75%", min: 0.5, max: 0.75 },
    { label: "75-100%", min: 0.75, max: 1.01 },
];

const formatPercent = (value) =>
    `${Math.round(value * 100).toLocaleString("es-ES")}%`;

const formatDecimalPercent = (value) =>
    `${(value * 100).toLocaleString("es-ES", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })}%`;

function MetricCard({ label, value, tone = "neutral" }) {
    const toneClasses = {
        danger: "border-rose-200 bg-rose-50 text-rose-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        info: "border-sky-200 bg-sky-50 text-sky-700",
        neutral: "border-[var(--color-border)] bg-white text-[var(--color-text-main)]",
    };

    return (
        <article className={`rounded-lg border p-3 ${toneClasses[tone]}`}>
            <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)]">
                {label}
            </p>
            <strong className="mt-1 block text-2xl font-bold tabular-nums">
                {value}
            </strong>
        </article>
    );
}

function FraudPredictionsChart({ predictions }) {
    const total = predictions.length;
    const fraudTransactions = predictions.filter((item) => item.is_fraud === 1);
    const fraudCount = fraudTransactions.length;
    const fraudRate = total ? fraudCount / total : 0;
    const averageProbability =
        total > 0
            ? predictions.reduce((sum, item) => sum + item.prob_fraud, 0) / total
            : 0;
    const totalImpact = fraudTransactions.reduce(
        (sum, item) => sum + item.impacto_fraude,
        0
    );

    const bucketData = probabilityBuckets.map((bucket) => {
        const items = predictions.filter(
            (item) => item.prob_fraud >= bucket.min && item.prob_fraud < bucket.max
        );
        const fraudItems = items.filter((item) => item.is_fraud === 1);

        return {
            label: bucket.label,
            total: items.length,
            fraud: fraudItems.length,
            impact: fraudItems.reduce((sum, item) => sum + item.impacto_fraude, 0),
        };
    });

    const topRiskTransactions = [...predictions]
        .sort((a, b) => {
            if (b.is_fraud !== a.is_fraud) return b.is_fraud - a.is_fraud;
            if (b.prob_fraud !== a.prob_fraud) return b.prob_fraud - a.prob_fraud;
            return b.impacto_fraude - a.impacto_fraude;
        })
        .slice(0, 5);

    const yScale = scaleBand()
        .domain(bucketData.map((item) => item.label))
        .range([0, 100])
        .padding(0.28);

    const xScale = scaleLinear()
        .domain([0, max(bucketData, (item) => item.total) || 1])
        .range([0, 100]);

    const impactScale = scaleLinear()
        .domain([0, max(topRiskTransactions, (item) => item.impacto_fraude) || 1])
        .range([12, 100]);

    return (
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-sm sm:p-4">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--color-text-main)] sm:text-base">
                        Predicciones de fraude
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Fraude detectado, probabilidad e impacto
                    </p>
                </div>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    {fraudCount.toLocaleString("es-ES")} fraudes
                </span>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricCard
                    label="Es fraude"
                    value={formatDecimalPercent(fraudRate)}
                    tone="danger"
                />
                <MetricCard
                    label="Probabilidad media"
                    value={formatDecimalPercent(averageProbability)}
                    tone="warning"
                />
                <MetricCard
                    label="Impacto fraude"
                    value={totalImpact.toLocaleString("es-ES")}
                    tone="info"
                />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)]">
                <div>
                    <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-main)]">
                        Probabilidad de fraude
                    </h3>
                    <div
                        className="relative h-64 w-full"
                        style={{
                            "--marginTop": "10px",
                            "--marginRight": "34px",
                            "--marginBottom": "24px",
                            "--marginLeft": "64px",
                        }}
                    >
                        <div className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)]">
                            {bucketData.map((item) => {
                                const totalWidth = xScale(item.total);
                                const fraudWidth = xScale(item.fraud);
                                const barHeight = yScale.bandwidth();

                                return (
                                    <div key={item.label}>
                                        <div
                                            className="absolute left-0 rounded-r-md bg-slate-200"
                                            style={{
                                                top: `${yScale(item.label)}%`,
                                                width: `${totalWidth}%`,
                                                height: `${barHeight}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute left-0 rounded-r-md bg-rose-500"
                                            style={{
                                                top: `${yScale(item.label)}%`,
                                                width: `${fraudWidth}%`,
                                                height: `${barHeight}%`,
                                            }}
                                        />
                                        <span
                                            className="absolute -translate-y-1/2 translate-x-2 text-xs font-bold text-[var(--color-text-main)]"
                                            style={{
                                                top: `${yScale(item.label) + barHeight / 2}%`,
                                                left: `${Math.max(totalWidth, fraudWidth)}%`,
                                            }}
                                        >
                                            {item.fraud.toLocaleString("es-ES")}
                                        </span>
                                    </div>
                                );
                            })}
                            <svg
                                className="h-full w-full text-slate-300"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                {xScale.ticks(4).map((value) => (
                                    <g key={value} transform={`translate(${xScale(value)}, 0)`}>
                                        <line
                                            y1={0}
                                            y2={100}
                                            stroke="currentColor"
                                            strokeDasharray="6 5"
                                            strokeWidth={0.5}
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </g>
                                ))}
                            </svg>
                        </div>
                        <svg className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] translate-y-[var(--marginTop)] overflow-visible">
                            <g className="translate-x-[calc(var(--marginLeft)-8px)]">
                                {bucketData.map((item) => (
                                    <text
                                        key={item.label}
                                        x="0"
                                        y={`${yScale(item.label) + yScale.bandwidth() / 2}%`}
                                        dy=".35em"
                                        textAnchor="end"
                                        fill="currentColor"
                                        className="text-xs text-[var(--color-text-muted)]"
                                    >
                                        {item.label}
                                    </text>
                                ))}
                            </g>
                        </svg>
                        <div className="absolute bottom-0 left-[var(--marginLeft)] flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                                Fraude
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                Total
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-main)]">
                        Mayor riesgo
                    </h3>
                    <ul className="grid gap-2">
                        {topRiskTransactions.map((transaction) => (
                            <li
                                key={transaction.id_transaccion}
                                className="rounded-lg border border-[var(--color-border)] bg-white p-3"
                            >
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <strong className="truncate text-sm text-[var(--color-text-main)]">
                                        {transaction.id_transaccion}
                                    </strong>
                                    <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                                        {transaction.is_fraud ? "Fraude" : "Legitima"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[1fr_auto] gap-2 text-xs text-[var(--color-text-muted)]">
                                    <span>Probabilidad</span>
                                    <strong className="text-[var(--color-text-main)]">
                                        {formatPercent(transaction.prob_fraud)}
                                    </strong>
                                    <span>Impacto</span>
                                    <strong className="text-[var(--color-text-main)]">
                                        {transaction.impacto_fraude}
                                    </strong>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-sky-500"
                                        style={{
                                            width: `${impactScale(transaction.impacto_fraude)}%`,
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default FraudPredictionsChart;
