export const VINTED_CONTRACT_ADDRESS = '0x1a2412DeE56C1FA2CAA1096dC23d4aB03325f617';

export const VINTED_LIST_ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "orderno",
				"type": "uint256"
			},
			{
				"name": "spPrice",
				"type": "uint256"
			},
			{
				"name": "sellerPrice",
				"type": "uint256"
			},
			{
				"name": "shipmentPrice",
				"type": "uint256"
			}
		],
		"name": "sendPrice",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "invoiceno",
				"type": "uint256"
			}
		],
		"name": "delivery",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "sellerAddr",
				"type": "address"
			},
			{
				"name": "product",
				"type": "string"
			}
		],
		"name": "sendOrder",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "orderno",
				"type": "uint256"
			},
			{
				"name": "deliveryDate",
				"type": "uint256"
			},
			{
				"name": "courier",
				"type": "address"
			}
		],
		"name": "sendInvoice",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "orderno",
				"type": "uint256"
			}
		],
		"name": "sendSafepay",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "orderno",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "sellerAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "spPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "product",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "safepay",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "init",
				"type": "bool"
			}
		],
		"name": "OrderSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "orderno",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "spPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "sellerPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "shipmentPrice",
				"type": "uint256"
			}
		],
		"name": "PriceSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "courier",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "orderno",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "invoiceno",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "deliveryDate",
				"type": "uint256"
			}
		],
		"name": "InvoiceSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "courier",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "invoiceno",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "orderno",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "OrderDelivered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "orderno",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "spSafepay",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "sellerSafepay",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "courierSafepay",
				"type": "uint256"
			}
		],
		"name": "SafepaySent",
		"type": "event"
	}
];