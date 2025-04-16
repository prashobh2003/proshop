import { useEffect,useState } from 'react';
import axios from 'axios'
import { Row, Col } from 'react-bootstrap';
import Product from '../Components/Product';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  const [products,setProducts] = useState([]);
  useEffect(()=>{
    async function getProducts(){
      const {data}= await axios.get('/api/products');
      setProducts(data);
    };
    getProducts();
  },[])
  return (
    <>
        <h1>Latest Products</h1>
        <Row>
            {products.map((product)=>(
                <Col key = {product._id} sm={12} md={6} lg={4} xl={4}>
                    <Product product = {product} />
                </Col>
            ))}
        </Row>
    </>
  )
}

export default HomeScreen