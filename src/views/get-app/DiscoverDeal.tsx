import { getSingleSectionMedia } from "@/server/services/globalService";

type DiscoverDealProps = {
  locale: string;
  pageName: string;
  UniqueName: string;
};

export default async function DiscoverDeal(props: DiscoverDealProps) {
  const { UniqueName, locale, pageName } = props;

  const discoverDealMediaResponse = await getSingleSectionMedia(
    locale,
    pageName,
    UniqueName,
  );

  if (!discoverDealMediaResponse?.data) return null;

  const discoverDealMedia = discoverDealMediaResponse?.data;

  return discoverDealMedia.map((item, i) => (
    <div key={i} className="rounded-lg">
      <video
        width="100%"
        autoPlay
        muted
        loop
        playsInline
        {...(item.ThumbnailImage && {
          poster: item.ThumbnailImage,
        })}
        id="video-one"
        className="h-[500px] rounded-3xl object-cover"
      >
        <source src={item.Video} type="video/mp4" />
      </video>
    </div>
  ));
}
