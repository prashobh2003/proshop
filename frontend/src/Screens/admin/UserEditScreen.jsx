import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetUserDetailsQuery, 
        useUpdateUserMutation,
         } from "../../slices/usersApiSlice";
import FormContainer from "../../Components/FormContainer";
import Loader from "../../Components/Loader";
import Message from "../../Components/Message";
import { Form,Button } from "react-bootstrap";

const UserEditScreen = () => {

    const { id: userId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
   const [ isAdmin, setIsAdmin ] = useState(false)

    const {data:user, isLoading, refetch, error} = useGetUserDetailsQuery(userId);
    
    const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(() => { 
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
            
        }
    }, [user]);

    const submitHandler = async(e) =>{
        e.preventDefault();
        try {
            await updateUser({ userId, name, email, isAdmin});
            toast.success('User updated successfully');
            refetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    }


  return (
    <>
        <Link to = '/admin/userlist' className="btn btn-light my-2">
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}

            {isLoading ? <Loader /> : error ? <Message variant='danger' >{error}</Message>:(
                <Form>
                    <Form.Group controlId='name'className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder="Enter name"
                            value={name}
                            onChange = {(e) => setName(e.target.value)}
                       />
                    </Form.Group>

                    <Form.Group controlId='email' className="my-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder="Enter email"
                            value={email}
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                   <Form.Group controlId='isAdmin'className="'my-2">
                    <Form.Check 
                        type='checkbox'
                        label='Is Admin'
                        checked = {isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                   </Form.Group>

                    <Button
                        type='submit'
                        variant='primary'
                        className='my-2'
                        onClick={submitHandler}
                    >Update</Button>

                    
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default UserEditScreen