"use client";

import { EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
// Types
import { UserSessionDataProps } from "@/types";

type UserInfoStepProps = {
  data: UserSessionDataProps;
  resources: {
    change: string;
  };
  // enableChange: boolean;
  handleChange: () => void;
};
export default function UserInfoStep(props: UserInfoStepProps) {
  const {
    data,
    resources,
    //  enableChange,
    handleChange,
  } = props;

  return (
    <div className="flex-between my-4 gap-1">
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-1">
          <UserIcon className="size-5 shrink-0" />
          {data?.firstName} {data?.lastName}
        </p>

        <p className="flex items-center gap-1">
          <EnvelopeIcon className="size-5 shrink-0" />
          {data?.email}
        </p>

        <p className="flex items-center gap-1">
          <PhoneIcon className="size-5 shrink-0" />
          <bdi>{data?.phone}</bdi>
        </p>
      </div>

      {/* {enableChange && (
        <Button variant="dark" onClick={handleChange}>
          {resources["change"]}
        </Button>
      )} */}
      <Button variant="dark" onClick={handleChange}>
        {resources["change"]}
      </Button>
    </div>
  );
}
