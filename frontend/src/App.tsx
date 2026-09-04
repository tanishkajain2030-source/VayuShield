import { useEffect, useState } from "react";

import PersonaSwitcher from "./components/core/PersonaSwitcher";
import ProfileForm from "./components/core/ProfileForm";
import WeatherCard from "./components/core/WeatherCard";
import AQICard from "./components/core/AQICard";
import AdvisoryCard from "./components/core/AdvisoryCard";
import WhatsAppButton from "./components/core/WhatsAppButton";

import {
  getEnvironmentalData,
  getAdvisory,
} from "./services/api";

import {
  personas,
  environment as mockEnvironment,
  riskByPersona,
  advisoryByPersona,
} from "./data/mockData";

function App() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);

  // Start with mock data so the UI never breaks when the backend
  // is unavailable during development.
  const [environment, setEnvironment] = useState(mockEnvironment);

  const [risk, setRisk] = useState(
    riskByPersona[selectedPersona.id] ?? {
      score: 50,
      level: "MODERATE" as const,
    },
  );

  const [advisory, setAdvisory] = useState(
    advisoryByPersona[selectedPersona.id] ??
      advisoryByPersona.runner,
  );

  const [isLoadingEnvironment, setIsLoadingEnvironment] =
    useState(false);

  const [isLoadingAdvisory, setIsLoadingAdvisory] =
    useState(false);

  const [backendError, setBackendError] = useState(false);

  // Load live environmental data when the application starts.
  useEffect(() => {
    async function loadEnvironment() {
      try {
        setIsLoadingEnvironment(true);
        setBackendError(false);

        const data = await getEnvironmentalData();

        setEnvironment(data);
      } catch (error) {
        console.error("Environmental data error:", error);

        // Keep mock data if backend is unavailable.
        setBackendError(true);
      } finally {
        setIsLoadingEnvironment(false);
      }
    }

    loadEnvironment();
  }, []);

  // Generate personalized risk and AI advisory whenever
  // the selected profile or environment changes.
  useEffect(() => {
    async function loadAdvisory() {
      try {
        setIsLoadingAdvisory(true);

        const result = await getAdvisory(
          selectedPersona,
          environment,
        );

        setRisk(result.risk);
        setAdvisory(result.advisory);
      } catch (error) {
        console.error("Advisory error:", error);

        // Fall back to mock data if the backend is unavailable.
        const fallbackRisk =
          riskByPersona[selectedPersona.id] ?? {
            score: 50,
            level: "MODERATE" as const,
          };

        const fallbackAdvisory =
          advisoryByPersona[selectedPersona.id] ??
          advisoryByPersona.runner;

        setRisk(fallbackRisk);
        setAdvisory(fallbackAdvisory);
      } finally {
        setIsLoadingAdvisory(false);
      }
    }

    loadAdvisory();
  }, [selectedPersona, environment]);

  const whatsappMessage = `
VayuShield Environmental Advisory

Location: ${environment.city}

AQI: ${environment.aqi}

Temperature: ${environment.temperature}°C

Personal Risk: ${risk.score}/100 — ${risk.level}

${advisory.headline}

${advisory.advisory}

Precautions:

${advisory.precautions.map((item) => `• ${item}`).join("\n")}
`;

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xl font-semibold tracking-tight">
              VayuShield
            </div>

            <div className="text-xs text-zinc-500">
              Personal Environmental Intelligence
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-zinc-300">
              {environment.city}
            </div>

            <div className="text-xs text-zinc-500">
              {isLoadingEnvironment
                ? "Updating environment..."
                : backendError
                  ? "Demo environment"
                  : "Live environment"}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* HERO */}
        <section className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Environmental health intelligence
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            The air is the same.
            <br />

            <span className="text-zinc-500">
              Your risk isn't.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            VayuShield combines your personal profile with current
            environmental conditions to create a personalized health
            advisory.
          </p>
        </section>

        {/* PERSONA */}
        <PersonaSwitcher
          personas={personas}
          selectedId={selectedPersona.id}
          onSelect={setSelectedPersona}
        />

        <ProfileForm onApply={setSelectedPersona} />

        {/* ENVIRONMENT */}
        <section className="grid gap-5 lg:grid-cols-2">
          <WeatherCard data={environment} />

          <AQICard data={environment} />
        </section>

        {/* RISK */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Personal risk
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                {isLoadingAdvisory
                  ? "ANALYZING"
                  : risk.level}
              </h2>

              <p className="mt-2 text-zinc-500">
                {isLoadingAdvisory
                  ? "Generating your personalized environmental assessment..."
                  : "Based on your current persona and environment"}
              </p>
            </div>

            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <div className="text-center">
                <div className="text-4xl font-semibold">
                  {risk.score}
                </div>

                <div className="text-xs text-zinc-500">
                  / 100
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ADVISORY + PROFILE */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <AdvisoryCard data={advisory} />

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Current profile
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-zinc-500">
                  Age
                </p>

                <p className="mt-1 text-white">
                  {selectedPersona.age}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Health condition
                </p>

                <p className="mt-1 text-white">
                  {selectedPersona.healthCondition}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Occupation
                </p>

                <p className="mt-1 text-white">
                  {selectedPersona.occupation}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <WhatsAppButton message={whatsappMessage} />
            </div>
          </div>
        </section>

        {/* WEEKLY TREND PLACEHOLDER */}
        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            7-day environmental trend
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Your week at a glance
          </h2>

          <div className="mt-8 grid grid-cols-7 gap-2">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
              (day, index) => (
                <div
                  key={day}
                  className={`rounded-2xl p-4 text-center ${
                    index === 2
                      ? "border border-white/20 bg-white/10"
                      : "bg-white/[0.03]"
                  }`}
                >
                  <p className="text-xs text-zinc-500">
                    {day}
                  </p>

                  <p className="mt-3 text-lg font-medium">
                    {78 - index * 3}
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    AQI
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;