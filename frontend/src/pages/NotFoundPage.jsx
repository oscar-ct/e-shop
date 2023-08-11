import BackButton from "../components/BackButton";
import Meta from "../components/Meta";

const NotFoundPage = () => {
    return (
        <>
            <Meta title={"404 - Page Not Found"}/>
            <div className={"px-2"}>
                <div className={"flex justify-start h-min"}>
                    <BackButton/>
                </div>
                <div className="hero">
                    <div className="text-center hero-content">
                        <div className="max-w-lg">
                            <h1 className="text-8xl font-bold mb-8"> 404
                            </h1>
                            <p className="text-3xl mb-8">
                               Hmm, the page you were looking for doesn't seem to exist anymore
                            </p>
                            <div className={"pt-10 flex justify-center"}>
                                <div>
                                    <img src={"/images/lazy-cat.webp"} alt={"Not found"} className={"max-w-96"}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;