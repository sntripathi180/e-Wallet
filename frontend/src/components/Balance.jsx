export const Balance = ({ value = 0 }) => {
    return (
        <div className="flex items-center">
            <div className="font-bold text-lg">Your balance</div>
            <div className="font-semibold ml-4 text-lg">
                ₹ {Number(value).toLocaleString("en-IN")}
            </div>
        </div>
    );
};
