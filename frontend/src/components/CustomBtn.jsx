const CustomBtn = ({isDisabled, customClass, children, onClick, type}) => {
    return (
        <button onClick={onClick} className={`relative rounded-full px-5 py-2.5  ${customClass} ${isDisabled ? "bg-gray-100 text-gray-300" : "overflow-hidden group bg-blue-600 relative md:hover:bg-gradient-to-r md:hover:from-blue-600 md:hover:to-blue-500 text-white md:hover:ring-2 md:hover:ring-offset-0 md:hover:ring-blue-500 md:transition-all md:ease-out md:duration-300"}`} disabled={isDisabled} type={type}>
            <span className={!isDisabled && "md:absolute md:right-0 md:w-8 md:h-32 md:-mt-12 md:transition-all md:duration-500 md:transform md:translate-x-12 md:bg-white md:opacity-10 md:rotate-12 md:group-hover:-translate-x-40 md:ease"}/>
            <span className={"relative"}>{children}</span>
        </button>
    );
};

CustomBtn.defaultProps = {
    type: "button"
}

export default CustomBtn;