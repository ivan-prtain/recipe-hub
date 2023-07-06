
import { Link } from "react-router-dom"
import { AppUserType } from "../../App"

import "./Login.css"

type LoginDataType = {
    email: string
    password: string
}

type LoginProps = {
    onLogin: React.Dispatch<React.SetStateAction<AppUserType | null | undefined>>
}

const Login = ({ onLogin }: LoginProps) => {

    const loginUser = async (userInfo: LoginDataType) => {
        try {
            const response = await fetch(`/login`, {
                method: 'POST',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo)
            })

            const responseData = await response.json()

            if (response.status === 200) {
                onLogin(responseData.appUser)
                localStorage.setItem('appUser', JSON.stringify(responseData.appUser));
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            email: { value: string }
            password: { value: string }
        }

        const userInfo: LoginDataType = {
            email: target.email.value,
            password: target.password.value
        }

        loginUser(userInfo)
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <input placeholder="email" name="email" />
                <input placeholder="password" name="password" />
                <button type="submit">Login</button>
            </form>
            <br />
            <div className="login__register">
                <div>Not registered?</div>
                <div>Register now!</div>
                <Link className="login-link" to="/register">Register</Link>
            </div>
        </div>
    )
}

export default Login