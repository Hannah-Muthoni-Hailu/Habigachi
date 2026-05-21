import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return(
    <>
        <Link to="/signup" state={{ isSignup: true }} ><Button>Signup</Button></Link>
        <Link to="/signup" state={{ isSignup: false }}><Button>Login</Button></Link>
    </>
    )
}