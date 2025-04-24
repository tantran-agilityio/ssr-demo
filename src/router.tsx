import { Route, Routes } from 'react-router';

import { ContactPage, HomePage } from './pages';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};
