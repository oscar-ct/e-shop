import {useState} from "react";
import {useCreateReviewMutation} from "../slices/productsApiSlice";

const ReviewModal = ({productId, refetch, onPage}) => {

    const [rating, setRating] = useState("0");
    const [title, setTitle] = useState("");
    const [reviewBody, setReviewBody] = useState("");
    const [errorReviewMessage, setErrorReviewMessage] = useState("");
    const [createReview] = useCreateReviewMutation();


    const closeReviewModal = (e) => {
        e.preventDefault();
        setErrorReviewMessage("");
        setReviewBody("");
        setRating("0");
        setTitle("");
        window.review_modal.close();
    }

    const submitReview = async (e) => {
        e.preventDefault();
        if (rating === "0") {
            setErrorReviewMessage("Please select a rating");
            return
        }
        if (!reviewBody || !title) {
            setErrorReviewMessage("Please fill out all text fields");
            return
        }
        const data = {
            productId,
            rating,
            title,
            comment: reviewBody,
        }
        try {
            await createReview(data).unwrap();
            if (onPage) {
                refetch();
            }
        } catch (e) {
            // toast error message for later
            console.log(e)
        }

        setErrorReviewMessage("");
        setReviewBody("");
        setRating("0");
        setTitle("");
        window.review_modal.close();
    }

    return (
        <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box">
                <div className={"flex justify-between items-center"}>
                    <h3 className="p-4 font-bold text-xl">Create review</h3>
                    <div className="rating rating-lg">
                        <input type="radio" value={"0"} name="rating-2" className="rating-hidden" defaultChecked onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"1"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"2"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"3"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"4"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"5"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                    </div>
                </div>

                <div className="px-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Add a headline</span>
                        </label>
                        <input type="text" placeholder="What's most important to know?" className="input input-bordered w-full" value={title} onChange={(e) => {
                            setTitle(e.target.value);
                        }}/>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Add a review</span>
                        </label>
                        <textarea value={reviewBody} placeholder="What did you like or dislike? What did you use this product for?" className="h-20 pt-2 input input-bordered w-full" onChange={(e) => {
                            setReviewBody(e.target.value);
                        }}/>
                    </div>
                    {
                        errorReviewMessage && (
                            <h2 className={"pt-2 text-center text-red-600 font-bold"}>
                                {errorReviewMessage}
                            </h2>
                        )

                    }

                </div>
                <div className="modal-action">
                    <button onClick={closeReviewModal} className={"btn btn-neutral"}>Cancel</button>
                    <button
                        onClick={submitReview}
                        className="btn rounded-cl"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default ReviewModal;