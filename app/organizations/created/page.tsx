export default function OrganizationCreatedPage() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">Organization created successfully!</h1>
      <a href="/organizations" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700">Go to My Organizations</a>
    </div>
  );
}
