import { useEffect, useRef, useState } from "react";
import { ChatMessage, QueryType } from "../types/types";
import api from "../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import SearchResult from "../components/SearchResult";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState<string>("");
  const [queryType, setQueryType] = useState<QueryType>(QueryType.TEXT2SQL);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const navigate = useNavigate();

  const userID: string = useSelector(
    (state: RootState) => state.user.userID
  );

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const fetchData = async () => {
    if (query === "") return;

    console.log("Fetching data...");
    setIsLoading(true);

    try {
      let data;
      switch (queryType) {
        case QueryType.TEXT2SQL:
          data = await api.sendText2SQLquery(query.toLowerCase());
          const newChatMessage: ChatMessage = { question: query, answer: data.query, type: queryType };
          setChatMessages([newChatMessage, ...chatMessages]);
          break;
        case QueryType.SQL2TEXT:
          data = await api.sendSQL2Textquery(query.toLowerCase());
          const newChatMessage2: ChatMessage = { question: query, answer: data.description, type: queryType };
          setChatMessages([newChatMessage2, ...chatMessages]);
          break;
      }
      setIsSearched(true);
      setQuery("");
    } catch (err) {
      toast.error("Something went wrong")
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting...");
    fetchData();
  };

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

  useEffect(() => {
    console.log("User: ", userID);
    if (userID === "") {
      console.log("User not logged in");
      navigate('/login')
    }
  }, []);

  const handleQueryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryType(event.target.value as QueryType);
  };

  return (
    <div className={` ${isSearched ? "flex-grow" : ""} flex flex-col items-center justify-between`}>
      {chatMessages.length > 0 && (
        <div className="flex flex-col-reverse items-center w-[80%] flex-grow overflow-y-auto h-[500px] no-scrollbar">
          {chatMessages.map((chat, index) => (
            <SearchResult key={index} chatMessage={chat} />
          ))}
        </div>
      )}

      <div className={`flex ${isSearched ? "mt-auto" : "flex-col"} justify-center items-center align-middle`}>
        <h1 className={`${isSearched ? "hidden" : "text-7xl"} m-6`}>Text-SQL</h1>
        <form
          onSubmit={handleSubmit}
          className={`flex items-center ${isSearched ? 'mt-auto mb-10' : 'h-full justify-center'} mb-5`}
        >
          <div className="flex items-center w-32 mr-6">
            <select
              name="dropdown"
              className="p-2 bg-gray-950 text-white rounded border border-white"
              value={queryType}
              onChange={handleQueryTypeChange}
            >
              <option value={QueryType.TEXT2SQL}>Text to SQL</option>
              <option value={QueryType.SQL2TEXT}>SQL to text</option>
            </select>
          </div>

          <div className="flex items-center border rounded w-[800px] mr-2">
            <textarea
              ref={inputRef}
              autoComplete="off"
              placeholder="Search..."
              name="query"
              value={query}
              onChange={handleQuery}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  // Allow shift+enter to create a new line
                  return;
                } else if (e.key === 'Enter') {
                  // Prevent form submission on Enter key without Shift
                  e.preventDefault();
                  // Trigger form submission manually
                  const form = e.currentTarget.closest('form');
                  form?.requestSubmit(); // This will call handleSubmit()
                }
              }}
              className="p-3 flex-grow border-none rounded-r resize-none"
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
