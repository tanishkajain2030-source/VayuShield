import type { EnvironmentData } from "../../types";

type Props = {
  data: EnvironmentData;
};

export default function AQICard({ data }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">Air Quality Index</p>

          <div className="mt-3 text-5xl font-semibold text-white">
            {data.aqi}
          </div>
        </div>

        <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
          Moderate
        </span>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-xs text-zinc-500">
          <span>PM2.5</span>
          <span>{data.pm25} µg/m³</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-yellow-400"
            style={{ width: `${Math.min(data.aqi, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
