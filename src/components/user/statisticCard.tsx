interface StatisticCardProps {
  title: string;
  value: string | number;
}

export const StatisticCard = (props: StatisticCardProps) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 space-y-2 w-auto">
      <p className="text-gray-500 text-sm">{props.title}</p>
      <p className="text-2xl font-semibold tracking-tight">{props.value}</p>
    </div>
  );
};
