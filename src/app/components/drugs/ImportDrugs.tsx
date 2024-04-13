import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DRUGS, DRUGS_CATEGORIES } from "../../utils/constants/queryKeys";
import { importUsers } from "../../apis/import";
import Modal from "../common/Modal";
import Button from "../common/form/Button";
import { IImportResult } from "../../types/common";

interface IImportDrugs {
  file: FormData;
}

const ImportDrugs = () => {
  const [importModalOpened, setImportModalOpened] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const importUsersMutation = useMutation(importUsers);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setIsLoading(false);
  };

  const handleImport = async () => {
    try {
      if (selectedFile) {
        if (
          ![
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ].includes(selectedFile.type)
        ) {
          toast.error("Invalid file type. Please upload .xlsx or .xls file");
          return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        await importUsersMutation.mutateAsync(
          {
            file: formData,
          } as IImportDrugs,
          {
            onSuccess: (result: IImportResult) => {
              toast.success("Drugs imported successfully");
              if (result.failed.length > 0) {
                toast.error(
                  "Some of records failed, recheck them and correct errors:\n" +
                    result.failed.join("\n\t"),
                );
              }
              setImportModalOpened(false);
            },
          },
        );
        queryClient.invalidateQueries(DRUGS);
        queryClient.invalidateQueries(DRUGS_CATEGORIES);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) {
            handleFileSelect(file);
          }
        }
      }
    }
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Modal
        title='Import drugs'
        isOpen={importModalOpened}
        onClose={() => setImportModalOpened(false)}
      >
        <div className='sm:col-span-6'>
          <div
            className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'
            onDrop={handleFileDrop}
            onDragOver={handleFileDragOver}
          >
            <div className='space-y-1 text-center'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 48 48'
                aria-hidden='true'
              >
                <path
                  d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <div className='flex text-sm text-gray-600'>
                <label
                  htmlFor='file-upload'
                  className='relative cursor-pointer rounded-md bg-white font-medium text-darkblue outline hover:outline-darkblue p-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-darkblue focus-within:ring-offset-2 hover:text-darkblue transition-colors '
                >
                  <span>Select an Excel Sheet file</span>
                  <input
                    id='file-upload'
                    name='file-upload'
                    type='file'
                    multiple={false}
                    className='sr-only'
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <p className='pl-2'>or drag and drop</p>
              </div>
              <p className='text-xs text-gray-500'> only .xlsx and .xls file</p>
            </div>
          </div>
        </div>
        <div>
          <p className='p-4 text-gray-500'>
            Selected file:{" "}
            <span className='text-darkblue font-semibold'>
              {selectedFileName ? selectedFileName : "None"}{" "}
            </span>
          </p>
        </div>
        <Button
          label={isLoading ? "Importing..." : "Import"}
          onClick={handleImport}
        />
      </Modal>
      <Button
        label='Import drugs'
        onClick={() => setImportModalOpened(true)}
        color='bg-white text-dark-blue'
      />{" "}
    </>
  );
};

export default ImportDrugs;
