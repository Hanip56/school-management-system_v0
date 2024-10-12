import NavMenu from "./nav-menu";

const Sidebar = () => {
  return (
    <>
      <div className="hidden md:flex fixed h-screen top-0 left-0 w-[var(--sidebar-width)] bg-zinc-100 p-2 py-4">
        <NavMenu />
      </div>
    </>
  );
};

export default Sidebar;
