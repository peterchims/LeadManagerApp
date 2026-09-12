const AVATAR_CLASSES = ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function LeadAvatar({ name, className }: { name: string; className?: string }) {
  const colorClass = AVATAR_CLASSES[hashString(name) % AVATAR_CLASSES.length];

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorClass} ${className ?? ""}`}
    >
      {initialsFor(name)}
    </div>
  );
}
