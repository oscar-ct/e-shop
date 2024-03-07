import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const CheckoutSteps = ({ step1, step2, step3 }) => {

    const {cartItems,shippingAddress, paymentMethod} = useSelector(function (state) {
       return state.cart;
    });

    const step1name = "Cart"
    const step2name = "Shipping"
    const step3name = "Payment"
    const step4name = "Place Order"

    return (
        <div className={"flex justify-center pt-5 lg:pt-8 text-xs sm:text-sm"}>
            {
                step1 ? (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-neutral font-semibold ibmplex">{step1name}</Link>
                        {
                            cartItems.length !== 0 ? (
                                <Link to={"/shipping"} className="step"/>
                            ) : (
                                <button className="step font-semibold ibmplex">{step2name}</button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link to={"/payment"} className="step"/>
                            ) : (
                                <button className="step"/>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link to={"/submitorder"} className="step"/>
                            ) : (
                                <button className="step"/>
                            )
                        }
                    </div>
                ) : step2 ? (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-neutral"/>
                        {
                            cartItems.length !== 0 ? (
                                <Link to={"/shipping"} className="step step-neutral font-semibold ibmplex">{step2name}</Link>
                            ) : (
                                <button className="step step-neutral font-semibold ibmplex">{step2name}</button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link to={"/payment"} className="step"/>
                            ) : (
                                <button className="step mx-2"/>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link to={"/submitorder"} className="step"/>
                            ) : (
                                <button className="step"/>
                            )
                        }
                    </div>
                ) : step3 ?  (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-neutral"/>
                        <Link to={"/shipping"} className="step step-neutral"/>
                        <Link to={"/payment"} className="step step-neutral font-semibold ibmplex">{step3name}</Link>
                        {
                            paymentMethod ? (
                                <Link to={"/submitorder"} className="step"/>
                            ) : (
                                <button className="step"/>
                            )
                        }
                    </div>
                ) : (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-neutral"/>
                        <Link to={"/shipping"} className="step step-neutral"/>
                        <Link to={"/payment"} className="step step-neutral"/>
                        <Link to={"/submitorder"} className="step step-neutral font-semibold ibmplex">{step4name}</Link>
                    </div>
                )
            }
        </div>
    );
};

export default CheckoutSteps;