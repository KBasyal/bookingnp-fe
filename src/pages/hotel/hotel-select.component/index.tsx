
import Select from 'react-select';

const SelectHotelComponent = ({ options, value, onChange, errMsg, isDisabled }:any) => (
  <div>
    <Select
      options={options}
      value={options.find((option: { value: any; }) => option.value === value)}
      onChange={selectedOption => onChange(selectedOption ? selectedOption.value : '')}
      isDisabled={isDisabled}
    />
    {errMsg && <span className="text-red-500">{errMsg}</span>}
  </div>
);

export default SelectHotelComponent;
