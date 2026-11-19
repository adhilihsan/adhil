import confetti from 'canvas-confetti';

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutesToHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function getDaysRemaining(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function triggerCelebration(): void {
  confetti({
    particleCount: 75,
    spread: 60,
    origin: { y: 0.6 }
  });
}

export function getDifficultyColor(diff: string): string {
  switch (diff.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'hard':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function getMasteryColor(mastery: number): { bg: string; text: string; bar: string } {
  if (mastery >= 75) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' };
  } else if (mastery >= 50) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' };
  } else {
    return { bg: 'bg-rose-50', text: 'text-rose-700', bar: 'bg-rose-500' };
  }
}
