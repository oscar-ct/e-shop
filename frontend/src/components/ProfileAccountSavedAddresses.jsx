import {FaPlus} from "react-icons/fa";

const ProfileAccountSavedAddresses = () => {
    return (
        <div className="h-full sm:mt-10 lg:mt-0 bg-white shadow-xl p-12 mx-auto rounded-xl lg:w-10/12 sm:border-none border-t-[1px] border-gray-300">
            <div className="mb-4 flex justify-between">
                <h3 className="font-semibold text-2xl text-gray-800">Your Addresses
                </h3>
                <button className={"bg-gray-100 hover:bg-gray-200/70 rounded-md w-10 flex justify-center items-center"}>
                    <FaPlus/>
                </button>
            </div>
        </div>
    );
};

export default ProfileAccountSavedAddresses;