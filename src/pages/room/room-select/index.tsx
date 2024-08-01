
import Select from 'react-select';

const SelectRoomComponent = ({ options, value, onChange, errMsg, isDisabled, placeholder }:any) => {
    return (
        <div>
            <Select
                options={options}
                value={options.find((option: { value: any; }) => option.value === value)}
                onChange={onChange}
                isDisabled={isDisabled}
                placeholder={placeholder}
                className="basic-single"
                classNamePrefix="select"
            />
            {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
        </div>
    );
};

export default SelectRoomComponent;
