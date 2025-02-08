type SuccessSectionProps = {
  resources: {
    orderSubmitSuccess: string;
    recieveEmailMsg: string;
    phone: string;
    at: string;
  };
  data: {
    Email: string;
    Phone: string;
  };
};

export default function SuccessSection(props: SuccessSectionProps) {
  const { resources, data } = props;

  return (
    <div className="flex-between">
      <div>
        <p className="text-xl font-bold">{resources["orderSubmitSuccess"]} </p>
        <p className="font-medium text-gray-500">
          {resources["recieveEmailMsg"]} {resources["at"]}{" "}
          <span className="text-alt underline">{data?.Email}</span>
        </p>
        <p className="font-medium text-gray-500">
          {resources["phone"]} : <bdi>{data?.Phone}</bdi>
        </p>
      </div>

      {/* <div className="flex-center">
        <img
          src="/images/icons/check.svg"
          alt="check"
          width={35}
          height={35}
          className="smooth object-contain"
        />
      </div> */}
    </div>
  );
}
