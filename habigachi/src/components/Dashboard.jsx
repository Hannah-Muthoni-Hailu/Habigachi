import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const [incomplete, setIncomplete] = useState([]);
    const [complete, setComplete] = useState([]);
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [formData, setFormData] = useState({
        'name': '',
        'goal': 0,
    });

    useEffect(() => {
        setIncomplete(JSON.parse(localStorage.getItem("incomplete")))
        setComplete(JSON.parse(localStorage.getItem("complete")))
    }, []);

    const newHabit = async () => {
        try {
            console.log(complete[0])
            const res = await fetch("http://localhost:3000/newHabit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'email': localStorage.getItem("email"),
                    'name': formData.name,
                    'goal': formData.goal
                })
            });

            const response = await res.json();

            if (!res.ok) {
                console.log(response.errors);
                setErrors(response.errors);
            } else {
                alert("Your new habit has been created!");
                localStorage.setItem("email", response.email)
                localStorage.setItem("complete", JSON.stringify(response.complete))
                localStorage.setItem("incomplete", JSON.stringify(response.incomplete))
                setIncomplete(response.incomplete);
                setComplete(response.complete);
                setFormData({
                    'name': '',
                    'goal': 0,
                })
                setShow(false)
            }
        } catch (error) {
            console.log(error);
            setErrors(["Internal Server error. Try again later!"]);
        }
    }

    const markHabit = async (name) => {
        try {
            const res = await fetch("http://localhost:3000/markHabit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem("email"),
                    name: name,
                })
            });

            const response = await res.json();

            if (!res.ok) {
                alert(response.errors, "\nTry again later");
            } else {
                alert("Habit completed successfully.")
                localStorage.setItem("email", response.email)
                localStorage.setItem("complete", JSON.stringify(response.complete))
                localStorage.setItem("incomplete", JSON.stringify(response.incomplete))
                setIncomplete(response.incomplete);
                setComplete(response.complete);
            }
        } catch (error) {
            
        }
    }
    
    return(
        <div className="container" style={{ overflow: "hidden", height: "100vh" }}>
            <div className="row h-100">
                <section className="col-4 rounded-4 h-100" id="habit-selection">
                    <Button onClick={() => setShow(true)}>New habit</Button>
                    {incomplete.map((habit) => {
                        return (<div key={habit._id} className="bg-light border border-1 rounded m-1">
                            <Button onClick={() => markHabit(habit.name)} className="bg-light border border-dark rounded-circle">
                                
                            </Button>
                            <p>{habit.name}</p>
                        </div>)
                    })}
                    {complete.map((habit) => {
                        return (<div key={habit._id} className="bg-dark text-white border border-1 rounded m-1">
                            <p>{habit.name}</p>
                        </div>)
                    })}
                </section>
            </div>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header className='modalHeader' closeButton></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Enter a name for your new habit</Form.Label>
                            <Form.Control type="text" value={formData['name']} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>How many days do you want a successful streak to be?</Form.Label>
                            <Form.Control type="number" value={formData['goal']} onChange={e => setFormData({...formData, goal: e.target.value})} />
                        </Form.Group>
                        <Button onClick={newHabit}>
                            {spinning && (<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />)} Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}