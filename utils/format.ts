export function formatBalance(amount: number): string {
  const parts = amount.toFixed(2).split('.');
  const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${whole},${parts[1]}`;
}

export function formatCurrency(amount: number, currency = 'DKK'): string {
  return `${formatBalance(amount)} ${currency}`;
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'I dag';
  if (diffDays === 1) return 'I gar';
  if (diffDays < 7) return `${diffDays} dage siden`;

  return date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
}

export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
