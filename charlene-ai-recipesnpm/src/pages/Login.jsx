import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ darkMode }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                setMessage(data.detail || "Login failed");
                return;
            }

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.reload();

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
                onSubmit={handleLogin}
                className={
                    darkMode
                    ? "bg-gray-800 p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-[400px]"
                    : "bg-white p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-[400px]"
                }
            >
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={
                        darkMode
                        ? "bg-gray-700 text-white p-4 rounded-2xl outline-none"
                        : "bg-white text-black p-4 rounded-2xl border outline-none"
                    }
                    />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={
                        darkMode
                        ? "bg-gray-700 text-white p-4 rounded-2xl outline-none"
                        : "bg-white text-black p-4 rounded-2xl border outline-none"
                    }
                    />

                <button type="submit">
                    Login
                </button>

                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default Login;