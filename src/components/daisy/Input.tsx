type InputProps = {
    label?: string
    isError?: boolean
    rootClassName?: string
} & React.ComponentProps<'input'>

function Input({ label, isError, className, rootClassName, ...props }: InputProps) {
    return (
        <div className={`form-control ${rootClassName}`}>
            {label && (
                <label className="label">
                    <span className="text-xs md:text-sm lg:text-base label-text">{label}</span>
                </label>
            )}
            <input
                className={`input input-bordered w-full ${isError ? 'input-error' : ''} ${className || ''}`}
                {...props}
            />
        </div>
    )
}

export { Input }
