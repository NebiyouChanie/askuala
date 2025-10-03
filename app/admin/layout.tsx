import { AppSidebar } from "@/components/app-sidebar";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

import "../globals.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="[--header-height:calc(theme(spacing.14))] bg-gray-50 text-gray-900 overflow-x-hidden">
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-gray-600 hover:text-[#245D51]" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-gray-300"
            />
            <AdminBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
