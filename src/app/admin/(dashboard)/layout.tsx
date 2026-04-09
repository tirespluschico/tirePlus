// import { redirect } from "next/navigation";
// import { SessionProvider } from "next-auth/react";
// import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Re-enable auth before deploying
  // const session = await auth();
  // if (!session) {
  //   redirect("/admin/login");
  // }

  return (
    <div className="flex min-h-screen bg-brand-ink">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
