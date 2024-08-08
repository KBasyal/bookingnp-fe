import { useController } from 'react-hook-form';
import Select from 'react-select';

interface TextInputProps {
    control: any;
    name: string;
    type: string;
    errMsg?: string | null;
    required?: boolean;
    className?: string; // Add className prop
    disabled?: boolean; // Add disabled prop if needed
}

export const TextInputField = ({ control, type = "text", name, errMsg = null, className, required = false, disabled = false }: TextInputProps) => {
    const { field } = useController({
        control: control,
        name: name,
    });

     return (
        <div className="col-span-6 sm:col-span-3">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 capitalize">
                {name.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
                id={name}
                type={type}
                autoComplete={name}
                {...field}
                className={className || "mt-1 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"}


            />
            <span className="text-red-500 text-sm">{errMsg}</span>
        </div>
    );
}

interface SelectComponentProps {
    errMsg?: string | null;
    name: string;
    control: any;
    options?: { label: string; value: string }[];
}

export const SelectComponent = ({ errMsg = null, name, control, options = [] }: SelectComponentProps) => {
    const { field } = useController({
        control: control,
        name: name,
    });

    return (
        <div className="col-span-6 sm:col-span-3">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 capitalize">
                {name.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <select
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                {...field}
            >
                <option value="">Select any one</option>
                {options && options.map((opt, ind) => (
                    <option key={ind} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="text-red-500 text-sm">{errMsg}</div>
        </div>
    );
}

export const SelectOptionComponent = ({ errMsg = null, name, control, options = [] }: SelectComponentProps) => {
    const { field } = useController({
        control: control,
        name: name,
    });

    return (
        <div className="col-span-6 sm:col-span-3">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 capitalize">
                {name.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <Select
                options={options}
                {...field}
                isClearable={true}
                className="mt-1"
                classNamePrefix="react-select"
            />
            <div className="text-red-500 text-sm">{errMsg}</div>
        </div>
    );
}
