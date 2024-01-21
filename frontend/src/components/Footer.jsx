import {Link} from "react-router-dom";
import {ReactComponent as Logo} from "../icons/e.svg";
import {FaGithub, FaGlobe, FaLinkedin} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content rounded-tr-xl rounded-tl-xl">
            <div>
                <Link to={"/"}><Logo fill={"white"} width={36}/></Link>
                <p>Designed and developed by <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank" rel="noopener noreferrer" className={"link"}>Oscar Castro</a></p>
            </div>
            <div className={"w-full flex justify-between"}>
                <div>
                    <span className="footer-title">Social</span>
                    <div className="pt-5 grid grid-flow-col gap-4 text-xl">
                        <a aria-label="linkedin" href={"https://www.linkedin.com/in/oscar-ct"} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin/>
                        </a>
                        <a aria-label="github" href={"https://github.com/oscar-ct"} target="_blank" rel="noopener noreferrer">
                            <FaGithub/>
                        </a>
                        <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank" rel="noopener noreferrer">
                            <FaGlobe/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;