// pages/upload.js
import Head from 'next/head';
import Image from 'next/image';
import { ChangeEvent, MouseEvent, useState } from 'react';

const Upload = () => {
  const [files, setFiles] = useState<File[] | null>(null);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      alert("No file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }

    for (const file of fileInput.files) {

      console.log("FILE")

      /** File validation */
      if (!file.type.startsWith("application/pdf")) {
        alert("Please select a valid pdf");
        return;
      }

      /** Setting file state */
      setFiles(files => files ? [...files, file] : [file]); // we will use the file state, to send it later to the server
    }

    /** Reset file input */
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";
  };

  const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!files) {
      return;
    }
    setFiles(null);
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!files) {
      return;
    }

    for (const file of files) {
      try {
        let formData = new FormData();
        formData.append("media", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        console.log(res)

        const {
          data,
          error,
        }: {
          data: {
            url: string | string[];
          } | null;
          error: string | null;
        } = await res.json();

        if (error || !data) {
          alert(error || "Sorry! something went wrong.");
          return;
        }

        console.log("File was uploaded successfully:", data);
      } catch (error) {
        console.error(error);
        alert("Sorry! something went wrong.");
      }
    }
  };

  return (
    <div>
      <Head>
        <title>File uploader</title>
        <meta name="description" content="File uploader" />
      </Head>

      <main className="py-10">
        <div className="w-full max-w-3xl px-3 mx-auto">
          <h1 className="mb-10 text-3xl font-bold text-gray-900">
            Upload your files
          </h1>

          <form
            className="w-full p-3 border border-gray-500 border-dashed"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col md:flex-row gap-1.5 md:py-4">
              <div className="flex-grow">
                {files && (
                  <div className="mx-auto w-80">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 mb-2 bg-gray-100 rounded-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {file.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 h-14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  <strong className="text-sm font-medium">
                    Select an PDF
                  </strong>
                  <input
                    className="block w-0 h-0"
                    name="file"
                    type="file"
                    multiple={true}
                    accept='application/pdf'
                    onChange={onFileUploadChange}
                  />
                </label>
              </div>
              <div className="flex mt-4 md:mt-0 md:flex-col justify-center gap-1.5">
                <button
                  disabled={!files}
                  onClick={onCancelFile}
                  className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
                >
                  Cancel file
                </button>
                <button
                  disabled={!files}
                  onClick={onUploadFile}
                  className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
                >
                  Upload file
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <footer>
        <div className="w-full max-w-3xl px-3 mx-auto">
        </div>
      </footer>
    </div>
  );
};

export default Upload;
