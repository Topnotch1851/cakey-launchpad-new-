/**
 * Admin section layout. Frontend-only build: no auth gate.
 * TODO: re-add role check (server-side) when backend is wired.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
