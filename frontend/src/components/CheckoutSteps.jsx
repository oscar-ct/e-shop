import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const CheckoutSteps = ({ step1, step2, step3 }) => {

    const {cartItems,shippingAddress, paymentMethod} = useSelector(function (state) {
       return state.cart;
    });

    const step1name = "Cart"
    const step2name = "Shipping"
    const step3name = "Payment"
    const step4name = "Checkout"

    return (
        <div className={"flex justify-center pt-5 sm:pb-5 lg:py-10 text-xs sm:text-sm"}>
            {
                step1 ? (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary md:step-neutral">{step1name}</Link>
                        {
                            cartItems.length !== 0 ? (
                                <Link to={"/shipping"} className="step">{step2name}</Link>
                            ) : (
                                <button className="step">{step2name}</button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link to={"/payment"} className="step">{step3name}</Link>
                            ) : (
                                <button className="step">{step3name}</button>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link to={"/submitorder"} className="step">{step4name}</Link>
                            ) : (
                                <button className="step">{step4name}</button>
                            )
                        }
                    </div>
                ) : step2 ? (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary md:step-neutral">{step1name}</Link>
                        {
                            cartItems.length !== 0 ? (
                                <Link to={"/shipping"} className="step step-primary md:step-neutral">{step2name}</Link>
                            ) : (
                                <button className="step step-primary md:step-neutral">{step2name}</button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link to={"/payment"} className="step">{step3name}</Link>
                            ) : (
                                <button className="step mx-2">{step3name}</button>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link to={"/submitorder"} className="step">{step4name}</Link>
                            ) : (
                                <button className="step">{step4name}</button>
                            )
                        }
                    </div>
                ) : step3 ?  (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary md:step-neutral">{step1name}</Link>
                        <Link to={"/shipping"} className="step step-primary md:step-neutral">{step2name}</Link>
                        <Link to={"/payment"} className="step step-primary md:step-neutral">{step3name}</Link>
                        {
                            paymentMethod ? (
                                <Link to={"/submitorder"} className="step">{step4name}</Link>
                            ) : (
                                <button className="step">{step4name}</button>
                            )
                        }
                    </div>
                ) : (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary md:step-neutral">{step1name}</Link>
                        <Link to={"/shipping"} className="step step-primary md:step-neutral">{step2name}</Link>
                        <Link to={"/payment"} className="step step-primary md:step-neutral">{step3name}</Link>
                        <Link to={"/submitorder"} className="step step-primary md:step-neutral">{step4name}</Link>
                    </div>
                )
            }
        </div>
    );
};

export default CheckoutSteps;