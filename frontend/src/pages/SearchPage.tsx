import { useEffect, useRef, useState } from "react";
import { ChatMessage, QueryType, Snippet } from "../types/types";
import snipsApi from "../api/snipsApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import SearchResult from "../components/SearchResult";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchCurrentRepo } from "../store/path/pathSlice";
// import { useSelector } from "react-redux";

const SearchPage = () => {
  // const [snips, setSnips] = useState<Snippet[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [query, setQuery] = useState<string>("");

  const [queryType, setQueryType] = useState<QueryType>(QueryType.TEXT2SQL);

  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const fetchData = async () => {
    if (query === "") return;

    console.log("Fetching data...");

    setIsLoading(true);

    try {
      //TODO: Implement API service
      const data = await snipsApi.searchSnips(query.toLowerCase())
      console.log(data);

      const message: ChatMessage = data;
      setChatMessages([...chatMessages, message]);

      setIsSearched(true);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting...");
    fetchData();
  };

  // useEffect(() => {
    // dispatch(fetchCurrentRepo());
  // }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Clean up the event listener
    };
  }, []);

  return (
    <div className={` ${isSearched ? "flex-grow" : ""} flex flex-col items-center justify-between`}> {/* Added pt-10 for padding top */}
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

      {chatMessages.length === 0 ? (
        <></>
      ) : (
        <div className="flex flex-col items-center w-[80%] flex-grow-0">
          {chatMessages.map((chat, index) => (
            <SearchResult key={index} chatMessage={chat} index={index} />
          ))}
        </div>
      )}

      <div className={`flex ${isSearched ? "mt-auto" : "flex-col"} justify-center items-center align-middle`}>
        <h1 className={`${isSearched ? "text-4xl" : "text-7xl"} m-6`}>Text-SQL</h1>
        <form
          onSubmit={handleSubmit}
          className={`flex items-center ${isSearched ? 'mt-auto mb-10' : 'h-full justify-center'} mb-5`}
        >
          <div className="flex items-center border rounded w-96 mr-2">
            <input
              ref={inputRef}
              autoComplete="off"
              type="text"
              placeholder="Search..."
              name="query"
              value={query}
              onChange={handleQuery}
              className="p-2 flex-grow border-none rounded-r"
            />
            <span className="p-2">/</span>
          </div>

          <button
            type="submit"
            className="p-2 bg-gray-950 text-white rounded border border-white"
          >
            Send  
          </button>
          <div className="ml-2">
            <Oval
              visible={isLoading && isSearched}
              height="30"
              width="30"
              color="#ffffff"
              secondaryColor="#444444"
              ariaLabel="tail-spin-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </form>
        <p className={isSearched ? 'hidden' : 'block'}>Search. Copy. Paste.</p>
        <div className="mt-4">
          <Oval
            visible={isLoading && !isSearched}
            height="30"
            width="30"
            color="#ffffff"
            secondaryColor="#000000"
            ariaLabel="tail-spin-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      </div>

    </div>
  );
};

export default SearchPage;
