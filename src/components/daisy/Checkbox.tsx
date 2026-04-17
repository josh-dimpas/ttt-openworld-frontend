type CheckboxProps = {
    label?: string;
} & React.ComponentProps<"input">;

function Checkbox({ label, className, ...props }: CheckboxProps) {
    // oxlint-disable-next-line react-hooks-js/purity
    const id = props.id || `checkbox-${Math.random().toString(36).slice(2)}`;
    return (
        <div className="form-control">
            <label className="label cursor-pointer" htmlFor={id}>
                <span className="label-text text-xs md:text-sm lg:text-base">{label}</span>
                <input
                    type="checkbox"
                    id={id}
                    className={`checkbox checkbox-primary ${className || ""}`}
                    {...props}
                />
            </label>
        </div>
    );
}

export { Checkbox };
