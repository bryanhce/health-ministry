export function getTodayLocalString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateString: string): string {
  const today = getTodayLocalString();
  if (dateString === today) {
    return 'Today';
  }

  const [y, m, d] = today.split('-').map(Number);
  const yesterday = new Date(y, m - 1, d - 1);
  const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayString = `${yesterday.getFullYear()}-${yMonth}-${yDay}`;

  if (dateString === yesterdayString) {
    return 'Yesterday';
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
