import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

export default function Signup() {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(true);
    const [formData, setFormData] = useState({
        'username': "",
        'email': "",
        'password': "",
    });
    const [spinning, setSpinning] = useState(false);
    const [errors, setErrors] = useState([]);

    const location = useLocation();

    useEffect(() => {
        setIsSignup(location.state?.isSignup ?? true)
    }, [location.state]);

    const handleSignup = async () => {
        setErrors([]);
        setSpinning(true);

        try {
            const res = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            const response = await res.json();

            if (!res.ok) {
                setErrors(response.errors)
            } else {
                localStorage.setItem("email", response.email)
                localStorage.setItem("complete", JSON.stringify(response.complete))
                localStorage.setItem("incomplete", JSON.stringify(response.incomplete))
                navigate("/dashboard")
                console.log("Successful sign in");
                setFormData({
                    'username': "",
                    'email': "",
                    'password': "",
                })
            }
            setSpinning(false);
        } catch (error) {
            console.log(error);
            setErrors(["Internal Server Error. Please try again later"]);
            setSpinning(false);
        }
    }

    const handleLogin = async () => {
        setErrors([]);
        setSpinning(true);

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            const response = await res.json();

            if (!res.ok) {
                setErrors(response.errors);
            } else {
                localStorage.setItem("email", response.email)
                localStorage.setItem("complete", JSON.stringify(response.complete))
                localStorage.setItem("incomplete", JSON.stringify(response.incomplete))
                navigate("/dashboard")
                setFormData({
                    'username': "",
                    'email': "",
                    'password': "",
                })
            }
            setSpinning(false);
        } catch (error) {
            console.log(error);
            setErrors(["Internal Server Error. Please try again later"])
            setSpinning(false);
        }
    }

    return(
        <Form className="w-50 mx-auto border border-2 p-4 rounded mt-5">
            { 
                errors.map((error) => {
                    return <Alert variant="danger" key={error} onClose={() => setErrors([])} dismissible>
                        {error}
                    </Alert>
                })
            }
            {
                isSignup ?
                <Form.Group className="mt-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={formData['username']} onChange={e => setFormData({...formData, username: e.target.value})} />
                </Form.Group> : null
            }
            <Form.Group className="mt-2" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={formData['email']} onChange={e => setFormData({...formData, email: e.target.value})} />
            </Form.Group>
            <Form.Group className="mt-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={formData['password']} onChange={e => setFormData({...formData, password: e.target.value})} />
            </Form.Group>
            <div className="text-center mt-3">
                <Button onClick={isSignup == true ? handleSignup : handleLogin}>
                    {spinning && (<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />)} Submit
                </Button>
            </div>
        </Form>
    )
}