import { useState, useEffect } from "react";
import { 
  CELESTIAL_BODIES_INFO, 
  SPACE_MISSIONS_INFO, 
  ASTRONOMICAL_CONCEPTS_INFO,
  CelestialBodyInfo,
  SpaceMissionInfo,
  AstronomicalConceptInfo
} from "../../lib/educational-content";
import { useSpaceStore } from "../../lib/stores/useSpaceStore";
import { cn } from "../../lib/utils";

/**
 * Educational Panel component displays detailed information about 
 * celestial bodies, space missions, and astronomical concepts
 */
interface EducationalPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const EducationalPanel: React.FC<EducationalPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bodies' | 'missions' | 'concepts'>('bodies');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const focusedBody = useSpaceStore(state => state.focusedBody);
  
  // When a new body is focused, update the selected item
  useEffect(() => {
    if (focusedBody) {
      setSelectedItemId(focusedBody);
      setActiveTab('bodies');
    }
  }, [focusedBody]);
  
  // Get selected item info based on active tab
  const getSelectedItem = () => {
    if (!selectedItemId) return null;
    
    switch (activeTab) {
      case 'bodies':
        return CELESTIAL_BODIES_INFO.find(body => body.id === selectedItemId) as CelestialBodyInfo | null;
      case 'missions':
        return SPACE_MISSIONS_INFO.find(mission => mission.id === selectedItemId) as SpaceMissionInfo | null;
      case 'concepts':
        return ASTRONOMICAL_CONCEPTS_INFO.find(concept => concept.id === selectedItemId) as AstronomicalConceptInfo | null;
      default:
        return null;
    }
  };
  
  // Use type guards to safely access properties
  const selectedItem = getSelectedItem();
  
  // Type guards for checking the type of the selected item
  const isBodyInfo = (item: any): item is CelestialBodyInfo => 
    Boolean(item && 'type' in item && 'composition' in item);
  
  const isMissionInfo = (item: any): item is SpaceMissionInfo => 
    Boolean(item && 'agency' in item && 'objectives' in item);
  
  const isConceptInfo = (item: any): item is AstronomicalConceptInfo => 
    Boolean(item && 'details' in item && 'relatedConcepts' in item && 'scientificImportance' in item);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed top-0 right-0 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-full bg-black bg-opacity-90 text-white overflow-auto z-50 border-l border-[#1A237E] shadow-xl transition-all">
      {/* Panel Header */}
      <div className="sticky top-0 bg-[#1A237E] p-4 flex justify-between items-center z-10">
        <h2 className="text-xl font-bold">Space Education Center</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#4FC3F7] hover:bg-opacity-20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-[#1A237E]">
        <button 
          className={cn(
            "flex-1 p-4 transition-colors",
            activeTab === 'bodies' ? "bg-[#1A237E] text-white" : "hover:bg-[#1A237E] hover:bg-opacity-50"
          )}
          onClick={() => setActiveTab('bodies')}
        >
          Celestial Bodies
        </button>
        <button 
          className={cn(
            "flex-1 p-4 transition-colors",
            activeTab === 'missions' ? "bg-[#1A237E] text-white" : "hover:bg-[#1A237E] hover:bg-opacity-50"
          )}
          onClick={() => setActiveTab('missions')}
        >
          Space Missions
        </button>
        <button 
          className={cn(
            "flex-1 p-4 transition-colors",
            activeTab === 'concepts' ? "bg-[#1A237E] text-white" : "hover:bg-[#1A237E] hover:bg-opacity-50"
          )}
          onClick={() => setActiveTab('concepts')}
        >
          Concepts
        </button>
      </div>
      
      <div className="flex h-[calc(100%-112px)]">
        {/* Sidebar List */}
        <div className="w-1/3 border-r border-[#1A237E] overflow-y-auto">
          {activeTab === 'bodies' && (
            <ul>
              {CELESTIAL_BODIES_INFO.map(body => (
                <li 
                  key={body.id}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-[#1A237E] hover:bg-opacity-50 transition-colors border-b border-[#1A237E] border-opacity-50",
                    selectedItemId === body.id ? "bg-[#1A237E] bg-opacity-70" : ""
                  )}
                  onClick={() => setSelectedItemId(body.id)}
                >
                  <div className="font-medium">{body.name}</div>
                  <div className="text-xs text-gray-400">{body.type}</div>
                </li>
              ))}
            </ul>
          )}
          
          {activeTab === 'missions' && (
            <ul>
              {SPACE_MISSIONS_INFO.map(mission => (
                <li 
                  key={mission.id}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-[#1A237E] hover:bg-opacity-50 transition-colors border-b border-[#1A237E] border-opacity-50",
                    selectedItemId === mission.id ? "bg-[#1A237E] bg-opacity-70" : ""
                  )}
                  onClick={() => setSelectedItemId(mission.id)}
                >
                  <div className="font-medium">{mission.name}</div>
                  <div className="text-xs text-gray-400">{mission.agency}</div>
                </li>
              ))}
            </ul>
          )}
          
          {activeTab === 'concepts' && (
            <ul>
              {ASTRONOMICAL_CONCEPTS_INFO.map(concept => (
                <li 
                  key={concept.id}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-[#1A237E] hover:bg-opacity-50 transition-colors border-b border-[#1A237E] border-opacity-50",
                    selectedItemId === concept.id ? "bg-[#1A237E] bg-opacity-70" : ""
                  )}
                  onClick={() => setSelectedItemId(concept.id)}
                >
                  <div className="font-medium">{concept.name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Content Area */}
        <div className="w-2/3 p-4 overflow-y-auto">
          {selectedItem ? (
            <div>
              <h3 className="text-2xl font-bold mb-2 text-[#4FC3F7]">
                {'name' in selectedItem ? selectedItem.name : ''}
              </h3>
              
              {activeTab === 'bodies' && 'type' in selectedItem && (
                <div className="space-y-4">
                  <div className="bg-[#1A237E] bg-opacity-30 p-2 rounded text-sm inline-block">
                    {selectedItem.type}
                  </div>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Overview</h4>
                  <p className="text-sm leading-relaxed">{selectedItem.overview}</p>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Composition</h4>
                  <p className="text-sm leading-relaxed">{selectedItem.composition}</p>
                  
                  {selectedItem.atmosphere && (
                    <>
                      <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Atmosphere</h4>
                      <p className="text-sm leading-relaxed">{selectedItem.atmosphere}</p>
                    </>
                  )}
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Notable Features</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {selectedItem.notableFeatures.map((feature, index) => (
                      <li key={index} className="mb-1">{feature}</li>
                    ))}
                  </ul>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Exploration History</h4>
                  <div className="space-y-3">
                    {selectedItem.explorationHistory.map((mission, index) => (
                      <div key={index} className="bg-black bg-opacity-40 p-3 rounded">
                        <h5 className="font-medium text-[#FFA726]">{mission.title}</h5>
                        <p className="text-sm mt-1">{mission.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Fun Facts</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {selectedItem.funFacts.map((fact, index) => (
                      <li key={index} className="mb-1">{fact}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'missions' && 'agency' in selectedItem && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-[#1A237E] bg-opacity-30 p-2 rounded text-sm inline-block">
                      {selectedItem.agency}
                    </div>
                    <div className="bg-[#1A237E] bg-opacity-30 p-2 rounded text-sm inline-block">
                      Launch: {selectedItem.launchDate}
                    </div>
                    <div className={cn(
                      "p-2 rounded text-sm inline-block",
                      selectedItem.status === 'Active' ? "bg-green-800 bg-opacity-50" :
                      selectedItem.status === 'Completed' ? "bg-blue-800 bg-opacity-50" :
                      selectedItem.status === 'Planned' ? "bg-yellow-800 bg-opacity-50" :
                      "bg-red-800 bg-opacity-50"
                    )}>
                      {selectedItem.status}
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Overview</h4>
                  <p className="text-sm leading-relaxed">{selectedItem.overview}</p>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Objectives</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {selectedItem.objectives.map((objective, index) => (
                      <li key={index} className="mb-1">{objective}</li>
                    ))}
                  </ul>
                  
                  {selectedItem.accomplishments && (
                    <>
                      <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Accomplishments</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {selectedItem.accomplishments.map((accomplishment, index) => (
                          <li key={index} className="mb-1">{accomplishment}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  {selectedItem.additionalResources && (
                    <>
                      <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Additional Resources</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {selectedItem.additionalResources.map((resource, index) => (
                          <li key={index} className="mb-1">
                            {resource.split(': ')[0]}: 
                            <a 
                              href={resource.split(': ')[1]} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#4FC3F7] hover:underline ml-1"
                            >
                              {resource.split(': ')[1]}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
              
              {activeTab === 'concepts' && isConceptInfo(selectedItem) && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Overview</h4>
                  <p className="text-sm leading-relaxed">{selectedItem.overview}</p>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Details</h4>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {selectedItem.details}
                  </div>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Related Concepts</h4>
                  <ul className="flex flex-wrap gap-2">
                    {selectedItem.relatedConcepts.map((concept: string, index: number) => (
                      <li key={index} className="bg-[#1A237E] bg-opacity-30 px-2 py-1 rounded text-sm">
                        {concept}
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Scientific Importance</h4>
                  <p className="text-sm leading-relaxed">{selectedItem.scientificImportance}</p>
                  
                  {selectedItem.additionalResources && (
                    <>
                      <h4 className="text-lg font-semibold border-b border-[#4FC3F7] pb-1 mt-4">Additional Resources</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {selectedItem.additionalResources.map((resource, index) => (
                          <li key={index} className="mb-1">
                            {resource.split(': ')[0]}: 
                            <a 
                              href={resource.split(': ')[1]} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#4FC3F7] hover:underline ml-1"
                            >
                              {resource.split(': ')[1]}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                  <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                  <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                  <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                  <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                </svg>
                <p>Select an item from the list to view detailed information.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationalPanel;