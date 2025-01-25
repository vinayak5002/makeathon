import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navbar from "./sections/navBar";
import Footer from "./sections/footer";
import Router from "./Router";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <Provider store={store}>
      <StrictMode>

        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          draggable
          draggablePercent={60}
          rtl={false}
          theme="dark"
        />
        
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
