import { Suspense } from "react";
import InnerComponent from "../../components/InnerComponent";

const HomePage = () => {
  // Call the API request but don’t get the result yet. Keep the promise to use later with <Suspense>
  const dataPromise = fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );

  const componentType = typeof window === "undefined" ? "server" : "client";

  // This is needed to understand whether the component is rendered on server or client
  // It is used in the example to show that the component is rendered on server
  if (typeof window === "undefined") {
    console.log("Type of component is: ", componentType);
  }

  return (
    <div>
      <p>This is Home page</p>

      <Suspense fallback="loading...">
        <InnerComponent promise={dataPromise} />
      </Suspense>
    </div>
  );
};

export default HomePage;
