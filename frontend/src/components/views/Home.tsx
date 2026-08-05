import CreateProjectModal from "../projects/CreateProjectModal";
import { useProjectStore } from "../../store/useProjectStore";
import ProjectView from "./ProjectView";
import Sidebar from "../layouts/Sidebar";

export default function Home() {
  const isOpen = useProjectStore((state) => state.isOpenModalProject);

  return (
    <>
      {/* CREATE PROJECT MODAL */}
      {isOpen && <CreateProjectModal />}

      {/* MAIN CONTENT */}
      <div className="flex w-full h-full overflow-hidden font-terminal bg-cyber-bg text-white">
        {/* SIDE BAR WITH PROJECTS LIST */}
        <Sidebar />

        {/* VIEW OF SELECTED PROJECT */}
        <ProjectView />
      </div>
    </>
  );
}
