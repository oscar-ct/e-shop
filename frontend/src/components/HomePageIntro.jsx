import {ReactComponent as Logo} from "../icons/e.svg";
import {Link} from "react-router-dom";

const HomePageIntro = () => {
    return (
        <div className={"drop-shadow-xl bg-transparent rounded-xl w-full"}>
            <div className={"md:hidden w-full h-full relative"}>
                <div className={"absolute h-full w-full flex flex-col items-center justify-start ibmplex"}>
                    <Logo className={"pt-28 w-[10em]"}/>
                    <span className={"pt-12 text-3xl font-semibold z-10"}>Shop, Ship, & Enjoy.</span>
                    {/*<span className={"pt-3 font-light pb-20 text-2xl"}>Happy Holidays!</span>*/}
                    <div className={"pt-20"}>
                        <Link to={"/sort/latest/select/all"} className={"btn text-lg btn-neutral normal-case rounded-full"}>
                            Get Started
                        </Link>
                    </div>
                </div>
                <img className={"object-cover h-[40em] w-full"} src={"/images/bg.png"}/>
            </div>
            <div className={"hidden md:flex h-[35em] w-full ibmplex"}>
                <div
                    style={{backgroundImage: `url(/images/sincerely-media-HL3EOgFiy0k-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}
                    className={"h-full w-1/3"}
                >
                    <div className={"w-full h-full flex items-end justify-center"}>
                        <div className={"pb-10 text-3xl font-bold flex items-center"}>
                            <Logo width={"20px"} className={"pt-1 mr-1"}/>
                            -shop.com
                        </div>
                    </div>
                </div>
                <div
                    style={{backgroundImage: `url(/images/curology-fPSELOXfeU4-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}
                    className={"h-full w-1/3"}
                >
                    <div className={"w-full h-full flex items-start justify-center"}>
                        <div className={"pt-20 px-10 font-bold text-white text-3xl"}>
                            Shop, Ship, & Enjoy.
                        </div>
                    </div>
                </div>
                <div
                    style={{backgroundImage: `url(/images/ian-dooley-hpTH5b6mo2s-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}
                    className={"h-full w-1/3"}
                >
                    <div className={"w-full h-full flex items-center justify-center"}>
                        <Link to={"/sort/latest/select/all"} className={"btn text-lg btn-neutral normal-case rounded-full"}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageIntro;