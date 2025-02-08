import StarIcon from "@/components/icons/StarIcon";

type EarnedPointsProps = {
  resources: {
    earnedPoints: string;
  };
  points: number;
};

export default function EarnedPoints(props: EarnedPointsProps) {
  const { points, resources } = props;

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <h3 className="text-xl font-semibold capitalize">
        {resources["earnedPoints"]}
      </h3>

      <div className="flex items-center gap-1">
        <StarIcon className="size-5" />

        <span className="text-lg leading-none">{points}</span>
      </div>
    </div>
  );
}
