import CustomBtn from "./CustomBtn";

const AlertModal = ({title, children, initiateFunction}) => {

    return (
            <dialog id="alert_modal" className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box bg-white">
                    <div className={"flex justify-between items-center"}>
                        <h3 className="p-3 font-bold text-xl">{title}</h3>
                    </div>
                    <div className="px-3">
                        {children}
                        <div className="modal-action">
                            <button
                                className={"btn btn-neutral rounded-full normal-case"}>
                                Cancel
                            </button>
                            <CustomBtn type={"submit"} onClick={initiateFunction} customClass={"text-sm"}>
                                Approve
                            </CustomBtn>
                        </div>
                    </div>
                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        );
};

export default AlertModal;