interface Props {
  name: string;
  details: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, details }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex-1 loading-6">{name}</h2>
      </div>
      {details && <p className="text-sm text-gray-400">{details}</p>}
    </div>
  );
};
