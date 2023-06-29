
import RegisterForm from "./RegisterForm"
import { Link } from "react-router-dom"
import { AppUserType } from "../../App"

type LoginDataType = {
    email: string
    password: string
}

type LoginProps = {
    onLogin: React.Dispatch<React.SetStateAction<AppUserType | null | undefined>>
}

const Login = ({ onLogin }: LoginProps) => {

    const fetchAllUsers = async () => {
        try {

            const response = await fetch(`/all-users`, {
                method: 'GET',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                }
            })

            const data = await response.json()


            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }



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
            console.log(responseData)

            if (response.status === 200) {
                onLogin(responseData.appUser)
                localStorage.setItem('appUser', JSON.stringify(responseData.appUser));
                console.log("succesfully logged in")
            }
        } catch (error) {
            console.log(error)
        }
    }

    /*     const fetchUser = async () => {
            try {
    
                const response = await fetch(`/get-user/?appUserId=author01`, {
                    method: 'GET',
                    headers: {
                        authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                        "Content-Type": "application/json",
                    }
                })
    
                const data = await response.json()
    
    
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        } */




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

        console.log(userInfo)
        loginUser(userInfo)

    }


    return (
        <div>
            <h1>Login</h1>
            <button onClick={fetchAllUsers}>Get Users</button>
            <form onSubmit={handleLogin}>
                <input placeholder="email" name="email" />
                <input placeholder="password" name="password" />
                <button type="submit">Login</button>
            </form>
            <br />
            <div>
                <Link to="/register">Register</Link>
            </div>
        </div>
    )
}

export default Login