import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function logJobEvent(
  jobId: string,
  type: string,
  detail?: string
) {
  const session = await auth();
  if (!session?.user?.email) return;

  await supabase.from("job_events").insert({
    job_id: jobId,
    user_email: session.user.email,
    user_name: session.user.name || null,
    type,
    detail: detail || null,
  });
}
