export function formatearFecha(fechaStr: string | Date): string {
    const fecha = new Date(fechaStr);

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // enero = 0
    const anio = fecha.getFullYear();

    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

export const priceFormatter = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
});

export const numberFormatter = new Intl.NumberFormat("es-PY", {
    style: "decimal",
    minimumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => {
    return priceFormatter.format(value);
};