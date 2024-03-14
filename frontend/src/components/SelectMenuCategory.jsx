import Select from "react-select";
import {useNavigate} from "react-router-dom";

const SelectMenuCategory = ({sortByTerm, filterTerm, customStyles}) => {

    const navigate = useNavigate();
    const options = [
        {value: "all", label: "All"},
        {value: "apparel", label: "Apparel"},
        {value: "automotive", label: "Automotive"},
        {value: "electronics", label: "Electronics"},
        {value: "food", label: "Food"},
        {value: "footwear", label: "Footwear"},
        {value: "games", label: "Games"},
        {value: "health", label: "Health"},
        {value: "home", label: "Home"},
        {value: "pet", label: "Pet"},
        {value: "other", label: "Other"},
    ];
    const placeHolder = (category) => {
        switch (category) {
            case "all":
                return "All"
            case "apparel":
                return "Apparel"
            case "automotive":
                return "Automotive"
            case "electronics":
                return "Electronics"
            case "food":
                return "Food"
            case "footwear":
                return "Footwear"
            case "games":
                return "Games"
            case "home":
                return "Home"
            case "pet":
                return "Pet"
            case "other":
                return "Other"
        }
    };
    const handleChange = (selectedOption) => {
        navigate(`/sort/${sortByTerm}/select/${selectedOption.value}`)
    };
    return (
        <Select
            styles={customStyles}
            isSearchable={false}
            className={"text-black w-full"}
            placeholder={placeHolder(filterTerm)}
            options={options}
            onChange={handleChange}
        />
    );
};

export default SelectMenuCategory;