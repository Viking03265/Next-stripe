
const SubmitButton = ({ processing, error, children, disabled, style }) => (
    <button
        className={`SubmitButton ${error ? "SubmitButton-error" : ""}`}
        type="submit" disabled={processing || disabled}
        style={style}
    >
        {processing ? "Processing..." : children}
    </button>
);

export default SubmitButton