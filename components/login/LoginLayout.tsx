

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white relative">
      {/* LEFT */}
      <div className="hidden md:flex md:w-1/2 bg-[#5A4FB5] relative justify-center items-center py-10 overflow-visible">
        <img
          src="/assets/Group36.svg"
          alt="bg"
          width={650}
          height={648}
          className="absolute left-25 -translate-y-2"
        />
        <img
          src="/assets/Group37.svg"
          alt="person"
          width={318}
          height={437}
          className="relative z-50 translate-y-28 translate-x-60"
        />
      </div>

      {/* RIGHT */}
      <div className="md:w-1/2 w-full flex flex-col justify-center px-6 md:px-50 py-10">
      
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default LoginLayout;
