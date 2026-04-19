import { lazy, Suspense } from "react";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const SearchPage = lazy(() => import("./pages/Search.jsx"));
const NotFoundPage = lazy(() => import("./pages/404.jsx"));
const JobDetail = lazy(() => import("./pages/Detail.jsx"));

import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<p>Cargando...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
