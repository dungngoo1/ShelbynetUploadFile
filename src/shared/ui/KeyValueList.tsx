import { useState } from "react";
import { copyText } from "@/shared/lib/clipboard";

type Item = {
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
};

type KeyValueListProps = {
  items: Item[];
};

export function KeyValueList({ items }: KeyValueListProps) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  async function handleCopy(label: string, value: string) {
    const success = await copyText(value);
    if (!success) return;

    setCopiedLabel(label);
    window.setTimeout(() => {
      setCopiedLabel((current) => (current === label ? null : current));
    }, 1600);
  }

  return (
    <dl className="key-value-list">
      {items.map((item) => {
        const copyValue = item.copyValue ?? item.href ?? item.value;

        return (
          <div key={item.label} className="key-value-row">
            <dt>{item.label}</dt>
            <dd className="key-value-actions">
              {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
              <button
                type="button"
                className="mini-copy-button"
                onClick={() => void handleCopy(item.label, copyValue)}
              >
                {copiedLabel === item.label ? "Copied" : "Copy"}
              </button>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
