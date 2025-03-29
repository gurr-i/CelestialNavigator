import { useSpaceStore } from "../../lib/stores/useSpaceStore";

/**
 * EducationButton component provides a UI button to toggle the educational panel
 */
export function EducationButton() {
  const isEducationalPanelOpen = useSpaceStore(state => state.isEducationalPanelOpen);
  const toggleEducationalPanel = useSpaceStore(state => state.toggleEducationalPanel);
  
  return (
    <button
      onClick={toggleEducationalPanel}
      className="flex items-center justify-center w-full p-2 bg-[#FFA726] hover:bg-[#FB8C00] rounded-md transition-all duration-150 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] focus:ring-opacity-50"
      title="Space Education Center"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
        <path d="M12 14l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 016.824-2.998a12.078 12.078 0 00-.665-6.479L12 14z"></path>
      </svg>
      Space Education Center
    </button>
  );
}