pragma solidity >=0.4.21 <0.7.0;

contract Vinted {
    address payable serviceProvider;

    constructor() public payable {
        serviceProvider = msg.sender;
    }
    
    struct Order {
        address payable buyer;
        Seller seller;
        Shipment shipment;
        uint date;
        uint spPrice;
        string product;
        
        uint safepay;
        bool init;
    }
    
    struct Seller {
        address payable addr;
        uint price;
        uint safepay;
    }
    
    struct Shipment {
        address payable addr;
        uint price;
        uint safepay;
    }
    
    struct Invoice {
        uint orderno;
        uint deliveryDate;
        bool delivered;
        
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
    
    function getOrdersCount() public view returns(uint) {
        return orderseq;
    }
    
    function getOrder(uint index) public view returns(uint, address, address, address, uint, string memory) {
        return (index, orders[index].buyer, orders[index].seller.addr, orders[index].shipment.addr, orders[index].date, orders[index].product);
    }
    
    function getInvoicesCount() public view returns(uint) {
        return invoiceseq;
    }
    
    function getInvoice(uint index) public view returns(uint, uint, address, bool) {
        return (index, invoices[index].orderno, orders[invoices[index].orderno].shipment.addr, invoices[index].delivered);
    }
    
    function sendOrder(address payable sellerAddr, string memory product) payable public {
        orderseq++;
        address payable buyerAddr = msg.sender;
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
    
        orders[orderno].safepay = _order.spPrice * 1 ether;
        orders[orderno].seller.safepay = _order.seller.price * 1 ether;
        orders[orderno].shipment.safepay = _order.shipment.price * 1 ether;
        emit SafepaySent(orderno, orders[orderno].safepay, orders[orderno].seller.safepay, orders[orderno].shipment.safepay);
    }
    
    function sendInvoice(uint orderno, uint deliveryDate, address payable courier) payable public {
        require(orders[orderno].init);
        address payable seller = orders[orderno].seller.addr;
        require(msg.sender == seller);
        
        invoiceseq++;
        
        invoices[invoiceseq] = Invoice(orderno, deliveryDate, false, true);
        orders[orderno].shipment.addr = courier;
        
        emit InvoiceSent(courier, orders[orderno].buyer, orderno, invoiceseq, deliveryDate);
    }
    
    function delivery(uint invoiceno) external payable {
        require(invoices[invoiceno].init);
    
        Invoice storage _invoice = invoices[invoiceno];
        _invoice.delivered = true;
        Order storage _order     = orders[_invoice.orderno];
        require(msg.sender == _order.shipment.addr);
    
        emit OrderDelivered(_order.buyer, _order.shipment.addr, invoiceno, _invoice.orderno, now);

        address payable courier = _order.shipment.addr;
        address payable seller = _order.seller.addr;
        
        serviceProvider.transfer(_order.safepay);
        courier.transfer(_order.shipment.safepay);
        seller.transfer(_order.seller.safepay);
    }
}