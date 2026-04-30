import { Link } from "react-router-dom";
import { Heart, ArrowRight, Leaf, Users, Globe, HandHeart, Brain, Sparkles, Hand } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import heroImg from "@/assets/home-hero-children.jpg";
import causaImg from "@/assets/home-causa-carpinteria.jpg";
import comunidadImg from "@/assets/home-comunidad-circulo.jpg";

const Underline = () => (
  <svg width="60" height="10" viewBox="0 0 60 10" className="inline-block ml-1 align-middle text-primary" aria-hidden>
    <path d="M2 6 Q 15 1, 30 5 T 58 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      {/* HERO */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] max-h-[820px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Niña y niño explorando flores en una pradera al atardecer"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/40 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto h-full px-5 sm:px-8 lg:px-12 flex items-center">
            <div className="max-w-xl text-primary-foreground">
              <h1 className="font-display uppercase leading-[1.05] text-[clamp(34px,7vw,68px)] tracking-wide">
                Educamos,<br />Cuidamos,<br />Transformamos
              </h1>
              <p className="font-display uppercase text-primary text-[clamp(20px,3.5vw,30px)] mt-3 leading-tight">
                Para un mundo vivo. <Underline />
              </p>
              <p className="mt-5 text-sm sm:text-base leading-relaxed max-w-md text-primary-foreground/90">
                En Fundación Waldorf Kimün conectamos educación, naturaleza y comunidad para
                formar personas conscientes, libres y comprometidas con la vida.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/campanas/carpinteria"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-hand text-[12px] tracking-[0.2em] shadow-soft hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                >
                  <Heart className="w-4 h-4" fill="currentColor" /> DONA AHORA
                </Link>
                <a
                  href="#causa"
                  className="inline-flex items-center justify-center gap-2 bg-background text-foreground rounded-full px-7 py-3.5 font-hand text-[12px] tracking-[0.2em] hover:bg-background/90 transition-all"
                >
                  CONOCE NUESTRA CAUSA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROPÓSITO */}
      <section id="proposito" className="px-5 sm:px-8 lg:px-12 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="font-hand text-[11px] tracking-[0.28em] text-secondary flex items-center gap-2 mb-4">
              <Leaf className="w-4 h-4" /> NUESTRO PROPÓSITO
            </p>
            <h2 className="font-display text-secondary uppercase text-[clamp(28px,5vw,46px)] leading-[1.1]">
              Sembramos bienestar<br />para las personas<br />y el planeta. <Underline />
            </h2>
            <p className="mt-6 text-foreground/80 leading-relaxed text-base lg:text-lg max-w-md">
              A través de nuestra escuela, proyectos comunitarios y alianzas, creamos espacios
              donde niñas, niños, jóvenes y familias pueden aprender, crecer y actuar
              desde el amor y el respeto por la vida.
            </p>
            <a href="#causa" className="mt-6 inline-flex items-center gap-2 font-hand text-primary text-[12px] tracking-[0.22em] hover:gap-3 transition-all">
              CONOCE MÁS SOBRE NOSOTROS <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-6">
            {[
              { icon: Leaf, title: "EDUCACIÓN CON SENTIDO", text: "Formación integral inspirada en la pedagogía Waldorf y el vínculo con la naturaleza." },
              { icon: Users, title: "COMUNIDAD Y VÍNCULOS", text: "Fortalecemos lazos entre familias, docentes y territorio para crecer juntos." },
              { icon: Globe, title: "CUIDADO DEL PLANETA", text: "Promovemos acciones concretas para regenerar y proteger nuestro entorno." },
            ].map((b) => (
              <div key={b.title} className="flex gap-4 items-start">
                <div className="shrink-0 w-14 h-14 rounded-full bg-secondary-soft flex items-center justify-center text-secondary">
                  <b.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-hand text-[13px] tracking-[0.18em] text-foreground">{b.title}</h3>
                  <p className="mt-1 text-foreground/75 leading-relaxed text-[15px]">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAUSA DEL MES */}
      <section id="causa" className="px-5 sm:px-8 lg:px-12 py-14 lg:py-20 bg-secondary-soft/40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <p className="font-hand text-[11px] tracking-[0.28em] text-primary flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4" fill="currentColor" /> CAUSA DEL MES
            </p>
            <h2 className="font-display text-secondary uppercase text-[clamp(28px,5vw,44px)] leading-[1.1]">
              Creamos juntos<br />un Taller de<br />Carpintería <Underline />
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed text-base lg:text-lg max-w-md">
              Un espacio para aprender, crear y construir comunidad.<br />
              Tu aporte hace posible este sueño.
            </p>
            <Link
              to="/campanas/carpinteria"
              className="mt-7 inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-hand text-[12px] tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              VER CAUSA DEL MES <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-[28px] overflow-hidden shadow-soft border border-border/50 bg-card">
              <img
                src={causaImg}
                alt="Taller de carpintería en el bosque"
                className="w-full h-auto object-cover"
                width={1280}
                height={1024}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section id="impacto" className="px-5 sm:px-8 lg:px-12 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <p className="font-hand text-[11px] tracking-[0.28em] text-secondary mb-8 flex items-center gap-2">
            NUESTRO IMPACTO <Underline />
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Users, n: "+150", t: "Estudiantes formados cada año" },
              { icon: Leaf, n: "+20", t: "Hectáreas de naturaleza protegidas" },
              { icon: Heart, n: "+300", t: "Familias parte de nuestra comunidad" },
              { icon: Sparkles, n: "+30", t: "Proyectos comunitarios en curso" },
            ].map((s) => (
              <div key={s.n} className="bg-card rounded-2xl border border-border/40 p-5 sm:p-6 text-center shadow-card">
                <s.icon className="w-7 h-7 text-primary mx-auto mb-3" strokeWidth={1.5} />
                <p className="font-display text-primary text-[clamp(28px,5vw,40px)] leading-none">{s.n}</p>
                <p className="mt-2 text-foreground/75 text-sm leading-snug">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE EMOCIONAL */}
      <section className="px-5 sm:px-8 lg:px-12 pb-14 lg:pb-20">
        <div className="max-w-7xl mx-auto relative rounded-[28px] overflow-hidden shadow-soft">
          <img
            src={comunidadImg}
            alt="Comunidad tomada de las manos alrededor de un árbol al atardecer"
            className="w-full h-[360px] sm:h-[440px] lg:h-[520px] object-cover"
            width={1920}
            height={1080}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-10 lg:px-14 max-w-xl text-primary-foreground">
              <h2 className="font-display uppercase text-[clamp(26px,5vw,46px)] leading-[1.05]">
                Juntos podemos hacer<br />la diferencia <Underline />
              </h2>
              <p className="mt-4 text-primary-foreground/90 text-base lg:text-lg leading-relaxed max-w-md">
                Cada aporte, por pequeño que sea, transforma vidas y siembra futuro.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/campanas/carpinteria"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-hand text-[12px] tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                >
                  <Heart className="w-4 h-4" fill="currentColor" /> DONA AHORA
                </Link>
                <Link
                  to="/arbol"
                  className="inline-flex items-center justify-center gap-2 bg-background/90 text-foreground rounded-full px-7 py-3.5 font-hand text-[12px] tracking-[0.22em] hover:bg-background transition-all"
                >
                  🌱 HAZTE SOCIO
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section id="valores" className="px-5 sm:px-8 lg:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {[
              { icon: Brain, t: "CABEZA", d: "Pensar con claridad y conciencia." },
              { icon: Heart, t: "CORAZÓN", d: "Sentir con empatía y amor." },
              { icon: Hand, t: "MANOS", d: "Actuar con compromiso y servicio." },
              { icon: Leaf, t: "VIDA", d: "Honrar y cuidar todo lo que vive." },
            ].map((v) => (
              <div key={v.t} className="text-center">
                <v.icon className="w-9 h-9 text-primary mx-auto mb-3" strokeWidth={1.3} />
                <h3 className="font-hand text-[13px] tracking-[0.22em] text-secondary">{v.t}</h3>
                <p className="mt-2 text-foreground/70 text-sm leading-snug max-w-[180px] mx-auto">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-band text-band-foreground py-10 px-5 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between text-sm">
          <p className="font-hand tracking-widest opacity-90">FUNDACIÓN WALDORF KIMÜN · ALGARROBO, CHILE</p>
          <div className="flex gap-5 font-hand text-[11px] tracking-[0.22em]">
            <Link to="/campanas" className="hover:opacity-80">CAMPAÑAS</Link>
            <Link to="/arbol" className="hover:opacity-80">HACERME SOCIO</Link>
            <Link to="/campanas/carpinteria" className="hover:opacity-80">DONAR</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
