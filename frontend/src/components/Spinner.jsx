import React from 'react';

const Spinner = () => {
    return (
        <div className={"w-full h-screen flex justify-center"}>
            <span className="loading loading-bars loading-lg"/>
        </div>
    );
};

export default Spinner;