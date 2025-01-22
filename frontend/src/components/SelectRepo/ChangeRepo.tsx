import { ChangeEvent, useEffect } from "react";
import { UserRepoPath } from "../../types/types";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setLastIndexed, updateCurrentRepoPath } from "../../store/path/pathSlice";
import snipsApi from "../../api/snipsApi";
import { timeAgo } from "../../utils/utils";

import RepoCard from "./ChangeRepo/RpeoCard";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type ChangeRepoProps = {
  pathList: UserRepoPath[];
  refreshPathList: () => void;
};

const ChangeRepo = ({ pathList, refreshPathList }: ChangeRepoProps) => {
  const currentRepoPath = useSelector(
    (state: RootState) => state.currentRepoPath.path
  );

  const lastIndexed = useSelector(
    (state: RootState) => state.currentRepoPath.lastIndexed
  );

  // const [selectedPath, setSelectedPath] = useState(currentRepoPath);

  const dispatch = useDispatch<AppDispatch>();

  const handleRepoChange = (event: ChangeEvent<HTMLInputElement>, repo: UserRepoPath) => {
    const { value } = event.target;
    // setSelectedPath(value);

    dispatch(updateCurrentRepoPath(value));
    dispatch(setLastIndexed(repo.lastIndexed));
    // snipsApi.setCurrentRepo(value);
  }

  const handleDeleteRepo = async (path: string) => {
    try {
      const response = await snipsApi.deleteRepo(path);

      if (response.status === 200) {
        console.log("Repo deleted successfully");
        toast.success("Repo deleted successfully");
      }
    } catch (error) {
      console.log("Error: ", error);
      const axiosError = error as AxiosError;
      
      if(axiosError.status === 400){
        toast.error(axiosError.response?.data as string); 
      }
      else {
        toast.error("Something went wrong try again later"); 
      }
    }

    refreshPathList();
  }

  useEffect(() => {
    refreshPathList();
  }, [lastIndexed])

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Change Repo</h1>

      <h3 className="mb-2 text-2xl">Current repo: {currentRepoPath}</h3>
      <h3 className="mb-2 text-xl">Last Indexed: {timeAgo(lastIndexed)}</h3>

      <h2 className="mb-2 text-3xl">From saved repos: </h2>

      {
        pathList.map((ele) => (
          <RepoCard
            repo={ele}
            selectedPath={currentRepoPath}
            handleChange={handleRepoChange}
            handleDelete={handleDeleteRepo}
          />
        ))
      }


    </>
  );

}

export default ChangeRepo;