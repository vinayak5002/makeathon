import { StrictMode } from "react";
import { Provider } from "react-redux";
import SearchPage from "./pages/SearchPage";
import { store } from "./store/store";
import Navbar from "./sections/navBar";
import Footer from "./sections/footer";


function App() {
  return (
    <Provider store={store}>
      <StrictMode>
        <div className="flex flex-col min-h-screen justify-between"> {/* Flex container with full height */}
          <Navbar />
          {/* <main className="flex-grow">  */}
            {/* <Route path="/" element={<RepoHandler />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/select-repo" element={<SelectRepoPage />} />
            <Route path="/history" element={<HistoryPage />} /> */}

            <SearchPage />
            {/* </main> */}
          <Footer /> {/* Footer stays at the bottom */}
        </div>
      </StrictMode>
    </Provider>
  );
}

export default App;
