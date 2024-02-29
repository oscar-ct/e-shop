const Message = ({variant, children, border}) => {

    const iconType = (variant) => {
        if (variant === "info") {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> )

        } else if (variant === "success") {
            return (

                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

            )
        } else if (variant === "warning") {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )
        } else if (variant === "error") {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6"  fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> )
        }
    }

    const alertClass = (variant) => {
        switch (variant) {
            case "error" :
                return `alert flex alert-error bg-[#F4595E59] ${border}`;
            case "warning" :
                return `alert flex alert-warning bg-[#F8B11C59] ${border}`;
            case "success" :
                return `alert flex alert-success bg-[#32CD8859] ${border}`;
            case "info" :
                return `alert flex alert-info bg-[#32B0F559] ${border}`;
            default :
                return `alert flex ${border}`;
        }

    }

    return (
        // this is not working properly
        // <div className={`alert alert-${variant}`}>
        <div className={`${alertClass(variant)}`}>
            <div className={"flex items-center justify-start"}>
                <div className={"mr-1"}>{ iconType(variant) }</div>
                <span className={"text-start"}>{children}</span>
            </div>
        </div>
    );
};

Message.defaultProps = {
    border: "rounded-md"
}

export default Message;