"use client";

import { useData } from "@/providers/DataProvider";
import { findModuleItem } from "@/utils";
import PageHeader from "@/components/global/PageHeader";
import CareerItem from "./CareerItem";
// Types
import { CareersPageResourcesProps } from "@/types/resources";
import { CareersItemType, PageSectionResponseType } from "@/types/api";
import NextImage from "@/components/global/NextImage";

type CareersViewProps = {
  resources: CareersPageResourcesProps;
  sectionData: PageSectionResponseType;
  data: CareersItemType[];
};

export default function CareersView(props: CareersViewProps) {
  const { resources, sectionData, data } = props;

  const { Module } = useData();

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["careers"]}
            backHref="/"
            backTitle={resources["backToHome"]}
          />

          {findModuleItem(Module, "CAREERADVANCED")?.Status ? (
            <div className="mb-5 mt-10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {data?.map((item, index) => (
                  <CareerItem key={index} data={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="my-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div className="order-1 h-80 w-full overflow-hidden lg:order-2 lg:h-full">
                <NextImage
                  width={500}
                  height={500}
                  className="relative z-10 size-full rounded-md object-cover"
                  src={sectionData?.ImageUrl!}
                  alt="Careers"
                />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold capitalize">
                  {sectionData?.Name}
                </h2>
                <a
                  href="mailto:FFSUHR@olayanfood.com"
                  className="mb-10 text-lg font-semibold capitalize text-accent"
                >
                  {sectionData?.DescriptionShort}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
