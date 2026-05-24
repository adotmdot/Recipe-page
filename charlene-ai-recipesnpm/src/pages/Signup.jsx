import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({ darkMode }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.detail || "Signup failed");
                return;
            }

            setMessage("Signup successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        }
    };

    return (
        <div
            className={
                darkMode
                ? "bg-gray-900 text-white min-h-screen flex items-center justify-center"
                : "bg-[#081028] min-h-screen flex items-center justify-center"
            }
        >
            <form
                onSubmit={handleSignup}
                className={
                    darkMode
                    ? "bg-gray-800 p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-[400px]"
                    : "bg-white p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-[400px]"
                }
            >
                <h2>Create Account</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Sign Up
                </button>

                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default Signup;