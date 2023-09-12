const CategoryOptions = ({bool, isPopulated = false}) => {
    return (
        <>
            {
                !isPopulated && (
                    <option defaultChecked disabled={bool}>
                        Select Category
                    </option>
                )
            }
            <option value={"Apparel"}>
                Apparel
            </option>
            <option value={"Automotive"}>
                Automotive
            </option>
            <option value={"Electronics"}>
                Electronics
            </option>
            <option value={"Food"}>
                Food
            </option>
            <option value={"Footwear"}>
                Footwear
            </option>
            <option value={"Home Furnishings"}>
                Home furnishings
            </option>
            <option value={"Personal Care"}>
                Personal Care
            </option>
            <option value={"Pet Care"}>
                Pet Care
            </option>
            <option value={"Other"}>
                Other
            </option>
        </>
    );
};

export default CategoryOptions;