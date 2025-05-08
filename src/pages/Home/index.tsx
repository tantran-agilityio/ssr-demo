import { Suspense } from "react";
import { InnerComponent } from "../../components";

const getFakeData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // mô phỏng delay
  return ["apple", "banana", "cherry"];
};

const HomePage = () => {
  // Call the API request but don’t get the result yet. Keep the promise to use later with <Suspense>
  const dataPromise = fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );

  // const fruits = await getFakeData();

  const componentType = typeof window === "undefined" ? "server" : "client";

  // This is needed to understand whether the component is rendered on server or client
  // It is used in the example to show that the component is rendered on server
  // if (typeof window === "undefined") {
  //   console.log("Type of component is: ", componentType);
  // }
  console.log("Type of component is: ", componentType);

  return (
    <div>
      <p>This is a Server component</p>

      <Suspense fallback="loading...">
        <InnerComponent promise={dataPromise} />
      </Suspense>

      {/* <ul>
        {fruits.map((fruit) => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default HomePage;
