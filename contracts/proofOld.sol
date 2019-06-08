pragma solidity ^0.4.2;
contract Proof {
    struct FileDetails{
        uint timestamp;
        string owner;
    }

    mapping (string=>FileDetails) files;

    event logFileAddedStatus(bool status, uint timestamp, string owner, string fileHash);

    function set(string owner, string fileHash) {
        if(files[fileHash].timestamp == 0){
            files[fileHash] = FileDetails(block.timestamp,owner);

            logFileAddedStatus(true,block.timestamp,owner,fileHash);
        }
        else{
            logFileAddedStatus(false,block.timestamp,owner,fileHash);
        }
    }

    function get(string  fileHash) view returns (uint timestamp, string memory owner)  {
        return (files[fileHash].timestamp,files[fileHash].owner);
    }

}