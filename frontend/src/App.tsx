import { StrictMode, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import { store, AppDispatch } from "./store/store";
import { useDispatch } from "react-redux";
import { fetchCurrentRepo } from "./store/path/pathSlice";
import SelectRepoPage from "./pages/SelectRepoPage";
import Navbar from "./sections/navBar";
import Footer from "./sections/footer";
import snipsApi from "./api/snipsApi";
import { AxiosError } from "axios";
import HistoryPage from "./pages/History";


function RepoHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const checkCurrentRepo = async () => {
    try {
      const data = await snipsApi.getCurrentRepo();

      console.log("Current repo path in repoHandeller: ", data);

      navigate("/search");
    
    } catch (error) {

      const axiosError = error as AxiosError;

      dispatch(fetchCurrentRepo());

      if (axiosError.response?.status === 400) {
        console.log("Current repo path not set");
        navigate("/select-repo");
        return;
      }

      console.error("Error fetching current repo:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchCurrentRepo());
    checkCurrentRepo();
  }, [dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <StrictMode>
        <div className="flex flex-col min-h-screen"> {/* Flex container with full height */}
          <BrowserRouter>
            <Navbar />
            <main className="flex-grow"> {/* Main content area */}
              <Routes>
                <Route path="/" element={<RepoHandler />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/select-repo" element={<SelectRepoPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </main>
            <Footer /> {/* Footer stays at the bottom */}
          </BrowserRouter>
        </div>
      </StrictMode>
    </Provider>
  );
}

export default App;
