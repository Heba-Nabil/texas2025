type EmptyAddressesProps = {
  resources: {
    noAddresses: string;
    noAddressesDesc: string;
  };
};

export default function EmptyAddresses({ resources }: EmptyAddressesProps) {
  return (
    <div className="flex-center my-auto w-full flex-col gap-4 py-10">
      <img
        src="/images/icons/location.svg"
        alt="empty location"
        width={160}
        height={160}
        className="aspect-square max-w-full object-contain"
        loading="lazy"
      />
      <div className="text-center">
        <h3 className="text-xl font-semibold">{resources["noAddresses"]}</h3>
        <p>{resources["noAddressesDesc"]}</p>
      </div>
    </div>
  );
}
