"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Users,
  BookOpen,
  GraduationCap,
  Monitor,
  Lightbulb,
  Briefcase,
  Plus,
  Settings2,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface User {
  userId: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  const data = {
    user: user ? {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: "/avatars/admin.jpg",
    } : {
      name: "Admin",
      email: "admin@example.com",
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
        isActive: true,
      },
      {
        title: "Registrations",
        url: "/admin/registrations",
        icon: Users,
        items: [
          {
            title: "View All",
            url: "/admin/registrations",
          },
          {
            title: "Add New",
            url: "/admin/registrations/add",
          },
        ],
      },
      {
        title: "Instructors",
        url: "/admin/instructors",
        icon: Users,
        items: [
          {
            title: "View All",
            url: "/admin/instructors",
          },
          {
            title: "Add New",
            url: "/admin/instructors/add",
          },
        ],
      },
       
     
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
