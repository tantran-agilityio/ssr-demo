import { Suspense } from "react";
import InnerComponent from "../../components/InnerComponent";

const fetchData = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return res.json();
};

const HomePage = () => {
  const dataPromise = fetchData();
  // const dataPromise: any = async () => {
  //   'use server';
  //   // call API
  //   return await fetchData();
  // }
  console.log("this is message from server component");

  return (
    <div>
      <Suspense fallback="loading...">
        <InnerComponent promise={dataPromise} />
        Hello world
      </Suspense>
    </div>
  );
};

export default HomePage;
