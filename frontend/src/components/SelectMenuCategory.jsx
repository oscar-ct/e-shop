import Select from "react-select";
import {useNavigate} from "react-router-dom";

const SelectMenuCategory = ({sortByTerm, filterTerm}) => {

    const navigate = useNavigate();

    const options = [
        {value: "all", label: "All"},
        {value: "electronics", label: "Electronics"},
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
        if (filterTerm === "all") {
            return "All"
        } else if (filterTerm === "electronics") {
            return "Electronics"
        }
    }
    const handleChange = (selectedOption) => {
        navigate(`/sort/${sortByTerm}/${selectedOption.value}`)
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

export default SelectMenuCategory;