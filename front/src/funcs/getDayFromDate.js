export function getDayOfWeekIntl(d) {
    const date = new Date(d);
    return new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
}