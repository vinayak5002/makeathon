import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navbar from "./sections/navBar";
import Footer from "./sections/footer";
import Router from "./Router";


function App() {
  return (
    <Provider store={store}>
      <StrictMode>
        <div className="flex flex-col min-h-screen justify-between"> {/* Flex container with full height */}
          <Navbar />
            <Router />
          <Footer /> 
        </div>
      </StrictMode>
    </Provider>
  );
}

export default App;
