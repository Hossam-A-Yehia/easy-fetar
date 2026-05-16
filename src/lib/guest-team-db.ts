import { getSupabase } from "@/lib/supabase";
import type { Employee } from "@/types";
import { withImageCacheBust } from "@/lib/team-image-display";

function rowToEmployee(r: {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}): Employee {
  const rev = r.updated_at ?? r.created_at ?? undefined;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    imageUrl: withImageCacheBust(r.image_url, rev),
  };
}

export async function fetchGuestTeamMemberBySlug(
  slug: string,
): Promise<Employee | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("guest_team_members")
    .select("id,slug,name,image_url,created_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return rowToEmployee(data);
}

export async function fetchAllGuestTeamMembers(): Promise<Employee[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("guest_team_members")
    .select("id,slug,name,image_url,created_at")
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(rowToEmployee);
}
