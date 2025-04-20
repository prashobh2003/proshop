import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"; 
import FormContainer from "../Components/FormContainer";
import Loader from "../Components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';

function RegisterScreen() {
    const [name,setName] = useState('');
    const [email,setEmail] =useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setconfirmPassword] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const[register, {isLoading}] = useRegisterMutation();

    const{userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search); //sp=search param
    const redirect = sp.get('redirect') || '/';

    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    },[userInfo, redirect, navigate])

    const submitHandler = async(e) => {
        e.preventDefault();
        if(password!==confirmPassword){
            toast.error('Passwords do not match');
        }else{
            try {
                const res = await register({name, email, password }).unwrap();
                dispatch(setCredentials({...res}));
                navigate(redirect);
            } catch (error) {
                toast.error(error?.data?.message||error.error);
            }
        }
        };
        

    return (
        <FormContainer>
            <h1>Sign In</h1>

            <Form onSubmit = {submitHandler}>
                 <Form.Group controlId ='name' className="my-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type = 'name'
                        placeholder="Enter name"
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                
                <Form.Group controlId ='email' className="my-3">
                    <Form.Label>Email Adress</Form.Label>
                    <Form.Control
                        type = 'email'
                        placeholder="Enter email"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId ='password' className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type = 'password'
                        placeholder="Enter password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId ='confirm password' className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type = 'confirm password'
                        placeholder="Confirm password"
                        value = {confirmPassword}
                        onChange = {(e) => setconfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type = 'submit' variant = 'primary' className="mt-2" disabled={isLoading}>
                    Register
                </Button>
                {isLoading && <Loader />}
            </Form>

            <Row className="py-3">
                <Col>
                    Already have an account? <Link to = 
                    {redirect ? `/login?redirect=${redirect}`: '/login'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen