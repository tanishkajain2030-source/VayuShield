import type { AdvisoryData } from "../../types";

type Props = {
  data: AdvisoryData;
};

export default function AdvisoryCard({ data }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        AI Advisory
      </p>

      <h3 className="mt-3 text-2xl font-semibold text-white">
        {data.headline}
      </h3>

      <p className="mt-4 leading-7 text-zinc-400">
        {data.advisory}
      </p>

      <div className="mt-6 space-y-3">
        {data.precautions.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300"
          >
            <span className="mr-2">→</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}