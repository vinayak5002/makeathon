import { useEffect, useState } from "react";
import { HistoryRecord } from "../types/types";
import snipsApi from "../api/snipsApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchCurrentRepo } from "../store/path/pathSlice";
import { AppDispatch } from "../store/store";


const HistoryPage = () => {
  const [historyList, setHistory] = useState<HistoryRecord[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const fetchHistory = async () => {
    const history: HistoryRecord[] = await snipsApi.fetchHistory();
    console.log(history)
    setHistory(history);
  }

  const clearHistory = async () => {
    await snipsApi.clearHistory();
    fetchHistory();

    // display toast
    toast("History cleared")
  }

  useEffect(() => {
    dispatch(fetchCurrentRepo());
    fetchHistory();
  }, [])

  return (
    <div className="container mx-auto p-4">
      {/* Add a button for clearing the history */}
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">History</h1>
        <a
          className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded" // Added flex for consistency
          onClick={clearHistory}
        >
          Clear history
        </a>

      </div>
      <div className="mt-4">
        {historyList.map((record, index) => (
          <div key={index} className="border-b border-gray-300 py-2">
            <p className="text-lg">{record.query}</p>
            <p className="text-sm text-gray-500">{record.timeStamp.toDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryPage;