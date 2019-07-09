pragma solidity >=0.4.21 <0.6.0;

contract Token {
    mapping (address=>uint256) public balanceOf;

    constructor (uint256 initialSupply) public {
        balanceOf[tx.origin] = initialSupply;
    }

    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }

    function getBalance(address addr) public view returns(uint256) {
        return balanceOf[addr];
    }
}