import ErrorHandler from "@/utils/errorHandler";
import { apiResponseKeys } from "@/utils/constants";
import { errorResponse, successResponse } from "@/utils";

const API_BASE_URL = process.env.BASE_URL!;

if (!API_BASE_URL) throw new Error("Missing API Url in .env");

export default async function apiFetcher(url: string, config?: RequestInit) {
  const fixedConfig: RequestInit = {
    cache: "no-store",
    ...config,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, fixedConfig);
    // if (
    //   `${API_BASE_URL}${url}` ===
    //   "https://TX-SB-Service.psdigital.me/API/Country"
    // ) {
    //   console.log(`${API_BASE_URL}${url}`, "===Request===", fixedConfig, res);
    // }
    const data = await res?.json();
    // console.log(`${API_BASE_URL}${url}`, "===Response===", data);

    if (
      (data[apiResponseKeys.responseCode] !== 200 &&
        data[apiResponseKeys.responseCode] !== 206) ||
      data?.Errors?.length > 0
    ) {
      return errorResponse(data[apiResponseKeys?.responseCode], data?.Errors);
    }

    return successResponse(
      data[apiResponseKeys?.responseCode],
      data[apiResponseKeys?.results],
    );
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return errorResponse(error?.statusCode, [
        {
          Title: error?.title,
          Message: error?.message,
          Code: error?.statusCode,
        },
      ]);
    } else if (error instanceof Error) {
      return errorResponse(500, [
        { Title: error?.name, Message: error?.message, Code: 500 },
      ]);
    } else {
      console.log(error);
    }
  }
}
