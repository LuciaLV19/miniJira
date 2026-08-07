import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./components/views/Home";
import ProjectView from "./components/views/ProjectView";
import Layout from "./components/layouts/Layout";
import { Toaster } from "sonner";
import LoginPage from "./components/views/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="project/:id" element={<ProjectView />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={<div className="p-6">Ruta no encontrada</div>}
        />
      </Routes>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "w-full flex gap-1 p-4 rounded font-mono text-xs uppercase tracking-wider backdrop-blur-md bg-black/90 shadow-lg border transition-all",
            success:
              "border-neon-cyan/50 text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]",
            error:
              "border-neon-magenta/60 text-neon-magenta shadow-[0_0_15px_rgba(236,72,153,0.2)]",
            title: "font-bold text-xs",
            description: "text-[10px] opacity-80 lowercase",
          },
        }}
      />
    </>
  );
}

export default App;
