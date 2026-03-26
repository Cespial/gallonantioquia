export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): { day: string; month: string; full: string } {
  const date = new Date(dateString + "T12:00:00");
  const day = date.getDate().toString().padStart(2, "0");
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return {
    day,
    month: month.substring(0, 3),
    full: `${day} de ${month} de ${year}`,
  };
}
