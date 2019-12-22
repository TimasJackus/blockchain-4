import React from 'react';
import useLocalStorage from '@rehooks/local-storage';
import { Panel, Button } from 'rsuite';

const products = [
    { id: 0, title: "Džinsai", price: 15, img: 'https://images-na.ssl-images-amazon.com/images/I/713eyLisR%2BL._AC_UX679_.jpg', seller: null },
    { id: 2, title: "Džemperis", price: 3, img: 'https://i.pinimg.com/originals/79/71/0c/79710c93751d4ffd4fbd635eb3b7a153.jpg', seller: null },
    { id: 3, title: "Striukė", price: 6, img: 'https://media.fjallraven.eu/zoom/7323450066840_FW18_a_singi_winter_jacket_m_fjaellraeven_21.jpg', seller: null },
    { id: 4, title: "Kepurė", price: 3, img: 'https://www.arteni.it/77055-thickbox_default/classic-winter-cap-with-logo-refrigiwear.jpg', seller: null },
    { id: 5, title: "Pirštinės", price: 27, img: 'https://www.helikon-tex.com/media/catalog/product/cache/4/image/9df78eab33525d08d6e5fb8d27136e95/r/k/rk-rgw-le-30.jpg', seller: null }
];

export const ProductListView = ({ accounts, contract, loadBlockchainData }) => {
    const [account] = useLocalStorage('selected-account');
    const sellers = accounts ? accounts.filter(acc => acc.role === 'SELLER') : null;

    if (sellers) {
        products.forEach((product, index) => {
            product.seller = sellers[index % sellers.length];
        });
    }

    const handleClick = (product) => () => {
        const test = async () => {
            const orderRes = await contract.methods.sendOrder(product.seller.address, product.title).send({ from: account.address, gas: 1000000 });
            const orderno = orderRes.events.OrderSent.returnValues.orderno;
            await contract.methods.sendPrice(orderno, product.price / 3, product.price / 3, product.price / 3).send({ from: product.seller.address, gas: 1000000 });
            await contract.methods.sendSafepay(orderno).send({ from: account.address, gas: 1000000, value: product.price * Math.pow(10, 18) });
            loadBlockchainData();
        };
        test();
    }
    
    
    return (
        <div className="container">
            { products && products.map((product) => 
                <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240, textAlign: 'center', margin: 10 }} key={product.id}>
                    <img src={ product.img ? product.img : 'https://via.placeholder.com/240x240'} height="240"/>
                    <Panel header={product.title}>
                        <p>
                            <strong>{product.price}</strong> ETH <br/>
                            {product.seller && <div style={{ wordBreak: 'break-all' }}>Seller: <strong>{product.seller.address}</strong></div>}
                        </p><br />
                        <Button color="green" onClick={handleClick(product)}>Buy product</Button>
                    </Panel>
                </Panel>
            )}
        </div>
    );
};