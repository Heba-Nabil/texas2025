import RadioLabel from "@/components/ui/RadioLabel";
// Types
import { RewardsHistoryTabs } from "@/types";
import { RewardsHistoryPageResourcesProps } from "@/types/resources";

type PointsTabsProps = {
  tabs: RewardsHistoryTabs[];
  activeTab?: string;
  setActiveTab: (e: string) => void;
  resources: RewardsHistoryPageResourcesProps;
};

export default function PointsTabs(props: PointsTabsProps) {
  const { tabs, activeTab, setActiveTab, resources } = props;

  return (
    <div
      className="flex-center w-full gap-1 pt-5 sm:gap-2 md:gap-4"
      role="group"
      aria-label="Rewards History Tabs"
    >
      {tabs.map((item, index) => (
        <RadioLabel
          key={index}
          name="loyalty_tabs_options_wrapper"
          id={`loyalty_history_${item.label}`}
          checked={activeTab === item?.id}
          onChange={() => setActiveTab(item.id)}
          className="flex-1"
          labelClassName="gap-4 p-2 sm:p-4"
          markWrapperClassName="size-4 sm:size-6"
        >
          <span>
            {item.label}{" "}
            <span className="hidden sm:inline">{resources["points"]}</span>
          </span>
        </RadioLabel>
      ))}
    </div>
  );
}
