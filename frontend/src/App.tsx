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
  getHistory,
  compareLocations,
} from "./services/api";

import type {
  HistoryData,
  LocationComparisonData,
} from "./types";

import {
  personas,
  environment as mockEnvironment,
  riskByPersona,
  advisoryByPersona,
} from "./data/mockData";

function App() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);

  // Environmental data
  const [environment, setEnvironment] = useState(mockEnvironment);

  // Personalized risk and advisory
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

  // Loading states
  const [isLoadingEnvironment, setIsLoadingEnvironment] =
    useState(false);

  const [isLoadingAdvisory, setIsLoadingAdvisory] =
    useState(false);

  const [isLoadingHistory, setIsLoadingHistory] =
    useState(false);

  const [isLoadingComparison, setIsLoadingComparison] =
    useState(false);

  // Backend status
  const [backendError, setBackendError] = useState(false);

  // New backend data
  const [history, setHistory] =
    useState<HistoryData | null>(null);

  const [locationComparison, setLocationComparison] =
    useState<LocationComparisonData | null>(null);

  // --------------------------------------------------
  // LOAD LIVE ENVIRONMENT
  // --------------------------------------------------

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

  // --------------------------------------------------
  // LOAD PERSONALIZED AI ADVISORY
  // --------------------------------------------------

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

        // Fall back to mock data if backend is unavailable.
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

  // --------------------------------------------------
  // LOAD ENVIRONMENTAL HISTORY
  // --------------------------------------------------

  useEffect(() => {
    async function loadHistory() {
      try {
        setIsLoadingHistory(true);

        const data = await getHistory();

        setHistory(data);
      } catch (error) {
        console.error("History error:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadHistory();
  }, []);

  // --------------------------------------------------
  // LOAD LOCATION COMPARISON
  // --------------------------------------------------

  useEffect(() => {
    async function loadLocationComparison() {
      try {
        setIsLoadingComparison(true);

        const data = await compareLocations(
          "Delhi",
          "Mumbai",
        );

        setLocationComparison(data);
      } catch (error) {
        console.error(
          "Location comparison error:",
          error,
        );
      } finally {
        setIsLoadingComparison(false);
      }
    }

    loadLocationComparison();
  }, []);

  // --------------------------------------------------
  // WHATSAPP MESSAGE
  // --------------------------------------------------

  const whatsappMessage = `
VayuShield Environmental Advisory

Location: ${environment.city}

AQI: ${environment.aqi}

Temperature: ${environment.temperature}°C

Personal Risk: ${risk.score}/100 — ${risk.level}

${advisory.headline}

${advisory.advisory}

Precautions:

${advisory.precautions
  .map((item) => `• ${item}`)
  .join("\n")}
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
            VayuShield combines your personal profile with
            current environmental conditions to create a
            personalized health advisory.
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

        {/* PERSONAL RISK */}

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

        {/* 7-DAY HISTORY */}

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Environmental history
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {history?.city
              ? `${history.city} — recent conditions`
              : "Environmental trend"}
          </h2>

          {isLoadingHistory ? (
            <div className="mt-8 rounded-2xl bg-white/[0.03] p-6 text-sm text-zinc-500">
              Loading environmental history...
            </div>
          ) : history ? (
            <div className="mt-8 overflow-x-auto">
              <div className="grid min-w-[500px] grid-cols-3 gap-3">
                <div className="text-xs uppercase tracking-wider text-zinc-600">
                  Time
                </div>

                <div className="text-xs uppercase tracking-wider text-zinc-600">
                  AQI
                </div>

                <div className="text-xs uppercase tracking-wider text-zinc-600">
                  PM2.5
                </div>

                {history.timestamps.map(
                  (timestamp, index) => (
                    <div
                      key={`${timestamp}-${index}`}
                      className="contents"
                    >
                      <div className="rounded-xl bg-white/[0.03] p-3 text-sm text-zinc-400">
                        {new Date(
                          timestamp,
                        ).toLocaleString([], {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3 text-sm text-white">
                        {history.aqi_trend[index] ?? "—"}
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3 text-sm text-zinc-300">
                        {history.pm25_trend[index] ?? "—"}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-white/[0.03] p-6 text-sm text-zinc-500">
              Historical data is currently unavailable.
            </div>
          )}
        </section>

        {/* LOCATION COMPARISON */}

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Location intelligence
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Find the safer environment
          </h2>

          {isLoadingComparison ? (
            <div className="mt-8 rounded-2xl bg-white/[0.03] p-6 text-sm text-zinc-500">
              Comparing environments...
            </div>
          ) : locationComparison ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Origin
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  {locationComparison.origin.city}
                </h3>

                <div className="mt-5 flex gap-8">
                  <div>
                    <p className="text-xs text-zinc-500">
                      AQI
                    </p>

                    <p className="mt-1 text-2xl text-white">
                      {locationComparison.origin.aqi}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      PM2.5
                    </p>

                    <p className="mt-1 text-2xl text-white">
                      {locationComparison.origin.pm25}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Destination
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  {locationComparison.destination.city}
                </h3>

                <div className="mt-5 flex gap-8">
                  <div>
                    <p className="text-xs text-zinc-500">
                      AQI
                    </p>

                    <p className="mt-1 text-2xl text-white">
                      {locationComparison.destination.aqi}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      PM2.5
                    </p>

                    <p className="mt-1 text-2xl text-white">
                      {locationComparison.destination.pm25}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-center md:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Safer option
                </p>

                <p className="mt-2 text-xl font-semibold text-white">
                  {locationComparison.safer_option}
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Currently showing lower environmental risk
                  based on the comparison data.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-white/[0.03] p-6 text-sm text-zinc-500">
              Location comparison is currently unavailable.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;