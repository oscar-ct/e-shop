import React from 'react';

const AlertModal = ({title, children, initiateFunction}) => {

    const closeModal = (e) => {
        e.preventDefault();
        window.confirm_modal.close();
    }


    return (
        <dialog id="confirm_modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box bg-white">
                <div className={"flex justify-between items-center"}>
                    <h3 className="p-3 font-bold text-xl">{title}</h3>
                </div>
                <div className="p-3">
                    {children}
                    <div className="modal-action">
                        <button onClick={closeModal} className={"btn btn-neutral rounded-xl"}>Cancel</button>
                        <button
                            onClick={initiateFunction}
                            className="btn rounded-xl"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </form>
        </dialog>
    );
};

export default AlertModal;