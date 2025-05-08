import { Route, Routes } from "react-router";

import { lazy } from "react";

const HomePage = lazy(() => import("./pages/Home"));
const AboutPage = lazy(() => import("./pages/About"));

import { MainLayout } from "./layout";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
};
