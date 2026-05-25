import { Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function Dashboard() {
    const [habits, setHabits] = useState([{
        'id': '1',
        'name': 'Take trash out'
    }])
    
    return(
        <div className="container" style={{ overflow: "hidden", height: "100vh" }}>
            <div className="row h-100">
                <section className="col-4 rounded-4 h-100" id="habit-selection">
                    <Button>New habit</Button>
                    {habits.map((habit) => {
                        <Form key={habit.id} className="d-flex flex-row-reverse align-items-center w-100 ps-1 pe-2 h-25">
                            <Form.Group className="rounded-4 p-1 d-flex flex-column align-items-center w-100 h-75">
                                <p className="fs-6 h-25 p-2">habit.name</p>
                                <Form.Control type="text" name="habit" value={habit.id} hidden />
                                <Button type="submit" className="btn btn-warning">Delete</Button>
                            </Form.Group>
                        </Form>
                    })}
                </section>
            </div>
        </div>
    )
}