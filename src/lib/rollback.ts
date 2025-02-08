import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import { OrderRollbackResponseProps } from "@/types/api";

export async function rollBackService(locale: string, OrderNumber: string) {
  const response = await clientSideFetch<
    Promise<GenericResponse<OrderRollbackResponseProps>>
  >(
    `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getStoreGeoFencing}`,
    {
      method: "POST",
      body: JSON.stringify({ OrderNumber }),
    },
  );

  return response;
}
