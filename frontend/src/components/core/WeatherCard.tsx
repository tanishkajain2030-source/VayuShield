import type { EnvironmentData } from "../../types";

type Props = {
  data: EnvironmentData;
};

export default function WeatherCard({ data }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-zinc-500">Temperature</p>

      <div className="mt-3 text-5xl font-semibold tracking-tight text-white">
        {data.temperature}°
      </div>

      <p className="mt-2 text-sm text-zinc-400">
        {data.city} · Current conditions
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs text-zinc-500">Humidity</p>
          <p className="mt-1 text-lg text-white">{data.humidity}%</p>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs text-zinc-500">UV Index</p>
          <p className="mt-1 text-lg text-white">{data.uvIndex}</p>
        </div>
      </div>
    </div>
  );
}
