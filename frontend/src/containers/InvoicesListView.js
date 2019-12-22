import React, { useState } from 'react';
import useLocalStorage from '@rehooks/local-storage';
import { Panel, Button, List, FlexboxGrid, SelectPicker } from 'rsuite';

export const InvoicesListView = ({ contract, loadBlockchainData }) => {
    const [account] = useLocalStorage('selected-account');
    const [invoices, setInvoices] = useState([]);
    const [fetched, setFetched] = useState(false);

    const getInvoices = async() => {
        const results = [];
        const count = await contract.methods.getInvoicesCount().call({ from: account.address, gas: 1000000 });
        for (let i = 1; i <= count; i++) {
            const invoice = await contract.methods.getInvoice(i).call({ from: account.address, gas: 1000000 });
            const [invoiceno, orderno, courierAddres, delivered] = Object.values(invoice);
            if (courierAddres === account.address) {
                results.push({ invoiceno, orderno, courierAddres, delivered: Boolean(delivered) });
            }
        }
        setInvoices(results);
        setFetched(true);
    };

    if (!fetched) {
        getInvoices();
    }

    const handleClick = (invoice, index) => async () => {
        await contract.methods.delivery(invoice.invoiceno).send({ from: account.address, gas: 1000000 });
        loadBlockchainData();

        setInvoices(invoices.map((inv, i) => {
            if (index !== i) return inv;
            return {
                ...inv,
                delivered: true
            };
        }));
    };


    return (
        <div className="container">
            { invoices && invoices.length > 0 &&
                <List bordered={true}>
                    { invoices.map((invoice, i) => (
                    <List.Item key={i} index={i}>
                        <FlexboxGrid justify="space-between" align="middle">
                            <FlexboxGrid.Item>
                                {invoice.invoiceno}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                {invoice.orderno}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                <Button color="blue" disabled={invoice.delivered} onClick={handleClick(invoice, i)}>
                                    Set to delivered
                                </Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    ))}
                </List>
            }
            { invoices && invoices.length === 0 ? <div>No invoices</div> : null}
        </div>
    );
};