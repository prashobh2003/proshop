import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery, 
        useUpdateProductMutation,
        useUploadProductImageMutation } from "../../slices/productApiSlice";
import FormContainer from "../../Components/FormContainer";
import Loader from "../../Components/Loader";
import Message from "../../Components/Message";
import { Form,Button } from "react-bootstrap";

const ProductEditScreen = () => {

    const { id: productId } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const {data:product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);
    
    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload } ] = useUploadProductImageMutation();
    const navigate = useNavigate();

    useEffect(() => { 
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async(e) =>{
        e.preventDefault();
        const updatedProduct = {
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        };

        const result = await updateProduct(updatedProduct);
        if(result.error){
            toast.error(result.error);
        }else{
            toast.success('Product updated');
            navigate('/admin/productlist')
        }

    }

    const uploadFileHandler = async(e) => {
        const formData = new FormData();
        formData.append('image',e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }


  return (
    <>
        <Link to = '/admin/productlist' className="btn btn-light my-2">
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product</h1>
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

                    <Form.Group controlId='price' className="my-2">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder="Enter price"
                            value={price}
                            onChange = {(e) => setPrice(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="image" className="my-2">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control 
                             type="text"
                             placeholder="Enter image URL"
                             value={image}
                             onChange={(e) => setImage(e.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId="image-file" className="my-2">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={uploadFileHandler}
                            />
                        </Form.Group>

                    <Form.Group controlId='brand' className="my-2">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder="Enter brand"
                            value={brand}
                            onChange = {(e) => setBrand(e.target.value)}
                        />
                    </Form.Group>

                    
                    <Form.Group controlId='countInStock' className="my-2">
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder="Enter countInStock"
                            value={countInStock}
                            onChange = {(e) => setCountInStock(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='category' className="my-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder="Enter category"
                            value={category}
                            onChange = {(e) => setCategory(e.target.value)}
                       />
                    </Form.Group>

                    <Form.Group controlId='descrirption' className="my-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder="Enter description"
                            value={description}
                            onChange = {(e) => setDescription(e.target.value)}
                        />
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

export default ProductEditScreen