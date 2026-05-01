import { Mail, MessageCircle, MapPin, Instagram } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const WHATSAPP_URL = "https://wa.me/56900000000";
const INSTAGRAM_URL = "https://instagram.com/fundacionwaldorfkimun";
const EMAIL = "hola@fundacionwaldorfkimun.cl";

const cards = [
  {
    icon: Mail,
    title: "EMAIL",
    text: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: MessageCircle,
    title: "WHATSAPP",
    text: "Escríbenos directo",
    href: WHATSAPP_URL,
  },
  {
    icon: MapPin,
    title: "UBICACIÓN",
    text: "Algarrobo, Chile",
    href: "https://maps.google.com/?q=Algarrobo,Chile",
  },
  {
    icon: Instagram,
    title: "INSTAGRAM",
    text: "@fundacionwaldorfkimun",
    href: INSTAGRAM_URL,
  },
];

export default function Contacto() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="px-5 sm:px-8 lg:px-12 pt-12 lg:pt-20 pb-14 lg:pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-hand text-[11px] tracking-[0.3em] text-primary mb-4">CONTACTO</p>
            <h1 className="font-display text-secondary uppercase text-[clamp(34px,6vw,58px)] leading-[1.05]">
              Hablemos
            </h1>
            <p className="mt-5 text-foreground/80 leading-relaxed text-base lg:text-lg max-w-2xl mx-auto">
              Si quieres conocer más sobre Fundación Waldorf Kimün, sumarte como familia,
              aportar, colaborar o hacer una pregunta, escríbenos.
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-14 lg:pb-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {cards.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group bg-card rounded-3xl border border-border/50 p-6 sm:p-7 shadow-card hover:-translate-y-1 hover:shadow-soft transition-all flex items-start gap-4"
              >
                <div className="shrink-0 w-14 h-14 rounded-full bg-secondary-soft flex items-center justify-center text-secondary group-hover:bg-primary-soft group-hover:text-primary transition-colors">
                  <c.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-hand text-[12px] tracking-[0.22em] text-secondary">{c.title}</h3>
                  <p className="mt-1 text-foreground text-[15px] break-words">{c.text}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-hand text-[12px] tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" /> ESCRÍBENOS POR WHATSAPP
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
