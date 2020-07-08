import { instance } from "../components/API";

export default function useReactAsyncSelectOptions({
  path,
  asyncParamKey = null,
}) {
  const handleInputChange = (newValue) => {
    return newValue;
  };

  const getAsyncOptions = async (inputValue) => {
    if (!inputValue) {
      return [];
    }
    let response = await instance.get(`${path}?${asyncParamKey}=${inputValue}`);
    let options = response.data.rows;
    return options;
  };

  const getOptionLabel = (option) => {
    return option.name;
  };

  const getOptionValue = (option) => {
    return option.id;
  };

  const getOptionLabelUser = (option) => {
    return option.fullName;
  };

  const asyncReactSelect = {
    handleInputChange,
    getAsyncOptions,
    getOptionLabel,
    getOptionValue,
    getOptionLabelUser,
  };

  return asyncReactSelect;
}
