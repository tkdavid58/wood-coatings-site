import { isAdminAuthenticated } from "@/lib/auth";
import { countProducts, getAllTypes } from "@/lib/db";
import { createProductAction, loginAction, logoutAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  "wrong-password": "That password is incorrect.",
  "not-authenticated": "Your session expired. Please log in again.",
  "missing-fields": "Product name and type are required.",
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const errorCode = firstValue(sp.error);
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
        <h1 className="mb-1 text-xl font-semibold text-foreground">Admin login</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Log in to add new products to the catalog.
        </p>
        {errorCode && (
          <p className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {ERROR_MESSAGES[errorCode] ?? "Something went wrong."}
          </p>
        )}
        <form action={loginAction} className="flex flex-col gap-3">
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  const types = getAllTypes();
  const total = countProducts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Add a product</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "product" : "products"} currently in the catalog.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Log out
          </button>
        </form>
      </div>

      {errorCode && (
        <p className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {ERROR_MESSAGES[errorCode] ?? "Something went wrong."}
        </p>
      )}

      <form action={createProductAction} className="flex flex-col gap-5">
        <datalist id="type-options">
          {types.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>

        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Product name" name="name" required />
          <Field label="Brand" name="brand" />
          <Field label="Type" name="type" required listId="type-options" />
          <Field
            label="Use cases"
            name="use_cases"
            placeholder="Comma-separated, e.g. Flooring, Furniture"
          />
          <Field label="Sheen" name="sheen" placeholder="e.g. Satin" />
          <Field
            label="Application method"
            name="application_method"
            placeholder="e.g. Brush, Roller, Spray"
          />
          <Field label="Recommended coats" name="coats_recommended" placeholder="e.g. 2-3 coats" />
          <Field label="Coverage" name="coverage" placeholder="e.g. 10-12 m² per liter" />
          <Field label="Dry time (touch)" name="dry_time_touch" placeholder="e.g. 30 minutes" />
          <Field label="Dry time (recoat)" name="dry_time_recoat" placeholder="e.g. 2-3 hours" />
          <Field label="Cure time (full)" name="dry_time_cure" placeholder="e.g. 14 days" />
          <Field label="VOC content" name="voc_content" placeholder="e.g. < 250 g/L" />
          <Field label="Thinner / cleanup" name="thinner_cleanup" placeholder="e.g. Water" />
          <Field label="SKU" name="sku" />
          <Field
            label="Source / datasheet URL"
            name="source_url"
            placeholder="Link to the manufacturer's product or TDS page"
          />
        </fieldset>

        <TextArea label="Description" name="description" />
        <TextArea label="Surface preparation" name="surface_prep" />

        <div>
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Add product
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  listId,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  listId?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        placeholder={placeholder}
        list={listId}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}
