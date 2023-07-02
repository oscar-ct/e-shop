import React from 'react';
import {Link} from "react-router-dom";

const CheckoutSteps = ({ step1, step2 }) => {
    return (
        <div className={"flex justify-center mt-5"}>
            {
                step1 ? (
                    <div className={"steps"}>
                        <Link to={"/cart"} className="step step-primary">Cart</Link>
                        <Link to={"/shipping"} className="step step-primary">Shipping</Link>
                        <button className="step cursor-not-allowed">Payment</button>
                        <button className="step cursor-not-allowed">Place Order</button>
                    </div>
                ) : step2 ?  (
                    <div className={"steps"}>
                        <Link to={"/cart"} className="step step-primary">Cart</Link>
                        <Link to={"/shipping"} className="step step-primary">Shipping</Link>
                        <Link to={"/payment"} className="step step-primary">Payment</Link>
                        <button className="step cursor-not-allowed">Place Order</button>
                    </div>
                ) : (
                    <div className={"steps"}>
                        <Link to={"/cart"} className="step step-primary">Cart</Link>
                        <Link to={"/shipping"} className="step step-primary">Shipping</Link>
                        <Link to={"/payment"} className="step step-primary">Payment</Link>
                        <Link to={"/placeorder"} className="step step-primary">Place Order</Link>
                    </div>
                )
            }
        </div>
    );
};

export default CheckoutSteps;