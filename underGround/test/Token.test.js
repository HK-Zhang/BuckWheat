const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/Token");

let accounts, token;
const INITIAL_SUPPLY = 100;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    token = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: [INITIAL_SUPPLY]
        })
        .send({ from: accounts[0], gas: 1000000 });
});

