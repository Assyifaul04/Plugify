"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  // State untuk mengontrol open/close setiap collapsible
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({})

  // Cocokkan path saat ini (mengabaikan query string, mis. ?type=MOD)
  const isPathActive = (url: string) => {
    const basePath = url.split("?")[0]
    if (basePath === "/dashboard") return pathname === "/dashboard"
    return pathname === basePath || pathname.startsWith(`${basePath}/`)
  }

  // Effect untuk mengupdate state saat pathname berubah
  React.useEffect(() => {
    const newOpenState: Record<string, boolean> = {}
    items.forEach((item) => {
      const sectionActive =
        item.isActive ||
        isPathActive(item.url) ||
        item.items?.some((sub) => isPathActive(sub.url))
      
      // Hanya update jika nilai berbeda
      if (openItems[item.title] !== sectionActive) {
        newOpenState[item.title] = sectionActive
      }
    })
    
    // Update state jika ada perubahan
    if (Object.keys(newOpenState).length > 0) {
      setOpenItems((prev) => ({ ...prev, ...newOpenState }))
    }
  }, [pathname, items]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handler untuk toggle collapsible
  const handleOpenChange = (title: string, open: boolean) => {
    setOpenItems((prev) => ({ ...prev, [title]: open }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const sectionActive =
            item.isActive ||
            isPathActive(item.url) ||
            item.items?.some((sub) => isPathActive(sub.url))

          // Gunakan open dari state, fallback ke sectionActive
          const isOpen = openItems[item.title] ?? sectionActive

          return (
            <Collapsible
              key={item.title}
              open={isOpen}
              onOpenChange={(open) => handleOpenChange(item.title, open)}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} isActive={sectionActive} />}
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        render={<Link href={subItem.url} />}
                        isActive={isPathActive(subItem.url)}
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}