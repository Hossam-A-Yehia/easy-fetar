export const TEAM_CHANGED_EVENT = "izi-team-changed";

export function emitTeamChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TEAM_CHANGED_EVENT));
}
