import type { Persona } from "../../types";

type Props = {
  personas: Persona[];
  selectedId: string;
  onSelect: (persona: Persona) => void;
};

export default function PersonaSwitcher({
  personas,
  selectedId,
  onSelect,
}: Props) {
  return (
    <section className="mb-10">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Personal profile
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Who are you today?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {personas.map((persona) => {
          const active = persona.id === selectedId;

          return (
            <button
              key={persona.id}
              onClick={() => onSelect(persona)}
              className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                active
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
              }`}
            >
              <div className="text-2xl">{persona.icon}</div>

              <div className="mt-3 font-medium text-white">
                {persona.name}
              </div>

              <div className="mt-1 text-xs text-zinc-500">
                {persona.healthCondition}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
