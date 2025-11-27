// src/components/TabSelectorComponent.tsx
import React, { ReactNode } from "react";

export type Tab = {
  id: string | number;
  title: string;
};


interface Props {
  tabs: Tab[];
  children: ReactNode[]; // expect an array of children, index-based
}

const TabSelector: React.FC<Props> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  return (
    <div>
      <div className="flex space-x-4 border-b border-gray-300 font-montserrat font-bold text-white uppercase">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`py-2 uppercase w-full px-4 focus:outline-none ${
              index === activeTab ? "border-b-2 border-orange-700" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="mt-4">{children[activeTab]}</div>
    </div>
  );
};

export default TabSelector;
