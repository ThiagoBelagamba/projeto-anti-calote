interface ClientCellProps {
  name?: string;
  whatsapp?: string;
  document?: string;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function ClientCell({ name, whatsapp, document }: ClientCellProps) {
  if (!name) {
    return <span className="text-slate-500">-</span>;
  }

  return (
    <div>
      <p className="font-medium text-white">{name}</p>
      {whatsapp && (
        <p className="text-xs text-slate-400">{formatPhone(whatsapp)}</p>
      )}
      {document && (
        <p className="text-xs text-slate-500">{document}</p>
      )}
    </div>
  );
}
