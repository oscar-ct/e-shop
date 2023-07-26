import {Outlet} from 'react-router-dom';
import Navbar from "./components/Navbar";
import {useSelector} from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function App() {

    const loading = useSelector(function (state) {
        return state.loading;
    });
  return (
      <>
          <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"/>
          {
              loading.loading && (
                  <div className={"absolute z-10 w-full h-screen flex justify-center"}>
                      <span className="loading loading-bars loading-lg"/>
                  </div>
              )
          }
          <div className={loading.loading ? "opacity-30" : ""}>
              <Navbar/>
              <div className={"min-h-[calc(100vh-80px)]"}>
                  <div className={"container md:px-5 xl:px-10 m-auto min-h-[calc(100vh-80px)]"}>
                      <Outlet/>
                  </div>
              </div>
          </div>
      </>

  );
}

export default App;
