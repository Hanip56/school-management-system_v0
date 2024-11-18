const routes = [
  {
    label: "Profile",
    href: "profile",
  },
  {
    label: "Classes",
    href: "classes",
  },
];

const ClientComp = () => {
  return (
    <div className="bg-zinc-100 rounded-xl p-6 flex">
      {/* navigations */}
      <div className="basis-30 flex-shrink-0">
        <div></div>
      </div>
      {/* contents */}
      <div></div>
    </div>
  );
};

export default ClientComp;
