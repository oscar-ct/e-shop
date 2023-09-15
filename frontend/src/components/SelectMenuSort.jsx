import Select from "react-select";
import {useNavigate} from "react-router-dom";

const SelectMenuSort = ({sortByTerm, filterTerm}) => {

    const navigate = useNavigate();

    const options = [
        {value: "toprated", label: "Top Rated"},
        {value: "latest", label: "Most Recent"},
        {value: "price-asc", label: "Price: Low To High"},
        {value: "price-dsc", label: "Price: High To Low"},
    ];

    const customStyles = {
        control: (base) => ({
            ...base,
            cursor: "pointer",
            fontSize: "14px"
        }),
        option: (base, {isDisabled, isFocused, isSelected}) => {
            return {
                ...base,
                cursor: "pointer",
                borderRadius: 1,
                color: "black",
                backgroundColor: isFocused
                    ? "rgba(132,170,252,0.3)"
                    : isSelected
                        ? "rgb(132,166,252)"
                        : "rgb(245,245,245)",
                ':active': {
                    ...base[':active'],
                    backgroundColor: !isDisabled
                        && isSelected
                        && "rgb(245,245,245)",

                },
            };
        },
        menu: base => ({
            ...base,
            cursor: "pointer",
            borderRadius: 5,
        }),
        menuList: base => ({
            ...base,
            padding: 0,
            cursor: "pointer",
            fontSize: "14px"
        })
    }

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
    }
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