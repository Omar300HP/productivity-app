export const selectionCustomStyle = {
  control: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      border: isDisabled
        ? null
        : isSelected
        ? "1px solid #45a3da"
        : isFocused
        ? "1px solid #45a3da"
        : null,
      boxShadow: isDisabled
        ? null
        : isSelected
        ? "0 0 0 2px #45a3da"
        : isFocused
        ? "0 0 0 2px #45a3da"
        : null,

      ":hover": {
        ...styles[":hover"],
        border: isDisabled
          ? null
          : isSelected
          ? "1px solid #45a3da"
          : isFocused
          ? "1px solid #45a3da"
          : null,
      },
    };
  },
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? "#45a3da"
        : isFocused
        ? "#45a3da"
        : null,
      color: isDisabled
        ? "black"
        : isFocused
        ? "black"
        : isSelected
        ? "black"
        : "black",
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled && (isSelected ? "#45a3da" : "#45a3da"),
      },
    };
  },
  singleValue: (styles) => {
    return {
      ...styles,
      width: "150px",
    };
  },
};
