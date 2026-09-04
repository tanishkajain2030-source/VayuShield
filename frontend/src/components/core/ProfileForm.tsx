import { useState } from "react";
import type { Persona } from "../../types";

type Props = {
  onApply: (profile: Persona) => void;
};

export default function ProfileForm({ onApply }: Props) {
  const [age, setAge] = useState("21");
  const [healthCondition, setHealthCondition] = useState("None");
  const [occupation, setOccupation] = useState("Student");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const customProfile: Persona = {
      id: "custom",
      name: "Custom Profile",
      icon: "✦",
      age: Number(age),
      healthCondition,
      occupation,
    };

    onApply(customProfile);
  };

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Custom profile
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-white">
          Build your own profile
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          Personalize your environmental risk assessment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-3"
      >
        <div>
          <label className="mb-2 block text-xs text-zinc-500">
            Age
          </label>

          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-zinc-500">
            Health condition
          </label>

          <select
            value={healthCondition}
            onChange={(event) =>
              setHealthCondition(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          >
            <option>None</option>
            <option>Asthma</option>
            <option>Heart Condition</option>
            <option>Diabetes</option>
            <option>Respiratory Condition</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs text-zinc-500">
            Occupation
          </label>

          <select
            value={occupation}
            onChange={(event) =>
              setOccupation(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          >
            <option>Student</option>
            <option>Office Worker</option>
            <option>Outdoor Worker</option>
            <option>Athlete</option>
            <option>Retired</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Apply Profile →
          </button>
        </div>
      </form>
    </section>
  );
}