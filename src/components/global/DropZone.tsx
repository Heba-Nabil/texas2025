import { useDropzone } from "react-dropzone";
import { AVAILABE_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";
// Types
import {
  CareersDetailsPageResourcesProps,
  ContactPageResourcesProps,
} from "@/types/resources";

type DropzoneProps = {
  resources: ContactPageResourcesProps | CareersDetailsPageResourcesProps;
  fileRejections: string[];
  setFileRejections: React.Dispatch<React.SetStateAction<string[]>>;
  setAcceptedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  acceptedFiles: File[];
};

type FilePreviewsProps = {
  acceptedFiles: File[];
  removeFile: (fileToRemove: any) => void;
};

const FilePreviews = (props: FilePreviewsProps) => {
  const { removeFile, acceptedFiles } = props;

  return (
    <>
      {acceptedFiles.length > 0 &&
        acceptedFiles.map((file, i) => (
          <div key={i} className="mb-5 rounded-md bg-[#F5F7FB] px-8 py-4">
            <div className="flex items-center justify-between">
              <span className="truncate pr-3 text-base font-medium text-[#07074D]">
                {file.name}
              </span>
              <button
                type="button"
                className="text-[#07074D]"
                onClick={() => removeFile(file)}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
    </>
  );
};

const FileErrorMessages = (props: { fileRejections: string[] }) => {
  const { fileRejections } = props;

  return (
    <>
      <ul>
        {fileRejections.length > 0 &&
          fileRejections.map((message, index) => (
            <li key={index} className="text-sm font-medium text-destructive">
              {message}
            </li>
          ))}
      </ul>
    </>
  );
};

export default function Dropzone(props: DropzoneProps) {
  const {
    resources,
    acceptedFiles,
    fileRejections,
    setAcceptedFiles,
    setFileRejections,
  } = props;

  // file controller and validator | we will not validate with the form schema
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept: AVAILABE_FILE_TYPES.reduce((acc, type) => {
    //   const key = Object.keys(type)[0];
    //   return { ...acc, [key]: [] };
    // }, {}),
    validator: (file) => {
      if (file.size > MAX_FILE_SIZE) {
        return {
          code: "file-too-large",
          message: resources["fileTooLarge"],
        };
      }

      if (
        !AVAILABE_FILE_TYPES.some((typeObj) =>
          Object.keys(typeObj).includes(file.type),
        )
      ) {
        return {
          code: "invalid-type",
          message: resources["invalidFileType"],
        };
      }

      return null;
    },
    // avoid duplicated files to show only ones
    onDropAccepted: (files) => {
      setFileRejections([]);
      setAcceptedFiles((prev) => {
        const newFiles = files.filter(
          (newFile) => !prev.some((file) => file.name === newFile.name),
        );
        return [...prev, ...newFiles];
      });
    },
    onDropRejected: (rejections) => {
      if (rejections && rejections.length > 0) {
        const rejectionMessages = rejections.flatMap(({ errors }) =>
          errors.map((error: any) => error.message),
        );
        // avoid duplicated error messages to show only ones
        setFileRejections((prev) => {
          return Array.from(new Set(prev.concat(rejectionMessages)));
        });
      }
    },
  });

  const removeFile = (fileToRemove: any) => {
    setFileRejections([]);
    setAcceptedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  return (
    <>
      <label className="mb-5 block text-xl font-semibold text-dark">
        {resources["uploadFile"]}
      </label>
      <div
        {...getRootProps()}
        className={`mb-8 cursor-pointer rounded-md border border-dashed p-12 text-center ${
          isDragActive ? "bg-gray-100" : "bg-white"
        }`}
      >
        <input {...getInputProps()} name="file" className="sr-only" />

        <div className="flex cursor-pointer flex-col items-center">
          <img
            src="/images/icons/Upload.svg"
            alt="upload"
            width={50}
            height={50}
            className="mb-2 object-contain"
          />

          <span className="mb-2 block text-xl font-semibold text-dark">
            {resources["dragAndDrop"]}
          </span>

          <p className="mb-2 block text-base font-medium text-[#6B7280]">
            {`${AVAILABE_FILE_TYPES.reduce((acc, type, index) => {
              const value = Object.values(type)[0];
              return (
                acc +
                (index < AVAILABE_FILE_TYPES.length - 1
                  ? `${value}, `
                  : `${value}`)
              );
            }, "")} ${resources["upTo10MB"]}`}
          </p>
        </div>
      </div>

      <FilePreviews removeFile={removeFile} acceptedFiles={acceptedFiles} />

      <FileErrorMessages fileRejections={fileRejections} />
    </>
  );
}
