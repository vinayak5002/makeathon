import { useEffect, useRef, useState } from "react";
import { ChatMessage, QueryType } from "../types/types";
import api from "../api/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import SearchResult from "../components/SearchResult";

const SearchPage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [query, setQuery] = useState<string>("");

  const [queryType, setQueryType] = useState<QueryType>(QueryType.TEXT2SQL);

  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const fetchData = async () => {
    if (query === "") return;

    console.log("Fetching data...");

    setIsLoading(true);

    try {
      switch(queryType) {
        case QueryType.TEXT2SQL:
          const data = await api.sendText2SQLquery(query.toLowerCase())
          console.log(data);

          const newChatMessage: ChatMessage = { question: query, answer: data.query, type: queryType };
          setChatMessages([...chatMessages, newChatMessage]);

          setIsSearched(true);
          break;
        case QueryType.SQL2TEXT:
          const data2 = await api.sendSQL2Textquery(query.toLowerCase())
          console.log(data2);

          const newChatMessage2: ChatMessage = { question: query, answer: data2.description, type: queryType };
          setChatMessages([...chatMessages, newChatMessage2]);

          setIsSearched(true);
          break;
      }
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

  const handleQueryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Update the state with the selected value from the dropdown
    setQueryType(event.target.value as QueryType);  // Type-casting to `QueryType` to match the enum
  };

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
        <div className="flex flex-col-reverse items-center w-[80%] flex-grow overflow-y-auto h-[500px]">
          {chatMessages.map((chat, index) => (
            <SearchResult key={index} chatMessage={chat} index={index} />
          ))}
        </div>
      )}

      <div className={`flex ${isSearched ? "mt-auto" : "flex-col"} justify-center items-center align-middle`}>
        <h1 className={`${isSearched ? "hidden" : "text-7xl"} m-6`}>Text-SQL</h1>
        <form
          onSubmit={handleSubmit}
          className={`flex items-center ${isSearched ? 'mt-auto mb-10' : 'h-full justify-center'} mb-5`}
        >
          <div className="flex items-center   w-32 mr-6">
            <select
              name="dropdown"
              className="p-2 bg-gray-950 text-white rounded border border-white"
              value={queryType} // assuming `selectedOption` is your state
              onChange={handleQueryTypeChange} // assuming `handleSelectChange` is your function to handle option change
            >
              <option value={QueryType.TEXT2SQL}>Text to SQL</option>
              <option value={QueryType.SQL2TEXT}>SQL to text</option>
            </select>
          </div>
          
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
