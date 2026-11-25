import Icon from "./Icon";

export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel with a live-looking conversation */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-2xl font-black text-brand">m</span>
          <span className="text-xl font-extrabold">Mensajes</span>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-3" aria-hidden>
          <p className="w-fit rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[15px] text-ink shadow-lg">Are we still on for Friday? 😊</p>
          <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-white/20 px-4 py-2.5 text-[15px] backdrop-blur">Yes! Booking the court now.</p>
          <p className="w-fit rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[15px] text-ink shadow-lg">Perfect, sending you the photos 📸</p>
          <div className="flex w-fit items-center gap-1 rounded-2xl bg-white/20 px-4 py-3 backdrop-blur">
            {[0, 150, 300].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: "bounce-dot 1.1s infinite", animationDelay: `${d}ms` }} />)}
          </div>
        </div>
        <p className="max-w-sm text-3xl font-extrabold leading-tight">Talk to the people who matter, without the noise.</p>
        <span className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
      </section>

      <section className="grid place-items-center bg-white px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-xl font-black text-white">m</span></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mb-8 mt-2 text-mute">{subtitle}</p>
          {children}
          <p className="mt-8 text-center text-sm text-mute">{footer}</p>
        </div>
      </section>
    </main>
  );
}

export const primary = "w-full rounded-xl bg-brand py-3.5 font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50";
export { Icon };
