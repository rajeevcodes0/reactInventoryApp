import React, { useContext, useEffect, useState } from 'react'

import AppManager from '../../../store/app-manager';
import ProductItem from './ProductItem';
import classes from './ShowProducts.module.css';

function ShowProducts() {
    const AppManagerContext = useContext(AppManager);
    const [productList, setProductList] = useState(false);
    console.log(productList);

    //a function to get data from the server
    const getData = async ()=>{
        const response = await fetch("https://genxtutorial.com/api2/product/show/index.php");
        const responseJSON = await response.json();

        console.log(responseJSON);

        //we reverse the array so that we get the newest added product at the top
        const responseJSONReversed = responseJSON.reverse();
        //setting the array to the state
        setProductList(responseJSONReversed);
    }

    //we retrieve data when the component mounts
    useEffect(()=>{
        getData();
    },[])


    const deleteProductAPICall = async (data)=>{
        const response = await fetch("https://genxtutorial.com/api2/product/delete/index.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })

        const responseJSON = await response.json();

        console.log(responseJSON);
        if(responseJSON.status){
            AppManagerContext.showPrompt("success","Product Deleted");
            AppManagerContext.updateAppData();
        }else{
            AppManagerContext.showPrompt("error","Some Error Occurred");
        }
    }
    const onDeleteHandler = (e)=>{
        const targetIndex = parseInt(e.target.dataset.id);
        //targetProductName is the name of the package to be deleted
        const targetProductName = productList[targetIndex].product_name;

        let newProductList = productList.filter((productName,index)=>{
            return targetIndex!=index;
        })

        setProductList(newProductList);

        const dataToSendToServer = {
            product_name:targetProductName
        }

        console.log(dataToSendToServer);
        deleteProductAPICall(dataToSendToServer);
    }

    return (
        <div className={classes['show-packages-container']}>
            {productList?productList.map((product,index)=>{
                return (
                  <ProductItem
                    name={product.product_name}
                    discount={product.discount}
                    index={index}
                    className={classes["package-item-container"]}
                    onDelete={onDeleteHandler}
                  />
                );
            }):<h1>Loading</h1>}
        </div>
    )
}

export default ShowProducts;
