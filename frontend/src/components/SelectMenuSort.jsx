import Select from "react-select";
import {useNavigate} from "react-router-dom";

const SelectMenuSort = ({sortByTerm, filterTerm, customStyles}) => {

    const navigate = useNavigate();
    const options = [
        {value: "toprated", label: "Top Rated"},
        {value: "latest", label: "Most Recent"},
        {value: "price-asc", label: "Price: Low To High"},
        {value: "price-dsc", label: "Price: High To Low"},
    ];
    const placeHolder = () => {
        if (sortByTerm === "toprated") {
            return "Top Rated"
        } else if (sortByTerm === "latest") {
            return "Most Recent"
        } else if (sortByTerm === "price-asc") {
            return "Price: Low To High"
        } else if (sortByTerm === "price-dsc") {
            return "Price: High To Low"
        }
    };
    const handleChange = (selectedOption) => {
        navigate(`/sort/${selectedOption.value}/${filterTerm}`)
    };
    return (
        <Select
            styles={customStyles}
            isSearchable={false}
            className={"text-black w-[12em]"}
            placeholder={placeHolder()}
            options={options}
            onChange={handleChange}
        />
    );
};

export default SelectMenuSort;