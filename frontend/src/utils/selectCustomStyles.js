export const customStyles = {
    control: (base) => ({
        ...base,
        padding: "2px",
        borderRadius: 0,
        cursor: "pointer",
        fontSize: "16px",
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
        borderRadius: 0,
    }),
    menuList: base => ({
        ...base,
        padding: 0,
        cursor: "pointer",
        fontSize: "16px"
    })
};
