import { Suspense } from "react";
import InnerComponent from "../../components/InnerComponent";

const HomePage = () => {
  const dataPromise = fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );

  const componentType = typeof window === "undefined" ? "server" : "client";

  console.log("Type of component is: ", componentType);

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
