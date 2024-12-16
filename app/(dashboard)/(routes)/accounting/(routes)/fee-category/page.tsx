import ClientComp from "./components/client-comp";

const FeeCategoryPage = async () => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold my-1">Fee - Category</h1>
      </header>

      <ClientComp />
    </div>
  );
};

export default FeeCategoryPage;
