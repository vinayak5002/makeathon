import { useRef, useState } from "react";
import { toast } from "react-toastify";
import snipsApi from "../../api/snipsApi";
import { UserRepoPath } from "../../types/types";
import Modal from "react-modal";
import customStyles from "../../constants/styles";

Modal.setAppElement('#root');

type NewRepoProps = {
  pathList: UserRepoPath[];
  updatePathList: (pathList: UserRepoPath[]) => void;
};

const NewRepo = ( { pathList, updatePathList }: NewRepoProps ) => {

  const folderRef = useRef<HTMLInputElement>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [folderPathWarning, setFolderPathWarning] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSelectRepo = async () => {
    openModal();
  };

  const handleNewRepo = async () => {

    const folderPath = folderRef.current?.value;
    if (!folderPath) {
      toast.error("Folder path is required!");
      return;
    }

    // Validate folder path using server
    try {
      const isValid = await snipsApi.checkRepoPath(folderPath);

      console.log("isValid: ", isValid);

      if (!isValid) {
        setFolderPathWarning("Invalid folder path");
        return;
      }

      setFolderPathWarning("");
    }
    catch {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    // Check if folder path is already saved
    const isPathPresent = pathList.some((ele) => ele.path === folderPath);

    console.log("isPathPresent: ", isPathPresent);

    if (isPathPresent) {
      setFolderPathWarning("Folder path already saved");
      return;
    }

    // Update new Repo path to server
    try {
      const newUserRepoPathList = await snipsApi.addRepoPath(folderPath);

      console.log("New user repo path list: ", newUserRepoPathList);

      updatePathList(newUserRepoPathList);

      toast.success("Repo Added successfully!");

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
      return;
    }
  };


  return (
    <>
      <p className="mb-2">Or enter a new repo's path:</p>
      <button
        onClick={handleSelectRepo}
        className="bg-secondary hover:bg-gray-950 text-white font-bold py-2 px-4 rounded"
      >
        Save folder as repo
      </button>

      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        style={customStyles}
        overlayClassName="fixed inset-0 bg-black bg-opacity-75" // Overlay styles
        contentLabel="Select Folder Modal"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-secondary hover:text-white" // Close button styles
        >
          Close
        </button>

        <div className="flex flex-col justify-between h-full"> {/* Flex container for spacing */}
          <h2 className="text-2xl text-white mb-4">Select a Folder</h2>

          <input
            type="text"
            ref={folderRef}
            placeholder="Enter folder path"
            className="w-full p-2 mb-4 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary" // Input styles
          />

          {folderPathWarning !== "" ? <p className="text-red-700">Invalid folder path</p> : <></>}

          <button
            onClick={handleNewRepo}
            className="w-full bg-secondary text-white font-semibold py-2 rounded-md transition duration-200" // Save button styles
          >
            Save Path
          </button>
        </div>
      </Modal>
    </>
  );
}

export default NewRepo;