import { useNavigate } from "react-router-dom";

import "./RegisterForm.css";

type UserInfoType = {
    name: string
    email: string
    password: string
}

const RegisterForm = () => {
    const navigate = useNavigate()

    const createUser = async (userInfo: UserInfoType) => {
        try {
            const response = await fetch(`/add-user`, {
                method: 'POST',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo)
            })
            const responseData = await response.json()

            if (response.status === 200) {
                alert(responseData.message || 'User created successfully')
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const validatePassword = (password: string) => {
        // Regex pattern to match at least one lowercase letter, one uppercase letter, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        return passwordRegex.test(password);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = e.target as typeof e.target & {
            name: { value: string }
            email: { value: string }
            password: { value: string }
        }

        const userInfo: UserInfoType = {
            name: formData.name.value,
            email: formData.email.value,
            password: formData.password.value
        }


        const password = formData.password.value

        if (validatePassword(password)) {
            createUser(userInfo)
        } else {
            console.log('Password is invalid')
        }
    }

    return (
        <div className="register-form-container">
            <h1>Register Form</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <input placeholder="Name" type="text" name="name" required />
                <input placeholder="Email" type="email" name="email" required />
                <input placeholder="Password" type="text" name="password" required />
                <button type="submit">Submit registration</button>
            </form>
        </div>
    )
}

export default RegisterForm