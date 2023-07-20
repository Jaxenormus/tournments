interface TournamentDetailListItemProps {
  name: string;
  value: string;
}

export const TournamentDetailListItem = (
  props: TournamentDetailListItemProps
) => (
  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <div className="flex items-center flex-row space-x-1">
      <dt className="text-sm font-medium leading-6 text-gray-900">
        {props.name}
      </dt>
    </div>
    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
      {props.value}
    </dd>
  </div>
);
