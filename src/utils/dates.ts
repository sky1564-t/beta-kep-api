/** Today's date (YYYY-MM-DD) in the site's timezone, default Cambodia. */
export function todayInSiteTimezone(): string {
  const timeZone = process.env.SITE_TIMEZONE || 'Asia/Phnom_Penh';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Date `days` from today (YYYY-MM-DD), used by demo data. */
export function dateFromToday(days: number): string {
  const [year, month, day] = todayInSiteTimezone().split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}
