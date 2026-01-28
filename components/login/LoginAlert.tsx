interface Props {
  errorMsg: string | null;
  successMsg: string | null;
  onClose: () => void;
}

const LoginAlert = ({ errorMsg, successMsg, onClose }: Props) => {
  if (!errorMsg && !successMsg) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-6 py-3 rounded-lg shadow border flex gap-3
        ${errorMsg ? "bg-[#FFE0DE] border-[#D40C00]" : "bg-[#E1F7EA] border-[#257047]"}`}
      >
        <img
          src={errorMsg ? "/assets/icons/error.svg" : "/assets/icons/success.svg"}
          className="w-5 h-5"
        />

        <div>
          <p className="font-bold">
            {errorMsg ? "Login Failed" : "Login Success"}
          </p>
          <p className="text-sm">{errorMsg || successMsg}</p>
        </div>

        <button onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default LoginAlert;
