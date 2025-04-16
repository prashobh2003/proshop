import {useParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'
import {Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap';
import Rating from '../Components/Rating';


const ProductScreen = () => {
    const { id:productID } = useParams();
    console.log(productID)
    const [product,setProduct] = useState({});
    useEffect(()=>{
        const getProduct = async () => {
            const {data} = await axios.get(`/api/products/${productID}`);
            setProduct(data);
            console.log(data.image);
        }
        getProduct();

    },[productID])
    
    
  return (
    <>

        <Link className='btn btn-light my-3' to = '/'>Go Back</Link>
        <Row>
            <Col md = {5}>
                <Image src = {product.image} alt = {product.name} fluid />
            </Col>
            <Col md = {4}>
                <ListGroup variant = 'flush'>
                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value ={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroup.Item>
                    <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                    <ListGroup.Item>
                            <Row> 
                                <Col>Description: {product.description}</Col>
                            </Row>
                         </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md = {3}>
                <Card>
                    <ListGroup variant='flush'>
                         <ListGroup.Item>
                            <Row>
                                <Col><strong>Price: ${product.price}</strong></Col>
                            </Row>
                         </ListGroup.Item>
                         <ListGroup.Item>
                            <Row>
                                <Col>Status: </Col>
                                <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'} </Col>
                            </Row>
                         </ListGroup.Item>
                         <ListGroup.Item>
                            <Row>
                              <Button 
                                 className='btn-block'
                                 type = 'button' 
                                 disabled={product.countInStock===0}>
                                    Add to cart
                               </Button>
                            </Row>
                         </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default ProductScreen