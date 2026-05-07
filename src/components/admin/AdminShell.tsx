import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="font-hand text-[11px] tracking-[0.22em] text-secondary">ADMIN</p>
          <h1 className="font-display text-secondary text-3xl uppercase">{title}</h1>
          {description && <p className="text-sm text-foreground/70 mt-1 mb-5">{description}</p>}
          <div className="mt-4">
            <AdminNav />
          </div>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
