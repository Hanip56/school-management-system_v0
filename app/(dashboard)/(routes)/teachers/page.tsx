import ClientComp from "./components/client-comp";

const TeachersPage = async () => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ Teachers</p>
        <h1 className="text-3xl font-semibold my-1">
          List of users as Teacher
        </h1>
      </header>

      <ClientComp />
    </div>
  );
};

export default TeachersPage;
