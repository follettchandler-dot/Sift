import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const categoryColors: Record<string, string> = {
  groceries: "border-green-500/40 text-green-400 bg-green-500/10",
  dining: "border-orange-500/40 text-orange-400 bg-orange-500/10",
  transportation: "border-blue-500/40 text-blue-400 bg-blue-500/10",
  shopping: "border-purple-500/40 text-purple-400 bg-purple-500/10",
  health: "border-red-500/40 text-red-400 bg-red-500/10",
  home: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  entertainment: "border-pink-500/40 text-pink-400 bg-pink-500/10",
  office: "border-slate-500/40 text-slate-400 bg-slate-500/10",
  "personal-care": "border-fuchsia-500/40 text-fuchsia-400 bg-fuchsia-500/10",
  "kids-toys": "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
  pets: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
  other: "border-zinc-500/40 text-zinc-400 bg-zinc-500/10",
}

function getParentSlug(slug: string): string {
  // Top-level slugs match directly; child slugs may include parent prefix
  for (const key of Object.keys(categoryColors)) {
    if (slug === key || slug.startsWith(key + "-") || slug.startsWith(key + "/")) {
      return key
    }
  }
  return "other"
}

interface CategoryBadgeProps {
  name: string
  slug: string
  className?: string
}

export function CategoryBadge({ name, slug, className }: CategoryBadgeProps) {
  const parentSlug = getParentSlug(slug)
  const colorClass = categoryColors[parentSlug] ?? categoryColors.other

  return (
    <Badge
      variant="outline"
      className={cn(colorClass, className)}
    >
      {name}
    </Badge>
  )
}
