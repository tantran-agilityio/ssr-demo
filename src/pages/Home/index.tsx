import { Suspense } from "react";
import { ClientComponent } from "../../components";

const HomePage = async () => {
  // Call the API request but don’t get the result yet. Keep the promise to use later with <Suspense>
  const dataPromise = fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );

  // Initialize the console to check whether it shows on the browser
  const componentType = typeof window === "undefined" ? "server" : "client";
  console.log("Type of component is: ", componentType);

  return (
    <div>
      <p>This is a Server component</p>

      <Suspense fallback="loading...">
        <ClientComponent promise={dataPromise} />
      </Suspense>
    </div>
  );
};

export default HomePage;
