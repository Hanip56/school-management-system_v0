type Props = {
  title: string;
  lists: { label: string; content: string }[];
};

const GridInfo = ({ title, lists }: Props) => {
  return (
    <div className="py-4">
      <h6 className="font-semibold mb-4">{title}</h6>
      <div className="grid gap-4 sm:gap-y-6 grid-cols-1 sm:grid-cols-2 font-medium">
        {lists.map((list) => (
          <div key={list.label}>
            <div className="text-sm  text-zinc-500 mb-1">{list.label}</div>
            <div className="text-[0.925rem]">{list.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridInfo;
