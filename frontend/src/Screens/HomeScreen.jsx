import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Meta from '../Components/Meta';
import Product from '../Components/Product';
import Paginate from '../Components/Paginate';
import { useGetProductsQuery } from '../slices/productApiSlice';
import Loader from '../Components/Loader';
import ProductCarousel from '../Components/ProductCarousel';
import Message from '../Components/Message';
import { useEffect } from 'react';

const HomeScreen = () => {
  const { keyword='', pageNumber=1} = useParams();
  const {data, isLoading, error} = useGetProductsQuery({keyword,pageNumber});
  console.log('ProductCarousel error:', error);
  useEffect(() => {
    document.title = 'Proshop';
  }, []);


  return (
    <>
        {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
        {isLoading ? (
          <Loader />
        ) : error ? (<Message variant = 'danger'>{error?.data?.message || error.error }</Message>

        ) : (
        <>  
    
        <h1>Latest Products</h1>
        <Row>
            {data.products.map((product)=>(
                <Col key = {product._id} sm={12} md={6} lg={4} xl={4}>
                    <Product product = {product} />
                </Col>
            ))}
        </Row>

       <Paginate 
          pages={data.pages} 
          page={data.page}
          keyword = {keyword}
          />
        </>)
}
    </>
  )
}

export default HomeScreen