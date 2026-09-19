export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
          AI-Powered Student Intelligence Platform
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Welcome to{" "}
          <span className="text-blue-400">CampusIQ</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          An intelligent platform that combines academic analytics, career
          guidance, resume intelligence, skill-gap analysis, job matching,
          and placement preparation in one place.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600">
            Get Started
          </button>

          <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-900">
            Explore CampusIQ
          </button>
        </div>

        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            title="Academic Intelligence"
            description="Track academic performance, attendance, and progress."
          />

          <FeatureCard
            title="Career Intelligence"
            description="Identify skill gaps and build personalized career paths."
          />

          <FeatureCard
            title="Placement Intelligence"
            description="Match your profile with jobs and prepare for interviews."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-left">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}