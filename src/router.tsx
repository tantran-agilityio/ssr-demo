import { Route, Routes } from "react-router";

import { AboutPage, HomePage } from "./pages";

import { MainLayout } from "./layout";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path="/" element={<HomePage />} />
        <Route path="/contact" element={<AboutPage />} />
      </Route>
    </Routes>
  );
};
