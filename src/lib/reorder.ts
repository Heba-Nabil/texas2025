import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import { ReorderResponseProps } from "@/types/api";

export async function reorderService(locale: string, OrderNumber: string) {
  const response = await clientSideFetch<
    Promise<GenericResponse<ReorderResponseProps>>
  >(`${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.reorder}`, {
    method: "POST",
    body: JSON.stringify({ OrderNumber }),
  });

  return response;
}
