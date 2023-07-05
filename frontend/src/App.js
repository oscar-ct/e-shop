import {Outlet} from 'react-router-dom';
import Navbar from "./components/Navbar";

function App() {
  return (
      <>
          <Navbar/>
          <div className={"min-h-[calc(100vh-80px)]"}>
              <div className={"container md:px-5 xl:px-10 m-auto min-h-[calc(100vh-80px)]"}>
                  <Outlet/>
              </div>
          </div>
      </>

  );
}

export default App;
