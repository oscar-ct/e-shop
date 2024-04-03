import {Outlet} from 'react-router-dom';
import Navbar from "./components/Navbar";
import {useSelector} from "react-redux";
import { Toaster } from 'react-hot-toast';
import { ScrollRestoration } from "react-router-dom";
import Footer from "./components/Footer";

function App() {

    const loading = useSelector(function (state) {
        return state.loading;
    });
    return (
        <>
            <ScrollRestoration
              // getKey={(location, matches) => {
              //     const paths = ["/product/:id"];
              //     return paths.includes(location.pathname) ? location.pathname : location.key;
              // }}
            />
            <Toaster />
            {
                loading.loading && (
                    <div className={"absolute z-10 w-full h-screen flex justify-center"}>
                      <span className="loading loading-bars loading-lg"/>
                    </div>
                )
            }
            <div className={`${loading.loading ? "opacity-30" : ""} bg-stone-50 relative`}>
                <Navbar/>
                    <div className={"mx-auto min-h-[calc(100vh-300px)] md:min-h-[calc(100vh-224px)]"}>
                      <Outlet/>
                    </div>
                <Footer/>
            </div>
        </>
    );
}

export default App;
