"use client";

export function ClientLogoutButton() {
  async function logout() {
    await fetch("/api/client/logout", { method: "POST" });
    window.location.href = "/entreprise";
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm font-medium text-ink-muted underline-offset-2 hover:text-navy hover:underline"
    >
      Se déconnecter
    </button>
  );
}
