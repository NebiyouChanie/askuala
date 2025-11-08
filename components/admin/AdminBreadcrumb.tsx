"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function formatLabel(segment: string): string {
  const map: Record<string, string> = {
    admin: "Admin",
    post: "Posts",
    add: "Add New",
    edit: "Edit",
    registrations: "Registrations",
    settings: "Settings",
    general: "General",
    users: "Users",
    system: "System",
    profile: "Profile",
    tutors: "Tutors",
    tutees: "Tutees",
    training: "Training",
    research: "Research",
    entrepreneurship: "Entrepreneurship",
  }
  return map[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
}

export default function AdminBreadcrumb() {
  const pathname = usePathname() || "/admin"
  const parts = pathname.split("/").filter(Boolean)

  // Only show crumbs starting from "admin"
  const adminIndex = parts.findIndex((p) => p === "admin")
  const crumbs = adminIndex >= 0 ? parts.slice(adminIndex) : ["admin"]

  const isIdSegment = (seg: string) => {
    // UUID v4 or similar pattern, or purely numeric id
    const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg)
    const numericId = /^\d{4,}$/.test(seg)
    return uuidLike || numericId
  }

  const items = crumbs.map((seg, idx) => {
    const href = "/" + crumbs.slice(0, idx + 1).join("/")
    const label = formatLabel(seg)
    const isLast = idx === crumbs.length - 1
    const clickable = !isLast && !isIdSegment(seg)
    return { href, label, isLast, clickable }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => (
          <div key={item.href} className="contents">
            <BreadcrumbItem>
              {item.isLast || !item.clickable ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}


