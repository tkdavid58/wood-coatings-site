import type { Product } from "@/lib/types";

const ROWS: { label: string; key: keyof Product }[] = [
  { label: "Sheen", key: "sheen" },
  { label: "Application method", key: "application_method" },
  { label: "Recommended coats", key: "coats_recommended" },
  { label: "Coverage", key: "coverage" },
  { label: "Dry time (touch)", key: "dry_time_touch" },
  { label: "Dry time (recoat)", key: "dry_time_recoat" },
  { label: "Cure time (full)", key: "dry_time_cure" },
  { label: "VOC content", key: "voc_content" },
  { label: "Thinner / cleanup", key: "thinner_cleanup" },
  { label: "SKU", key: "sku" },
];

export default function DataSheetTable({ product }: { product: Product }) {
  const rows = ROWS.filter((row) => product[row.key]);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
        Detailed specifications for this product could not be confirmed from public sources.
        {product.source_url ? " See the official datasheet linked below." : ""}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted"}>
              <th className="w-1/3 px-4 py-3 text-left font-medium text-muted-foreground">
                {row.label}
              </th>
              <td className="px-4 py-3 text-foreground">{product[row.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
