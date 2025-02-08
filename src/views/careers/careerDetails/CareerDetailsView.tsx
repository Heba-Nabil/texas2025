import PageHeader from "@/components/global/PageHeader";
import NextImage from "@/components/global/NextImage";
import CareerForm from "./CareerForm";
// Types
import { CareersDetailsPageResourcesProps } from "@/types/resources";
import { CareersItemType } from "@/types/api";

type CareerDetailsViewProps = {
  locale: string;
  resources: CareersDetailsPageResourcesProps;
  data: CareersItemType;
};

export default function CareerDetailsView(props: CareerDetailsViewProps) {
  const { locale, resources, data } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={data?.Title?.trim()}
            backHref="/careers"
            backTitle={resources["backToCareers"]}
          />

          <div className="my-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="order-1 h-80 w-full overflow-hidden lg:order-2 lg:h-full">
              {data.ImageActual && (
                <NextImage
                  width={500}
                  height={500}
                  className="relative z-10 size-full rounded-md object-cover"
                  src={data.ImageActual}
                  alt=""
                />
              )}
            </div>
            <div>
              {data.Description && (
                <div dangerouslySetInnerHTML={{ __html: data.Description }} />
              )}
            </div>
          </div>
        </div>

        <div className="mb-5" />

        <div className="rounded-lg bg-white p-5">
          <h2 className="text-2xl font-semibold capitalize">
            {resources["personalParticulars"]}
          </h2>
          <h3 className="mb-10 text-lg font-semibold capitalize text-accent">
            {resources["applyNow"]}
          </h3>

          <CareerForm locale={locale} resources={resources} data={data} />
        </div>
      </div>
    </div>
  );
}
