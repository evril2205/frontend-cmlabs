interface Props {
  label: string;
  value: string;
}

export default function DisabledInput({ label, value }: Props) {
  return (
    <div className="mb-4">
      <label className="text-sm font-semibold">{label}</label>
      <input
        disabled
        value={value}
        className="w-full mt-1 h-[44px] px-4 border rounded bg-gray-100 text-sm"
      />
    </div>
  );
}
