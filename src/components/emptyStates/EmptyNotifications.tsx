type EmptyNotificationProps = {
  resources: {
    noNotificationsYet: string;
  };
};

export default function EmptyNotifications({
  resources,
}: EmptyNotificationProps) {
  return (
    <div className="flex-center my-auto w-full flex-col gap-4 py-10">
      <img
        src="/images/icons/no-notification.svg"
        alt="empty notifications"
        width={160}
        height={160}
        className="aspect-square max-w-full object-contain"
        loading="lazy"
      />

      <div className="mb-5 text-center">
        <h3 className="text-xl font-semibold">
          {resources["noNotificationsYet"]}
        </h3>
      </div>
    </div>
  );
}
