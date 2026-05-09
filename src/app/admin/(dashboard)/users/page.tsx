import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import UsersManager from "@/components/admin/UsersManager";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");

  const { data: me } = await supabase
    .from("shop_users")
    .select("id, role")
    .eq("email", session.user.email)
    .maybeSingle();

  if (me?.role !== "owner") {
    return (
      <div>
        <h1 className="text-lg font-semibold text-white">Users</h1>
        <p className="text-brand-muted text-sm mt-2">
          Only the shop owner can manage users.
        </p>
      </div>
    );
  }

  const { data: users } = await supabase
    .from("shop_users")
    .select("id, email, name, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-white">Shop users</h1>
        <p className="text-xs text-brand-muted mt-0.5">
          Only people listed here can sign in to the admin portal.
        </p>
      </div>

      <UsersManager initialUsers={users || []} currentUserId={me.id} />
    </div>
  );
}
