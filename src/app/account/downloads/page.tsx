const mockFiles = [
  { name: "Fixture_v2.stl", type: "3D Print", updatedAt: "2024-12-10" },
  { name: "PowerBoard_v5.zip", type: "PCB Gerber", updatedAt: "2024-11-03" },
];

export default function DownloadsPage() {
  return (
    <section className="section-container space-y-6 py-12">
      <h1 className="text-3xl font-heading font-semibold text-zinc-900">
        Download center
      </h1>
      <div className="card divide-y divide-zinc-100">
        {mockFiles.map((file) => (
          <div
            key={file.name}
            className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-zinc-900">{file.name}</p>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {file.type}
              </p>
            </div>
            <div className="text-sm text-zinc-500">
              Updated {file.updatedAt}
            </div>
            <button className="text-sm font-semibold text-brand-dark">
              Download
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

