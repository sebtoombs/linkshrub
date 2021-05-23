import React, { forwardRef, LegacyRef, useEffect, useState } from "react";
import { DropzoneState, useDropzone } from "react-dropzone";
import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { AiOutlineCamera } from "react-icons/ai";
import { ControllerRenderProps } from "react-hook-form";

export type FileWithPreview = File & {
  preview: string;
};

const FileUpload = forwardRef(FileUploadComponent);
export default FileUpload;

export const FileUploadView = forwardRef(FileUploadViewComponent);

export type FileUploadProps = ControllerRenderProps & {};

export function FileUploadComponent(
  { onChange, value, onBlur }: FileUploadProps,
  ref: LegacyRef<HTMLInputElement> | undefined
) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const dropzoneProps = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    if (!!files?.length && typeof onChange === "function") {
      onChange.call(null, !!files?.length ? files[0] : null);
    }

    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const viewProps = {
    preview: !!files?.length ? files[0].preview : null,
    ...dropzoneProps,
  };

  return <FileUploadView {...viewProps} ref={ref} />;
}

export type FileUploadViewProps = DropzoneState & {
  preview: string | null;
};

export function FileUploadViewComponent(
  { getRootProps, preview, getInputProps }: FileUploadViewProps,
  ref: LegacyRef<HTMLInputElement> | undefined
) {
  return (
    <Box>
      <Box
        rounded="full"
        w="6rem"
        h="6rem"
        overflow="hidden"
        border="4px solid"
        borderColor="transparent"
        bg="gray.100"
        position="relative"
        cursor="pointer"
        sx={{ "&:hover>.hover-cover": { bg: "rgba(255,255,255,0.2)" } }}
        {...getRootProps({ className: "dropzone" })}
      >
        {!!preview && (
          <Box position="absolute" left="0" top="0" width="100%" height="100%">
            <Box
              as="img"
              src={preview}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
        )}
        <Box
          position="absolute"
          left="0"
          top="0"
          width="100%"
          height="100%"
          bg="rgba(255,255,255,0)"
          rounded="full"
          transition="0.2s background ease"
          className="hover-cover"
        />
        <Tooltip label="Add photo" aria-label="Click to add a photo">
          <Flex
            position="relative"
            w="100%"
            h="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Box>
              <Box
                as={AiOutlineCamera}
                fontSize="4xl"
                color={!!preview ? "white" : "black"}
                opacity="0.9"
              />
              <input {...getInputProps()} />
            </Box>
          </Flex>
        </Tooltip>
      </Box>
    </Box>
  );
}
