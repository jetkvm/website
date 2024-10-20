export default function DataTable({
  headline,
  data,
}: {
  headline: string;
  data: { key: string; value: string }[];
}) {
  return (
    <>
      <h3 className="text-lg font-semibold">{headline}</h3>
      <div className="border-800/10 flex justify-between border-y py-4 font-display">
        {data?.map(x => (
          <div key={x.key}>
            <div className="text-xs text-gray-600">{x.key}</div>
            <div className="text-base font-medium text-black">{x.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}
