import { hours } from "@/lib/site";

export function HoursTable() {
  return (
    <div>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Shop and café hours</caption>
        <thead>
          <tr className="border-b border-line text-ink/70">
            <th className="py-3 pr-4 font-medium" scope="col">
              When
            </th>
            <th className="py-3 pr-4 font-medium" scope="col">
              Shop
            </th>
            <th className="py-3 font-medium" scope="col">
              Café
            </th>
          </tr>
        </thead>
        <tbody>
          {hours.map((row) => (
            <tr key={row.when} className="border-b border-line">
              <th className="py-4 pr-4 font-serif text-xl font-medium" scope="row">
                {row.when}
              </th>
              <td className="py-4 pr-4">{row.shop}</td>
              <td className="py-4">{row.cafe}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 max-w-[48ch] text-ink/80">
        On public holidays the kitchen closes at 3:00. The shop stays open until 3:30.
      </p>
    </div>
  );
}
