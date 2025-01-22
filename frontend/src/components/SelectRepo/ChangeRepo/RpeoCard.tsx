import { ChangeEvent, useState } from "react";
import { UserRepoPath } from "../../../types/types";
import { timeAgo } from "../../../utils/utils";
import { MdDeleteForever } from "react-icons/md";
import Modal from "react-modal";
import customStyles from "../../../constants/styles";

Modal.setAppElement('#root');

type RepoCardProps = {
  repo: UserRepoPath;
  selectedPath: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>, repo: UserRepoPath) => void;
  handleDelete: (repoPath: string) => void;
};

const RepoCard = ({ repo, selectedPath, handleChange, handleDelete }: RepoCardProps) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onDelete = () => {
    openModal();
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-secondary hover:text-white" // Close button styles
        >
          Close
        </button>

        <div className="flex flex-col justify-between h-full"> {/* Flex container for spacing */}
          <h2 className="text-2xl text-white mb-4">Are you sure about that?</h2>

          <button
            onClick={closeModal}
            className="w-full bg-secondary text-white font-semibold py-2 rounded-md transition duration-200" // Save button styles
          >
            No
          </button>
          <button
            onClick={() => { handleDelete(repo.path); closeModal() }}
            className="w-full bg-secondary text-white font-semibold py-2 rounded-md transition duration-200" // Save button styles
          >
            Yes
          </button>
        </div>
      </Modal>

      <div key={repo.path} className="flex flex-row items-center mb-2 w-full bg-secondary p-4 rounded-lg shadow-md cursor-pointer">
        <input
          type="radio"
          id={repo.path}
          name="repoPath"
          value={repo.path}
          checked={selectedPath === repo.path}
          onChange={(event) => handleChange(event, repo)}
          className="hidden peer"
        />
        <label htmlFor={repo.path} className="flex items-center w-full cursor-pointer justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 border-2 border-gray-400 rounded-full mr-4 transition duration-200 ease-in-out peer-checked:border-blue-500 peer-checked:bg-blue-500">
              <div className={`w-4 h-4 rounded-full transition duration-200 ease-in-out ${selectedPath === repo.path ? 'bg-white' : 'bg-transparent'}`}></div>
            </div>
            <div className="text-white">
              <h3 className="font-bold text-xl">{repo.path}</h3>
              <p className="text-sm">Last indexed: {timeAgo(repo.lastIndexed)}</p>
            </div>
          </div>
        </label>
        <div
          className="bg-primary p-1 rounded-md ml-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from bubbling up
            onDelete(); // Call your delete function
          }}
        >
          <MdDeleteForever size={27} />
        </div>
      </div>

    </>
  );
}

export default RepoCard;