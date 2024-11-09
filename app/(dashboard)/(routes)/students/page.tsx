import ClientComp from "./components/client-comp";

const StudentsPage = async () => {
  return (
    <div className="container">
      <header className="mb-6">
        <p className="font-medium">✨ Students</p>
        <h1 className="text-3xl font-semibold my-1">
          List of users as Student
        </h1>
      </header>

      <ClientComp />
    </div>
  );
};

export default StudentsPage;
