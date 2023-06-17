import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";


function App() {
  return (
      <>
          <Navbar/>
          <div className={"container m-auto"}>
              <HomePage/>
          </div>
      </>

  );
}

export default App;
