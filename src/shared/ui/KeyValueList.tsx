type Item = {
  label: string;
  value: string;
  href?: string;
};

type KeyValueListProps = {
  items: Item[];
};

export function KeyValueList({ items }: KeyValueListProps) {
  return (
    <dl className="key-value-list">
      {items.map((item) => (
        <div key={item.label} className="key-value-row">
          <dt>{item.label}</dt>
          <dd>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
