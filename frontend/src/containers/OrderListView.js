import React, { useState } from 'react';
import useLocalStorage from '@rehooks/local-storage';
import { Panel, Button, List, FlexboxGrid, SelectPicker } from 'rsuite';

export const OrderListView = ({ accounts, contract }) => {
    const [account] = useLocalStorage('selected-account');
    const [orders, setOrders] = useState([]);
    const [fetched, setFetched] = useState(false);
    const couriers = accounts ? accounts.filter(acc => acc.role === 'COURIER').map(courier => { return { ...courier, value: courier.address, label: courier.address }}) : null;


    const getOrders = async() => {
        const results = [];
        const count = await contract.methods.getOrdersCount().call({ from: account.address, gas: 1000000 });
        for (let i = 1; i <= count; i++) {
            const order = await contract.methods.getOrder(i).call({ from: account.address, gas: 1000000 });
            const [orderno, buyerAddress, sellerAddress, shipmentAddress, date, productTitle] = Object.values(order);
            if (sellerAddress === account.address) {
                results.push({ orderno, buyerAddress, sellerAddress, shipmentAddress, date: new Date(Number(date) * 1000).toLocaleDateString(), productTitle });
            }
        }
        setOrders(results);
        setFetched(true);
    };

    if (!fetched) {
        getOrders();
    }

    const onChange = (order, index) => async (event) => {
        var targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 10);

        await contract.methods.sendInvoice(order.orderno, Number(targetDate), event).send({ from: account.address, gas: 1000000 });
        setOrders(orders.map((o, i) => {
            if (index !== i) return o;
            return {
                ...o,
                shipmentAddress: event
            };
        }));
    };


    return (
        <div className="container">
            { orders && orders.length > 0 &&
                <List bordered={true}>
                    { orders.map((order, i) => (
                    <List.Item key={i} index={i}>
                        <FlexboxGrid justify="space-between" align="middle">
                            <FlexboxGrid.Item>
                                {order.orderno}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                {order.buyerAddress}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                {order.date}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                {order.productTitle}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                <SelectPicker
                                    onChange={onChange(order, i)}
                                    data={couriers}
                                    disabled={order.shipmentAddress !== '0x0000000000000000000000000000000000000000'}
                                    defaultValue={order.shipmentAddress}
                                    style={{ width: 200 }}
                                />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    ))}
                </List>
            }
            { orders && orders.length === 0 ? <div>No orders</div> : null}
        </div>
    );
};