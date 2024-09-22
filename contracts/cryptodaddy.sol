// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract  CryptoDaddy is ERC721{
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public maxSupply;
    uint256 public totalSupply;
    address payable public owner;

    constructor(string memory _name, string memory _symbol) ERC721(_name,_symbol) {
        owner = payable(msg.sender);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only Owner can call this function");
        _;
    }

    struct Domain {
        string name;
        uint256 cost;
        bool isAvailable;
    }

    mapping (uint256 => Domain) domain;

    function list(string memory _name, uint256 _cost) public onlyOwner{
        require(maxSupply <= MAX_SUPPLY, "You cant list more domains!");
        maxSupply++;
        domain[maxSupply] = Domain(_name, _cost, false);
    }

    function mint(uint256 _id) public payable {
        require(_id != 0 && _id <= maxSupply);
        require(domain[_id].isAvailable == false);
        require(msg.value >= domain[_id].cost);
        require(totalSupply < MAX_SUPPLY);

        totalSupply++;

        domain[_id].isAvailable = true;
        _safeMint(msg.sender, _id);       
    }

    function getDomain(uint256 _id) public view returns(Domain memory){
        return domain[_id];
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner{
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }
}