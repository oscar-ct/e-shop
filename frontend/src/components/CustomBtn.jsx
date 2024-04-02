const CustomBtn = ({isDisabled, customClass, children, onClick, type, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd}) => {
    return (
        <button onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} className={`relative rounded-full px-5 py-2.5 text-base ${customClass} ${isDisabled ? "bg-gray-100 text-gray-300" : "overflow-hidden group bg-violet-600 relative md:hover:bg-gradient-to-r md:hover:from-violet-600 md:hover:to-violet-500 text-white md:hover:ring-2 md:hover:ring-offset-0 md:hover:ring-violet-500 md:transition-all md:ease-out md:duration-300"}`} disabled={isDisabled} type={type}>
            <span className={!isDisabled ? "md:absolute md:right-0 md:w-8 md:h-32 md:-mt-12 md:transition-all md:duration-500 md:transform md:translate-x-12 md:bg-white md:opacity-10 md:rotate-12 md:group-hover:-translate-x-40 md:ease" : ""}/>
            <span className={"relative ibmplex "}>{children}</span>
        </button>
    );
};

CustomBtn.defaultProps = {
    type: "button"
}

export default CustomBtn;