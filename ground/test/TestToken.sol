pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Token.sol";

contract TestToken {

    function testInitialBalanceUsingDeployedContract() public {
        Token token = Token(DeployedAddresses.Token());
        uint256 expected = 10000;
        Assert.equal(token.getBalance(tx.origin),expected,"Owner should have 10000 token initially");
    }

        function testInitialBalanceWithNewToken() public {
        Token token = new Token(10000);
        uint256 expected = 10000;
        Assert.equal(token.getBalance(tx.origin),expected,"Owner should have 10000 token initially");
    }

}