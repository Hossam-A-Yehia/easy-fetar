import { getEmployeeBySlug } from "@/data/employees";
import { EmployeeOrderView } from "@/components/EmployeeOrderView";
import { fetchGuestTeamMemberBySlug } from "@/lib/guest-team-db";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EmployeeOrderPage({ params }: Props) {
  const { slug } = await params;
  const builtin = getEmployeeBySlug(slug);
  const serverEmployee =
    builtin ?? (await fetchGuestTeamMemberBySlug(slug)) ?? null;

  return (
    <EmployeeOrderView slug={slug} serverEmployee={serverEmployee} />
  );
}
