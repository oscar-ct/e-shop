import React from 'react';

const Spinner = () => {
    return (
        <div className={"w-full min-h-[calc(100vh-80px)] flex justify-center"}>
            <span className="loading loading-bars loading-lg"/>
        </div>
    );
};

export default Spinner;