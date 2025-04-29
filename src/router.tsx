import { Route, Routes } from "react-router";

import { ContactPage, HomePage } from "./pages";
import MainLayout from "./layout";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
};
