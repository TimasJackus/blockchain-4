pragma solidity ^0.4.18;

contract Vinted {
    address public serviceProvider;

    constructor() public payable {
        serviceProvider = msg.sender;
    }
    
    struct Order {
        address buyer;
        Seller seller;
        Shipment shipment;
        uint date;
        uint spPrice;
        string product;
        
        uint safepay;
        bool init;
    }
    
    struct Seller {
        address addr;
        uint price;
        uint safepay;
    }
    
    struct Shipment {
        address addr;
        uint price;
        uint safepay;
    }
    
    struct Invoice {
        uint orderno;
        uint deliveryDate;
        
        bool init;
    }
    
    mapping (uint => Order) orders;
    mapping (uint => Invoice) invoices;
    
    uint orderseq;
    uint invoiceseq;
    
    event OrderSent(uint orderno, address buyer, address sellerAddr, uint date, uint spPrice, string product, bool safepay, bool init);
    event PriceSent(address buyer, uint orderno, uint spPrice, uint sellerPrice, uint shipmentPrice);
    event InvoiceSent(address courier, address buyer, uint orderno, uint invoiceno, uint deliveryDate);
    event OrderDelivered(address buyer, address courier, uint invoiceno, uint orderno, uint timestamp);
    event SafepaySent(uint orderno, uint spSafepay, uint sellerSafepay, uint courierSafepay);
    
    function sendOrder(address sellerAddr, string product) payable public {
        orderseq++;
        address buyerAddr = msg.sender;
        orders[orderseq] = Order(buyerAddr, Seller(sellerAddr, 0, 0), Shipment(address(0), 0, 0), now, 0, product, 0, true);
        
        emit OrderSent(orderseq, buyerAddr, sellerAddr, now, 0, product, false, true);
    }
    
    function sendPrice(uint orderno, uint spPrice, uint sellerPrice, uint shipmentPrice) payable public {
        require(orders[orderno].init);
        require(orders[orderno].seller.addr == msg.sender);
        
        orders[orderno].spPrice = spPrice;
        orders[orderno].seller.price = sellerPrice;
        orders[orderno].shipment.price = shipmentPrice;
        
        emit PriceSent(orders[orderno].buyer, orderno, spPrice, sellerPrice, shipmentPrice);
    }
    
    function sendSafepay(uint orderno) payable public {
        require(orders[orderno].init);
    
        Order storage _order = orders[orderno];
        require(msg.sender == _order.buyer);
    
        require(1 finney * (_order.spPrice + _order.seller.price + _order.shipment.price) <= msg.value);
    
        orders[orderno].safepay = _order.spPrice * 1 finney;
        orders[orderno].seller.safepay = _order.seller.price * 1 finney;
        orders[orderno].shipment.safepay = _order.shipment.price * 1 finney;
        emit SafepaySent(orderno, orders[orderno].safepay, orders[orderno].seller.safepay, orders[orderno].shipment.safepay);
    }
    
    function sendInvoice(uint orderno, uint deliveryDate, address courier) payable public {
        require(orders[orderno].init);
        require(msg.sender == serviceProvider);
        
        invoiceseq++;
        
        invoices[invoiceseq] = Invoice(orderno, deliveryDate, true);
        orders[orderno].shipment.addr = courier;
        
        emit InvoiceSent(courier, orders[orderno].buyer, orderno, invoiceseq, deliveryDate);
    }
    
    function delivery(uint invoiceno) payable public {
        require(invoices[invoiceno].init);
    
        Invoice storage _invoice = invoices[invoiceno];
        Order storage _order     = orders[_invoice.orderno];
        require(msg.sender == _order.shipment.addr);
    
        emit OrderDelivered(_order.buyer, _order.shipment.addr, invoiceno, _invoice.orderno, now);

        address courier = _order.shipment.addr;
        address seller = _order.seller.addr;
        
        serviceProvider.transfer(_order.safepay);
        courier.transfer(_order.shipment.safepay);
        seller.transfer(_order.seller.safepay);
    }
}