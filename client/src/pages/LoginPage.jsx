import React, { useContext, useState } from "react";
import assets from "../assets/assets";
// FIX: removed invalid 'data' import from react-router-dom
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { login } = useContext(AuthContext);

  function onSubmitHandler(e) {
    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? "signup" : "login", {
      fullname,
      email,
      password,
      bio,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center sm:justify-evenly flex-col sm:flex-row gap-8 px-4 py-8 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex-shrink-0">
        <img
          src={assets.logo_big}
          alt="Logo"
          className="w-[180px] sm:w-[220px] lg:w-[260px]"
        />
      </div>

      {/* Form card */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-gray-500/50 text-white p-6 sm:p-8 flex flex-col gap-5 rounded-2xl shadow-2xl"
      >
        {/* Title row */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-2xl">{currState}</h2>
          {isDataSubmitted && (
            <button
              type="button"
              onClick={() => setIsDataSubmitted(false)}
              className="flex items-center gap-1 text-sm text-violet-300 hover:text-violet-100 transition-colors"
            >
              <img src={assets.arrow_icon} alt="Back" className="w-4 rotate-180" />
              Back
            </button>
          )}
        </div>

        {/* Full name — Sign up step 1 */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullname(e.target.value)}
            value={fullname}
            type="text"
            className="w-full p-3 bg-white/10 border border-gray-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400 text-white"
            placeholder="Full Name"
            required
          />
        )}

        {/* Email + Password */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full p-3 bg-white/10 border border-gray-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400 text-white"
              placeholder="Email Address"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-full p-3 bg-white/10 border border-gray-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400 text-white"
              placeholder="Password (min 6 chars)"
              minLength={6}
              required
            />
          </>
        )}

        {/* Bio — Sign up step 2 */}
        {currState === "Sign up" && isDataSubmitted && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-400">Tell others a little about yourself</p>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className="w-full p-3 bg-white/10 border border-gray-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400 text-white resize-none"
              placeholder="Write a short bio..."
              required
            />
          </div>
        )}

        {/* Terms */}
        {!isDataSubmitted && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="sr-only"
                required
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                agreedToTerms ? "bg-violet-500 border-violet-500" : "border-gray-500"
              }`}>
                {agreedToTerms && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
              I agree to the{" "}
              <span className="text-violet-400 underline cursor-pointer">Terms of Use</span>
              {" & "}
              <span className="text-violet-400 underline cursor-pointer">Privacy Policy</span>
            </p>
          </label>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium rounded-xl cursor-pointer transition-all duration-200 shadow-lg shadow-violet-900/30 active:scale-[0.98]"
        >
          {currState === "Sign up"
            ? isDataSubmitted
              ? "Create Account"
              : "Continue"
            : "Login Now"}
        </button>

        {/* Toggle sign up / login */}
        <div className="text-center text-sm">
          {currState === "Sign up" ? (
            <p className="text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-400 hover:text-violet-200 cursor-pointer transition-colors"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-400">
              Don't have an account?{" "}
              <span
                onClick={() => setCurrState("Sign up")}
                className="font-medium text-violet-400 hover:text-violet-200 cursor-pointer transition-colors"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
