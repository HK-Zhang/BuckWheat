var express = require("express");
var Tx = require('ethereumjs-tx')
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(8080);

app.use(express.static("public"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/html/index.html");
})

var Web3 = require("web3");

web3 = new Web3("https://rinkeby.infura.io/v3/api key");

const account = "0x3703D1ac42a1d5f96CB5a6872e91E881B2a091F0";
const privateKey = Buffer.from('private key', 'hex');
var contract = new web3.eth.Contract([
	{
		"constant": true,
		"inputs": [
			{
				"name": "fileHash",
				"type": "string"
			}
		],
		"name": "get",
		"outputs": [
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "owner",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "owner",
				"type": "string"
			},
			{
				"name": "fileHash",
				"type": "string"
			}
		],
		"name": "set",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "status",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "owner",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "fileHash",
				"type": "string"
			}
		],
		"name": "logFileAddedStatus",
		"type": "event"
	}
], "0x7fde5333cccded60aba6e80dc5f00bdc325b2a0f");
// var proof = proofContract.at("0xf09d583e3ee04588a3e60b9a2a4ef4df39d84303");

// app.get("/submit", function (req, res) {
// 	var fileHash = req.query.hash;
// 	var owner = req.query.owner;

// 	proof.methods.set.sendTransaction(owner, fileHash, {
// 		from: web3.eth.accounts.privateKeyToAccount('replace with privateKey'),
// 	}, function (error, transactionHash) {
// 		if (!error) {
// 			res.send(transactionHash);
// 		}
// 		else {
// 			res.send("Error");
// 		}
// 	})
// })


app.get("/submit", function (req, res) {
	var fileHash = req.query.hash;
	var owner = req.query.owner;

	// var account = web3.eth.accounts.privateKeyToAccount('replace with privateKey');

	web3.eth.getTransactionCount(account, (err, txCount) => {

		console.log(err);
		console.log(txCount);

		const txObject = {
			nonce: web3.utils.toHex(txCount),
			gasLimit: web3.utils.toHex(800000), // Raise the gas limit to a much higher amount
			gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
			to: "0x7fde5333cccded60aba6e80dc5f00bdc325b2a0f",
			data: contract.methods.set(owner, fileHash).encodeABI()
		}

		const tx = new Tx(txObject)
		tx.sign(privateKey)

		const serializedTx = tx.serialize()
		const raw = '0x' + serializedTx.toString('hex')

		web3.eth.sendSignedTransaction(raw, (err, txHash) => {
			console.log('err:', err, 'txHash:', txHash)
			// Use this txHash to find the contract on Etherscan!
			if (!err) {
				res.send(txHash);
			}
			else {
				res.send("Error");
			}

		})

		if (err) {
			res.send("Error");
		}
	})

})






app.get("/getInfo", function (req, res) {
	var fileHash = req.query.hash;

	// var details = contract.get.call(fileHash);

	contract.methods.get(fileHash).call({ from: account }, (err, result) => {
		if (!err) {
			// console.log(result);
			res.send(result);
		}
		else {
			console.log("Error");
		}

	}
	);

	// res.send(details);
})

// proof.methods.logFileAddedStatus().watch(function (error, result) {
// 	if (!error) {
// 		if (result.args.status == true) {
// 			io.send(result);
// 		}
// 	}
// })

// https://ethereum.stackexchange.com/questions/25451/infura-web3-provider-for-events-get-watch
//Infura currently doesn't support WebSockets (required for events using Web3 v1, otherwise you get the error 
//"The current provider doesn't support subscriptions" when using infura as HttpProvider), 
//so what you have to do is run a local geth node that connects and syncs to the network.
// contract.events.logFileAddedStatus({fromBlock: 0},(error, result) => {
// 	if (!error) {
// 		console.log(result); 
// 		if (result.returnValues.status == true) {
// 			io.send(result.returnValues);
// 		}
// 	}
// 	else {
// 		console.log("Error");
// 	}
// }).on('data', (event) => {
//     console.log(event); // same results as the optional callback above
// })
// .on('changed', (event) => {
//     // remove event from local database
// })
// .on('error', console.error);


contract.events.logFileAddedStatus({fromBlock: 0},(error, result) => {
	if (!error) {
		console.log(result); 
		if (result.returnValues.status == true) {
			io.send(result.returnValues);
		}
	}
	else {
		console.log("Error");
	}
});

// contract.getPastEvents(
// 	'logFileAddedStatus',
// 	{
// 	  fromBlock: 0,
// 	  toBlock: 'latest'
// 	},
// 	(err, events) => { console.log(events) }
//   )