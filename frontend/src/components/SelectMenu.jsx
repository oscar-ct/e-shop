import Select from "react-select";
import {useNavigate} from "react-router-dom";

const SelectMenu = ({params}) => {

    const navigate = useNavigate();

    const options = [
        {value: "toprated", label: "Top Rated"},
        {value: "latest", label: "Most Recent"},
    ];

    const customStyles = {
        control: (base, state) => ({
            ...base,
            cursor: "pointer",
        }),
        option: (base, { data, isDisabled, isFocused, isSelected, isActive}) => {
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
            cursor: "pointer"
        })
    }

    const placeHolder = () => {
        if (params === "toprated") {
            return "Top Rated"
        } else {
            return "Most Recent"
        }
    }
    const handleChange = (selectedOption) => {
        navigate(`/sort/${selectedOption.value}`)
    };

    return (
        <Select
            styles={customStyles}
            isSearchable={false}
            className={"text-black w-max"}
            placeholder={placeHolder()}
            options={options}
            onChange={handleChange}
        />
    );
};

export default SelectMenu;