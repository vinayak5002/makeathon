import { useEffect, useState } from "react";
import ChangeRepo from "../components/SelectRepo/ChangeRepo";
import NewRepo from "../components/SelectRepo/NewRepo";
import { UserRepoPath } from "../types/types";
import snipsApi from "../api/snipsApi";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchCurrentRepo } from "../store/path/pathSlice";
import { AppDispatch } from "../store/store";

const SelectRepo = () => {
  const [userRepoPathList, setUserRepoPathList] = useState<UserRepoPath[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const fetchUserRepoPathList = async () => {
    console.log("Fetching user repo path list");
    try {
      const data = await snipsApi.getSavedRepos();
      // console.log("User saved repos: ", data);
      const repoPathList = data;
      setUserRepoPathList(repoPathList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(fetchCurrentRepo());
    fetchUserRepoPathList();
  }, []);
 

  return (
    <div className="flex flex-row">
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        draggable
        draggablePercent={60}
        rtl={false}
        theme="dark"
      />
      <div className="min-h-screen bg-primary text-white flex flex-col items-start p-5 flex-1">
        <ChangeRepo pathList={userRepoPathList} refreshPathList={fetchUserRepoPathList}/>
      </div>
      <div className="min-h-screen bg-primary text-white flex flex-col items-start p-5 flex-1">
        <NewRepo pathList={userRepoPathList} updatePathList={setUserRepoPathList}/>
      </div>
    </div>
  );
};

export default SelectRepo;
