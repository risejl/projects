// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTBots is ERC721Enumberable {
	using String for uint8;

	uint256 public tokenCounter = 1;

	string[] private headgear = [
		"Cowboy Hat",
        "Fro",
        "Baseball Cap",
        "Viking Helmet"
	];

	string[] private eargear = [
		"Bunny Ears",
        "Headphones"
	];

	string[] private facegear = [
		"Sunglasses",
        "Moustache",
        "Nose",
        "DOOM Mask"
	];

	struct Color {
		uint8 red;
		uint8 green;
		uint8 blue;
	}

	struct NFTBot {
		Color frame;
		Color visor;
		Color background;
		uint8 head;
		uint8 ears;
		uint8 face;
		uint256 generation;
		uint256 parentOneId;
		uint256 parentTwoId;
	}

	mapping(uint => NFTBot) private nftbots;

	constructor() ERC721('NFTBots', 'RBNFT') {}

	function mint(address recipient) public returns (uint256) {
		uint tokenId = tokenCounter;
		tokenCounter++;

		Color memory frameCol = Color(_meanOfTwo(parentOne.frame.red, parentTwo.frame.red),
		      _meanOfTwo(parentOne.frame.green, parentTwo.frame.green),
		      _meanOfTwo(parentOne.frame.blue, parentTwo.frame.blue));

        Color memory visorCol = Color(_meanOfTwo(parentOne.visor.red, parentTwo.visor.red),
              _meanOfTwo(parentOne.visor.green, parentTwo.visor.green),
              _meanOfTwo(parentOne.visor.blue, parentTwo.visor.blue));

        Color memory backgroundCol = Color(_meanOfTwo(parentOne.background.red, parentTwo.background.red),
		      _meanOfTwo(parentOne.background.green, parentTwo.background.green),
		      _meanOfTwo(parentOne.background.blue, parentTwo.background.blue));


		uint8 headIdx = parentOne.head;

		uint8 earIdx = parentTwo.ears;

		uint8 faceIdx = uint8(_random(tokenId, "asdfg") % facegear.length);

		nftbots[tokenId] = NFTBot(frameCol, visorCol, backgroundCol, headIdx, earIdx, faceIdx, parentOne.generation + 1, parentOneId, parentTwoId);

		_safeMint(recipient, tokenId);
		emit NFTBotCreated(recipient, tokenId);
		return tokenId;
	}

	function breed(uint256 parentOneId, uint256 parentTwoId, address recipient) public returns (uint256) {
		// Require two parents
        require(parentOneId != parentTwoId, "ReplBots: Parents must be separate bots");
        // Check ownership
        require(ownerOf(parentOneId) == msg.sender, "ReplBots: You don't own parent 1");
        require(ownerOf(parentTwoId) == msg.sender, "ReplBots: You don't own parent 2");
        
        ReplBot storage parentOne = replbots[parentOneId];
        ReplBot storage parentTwo = replbots[parentTwoId];

        // Check age
        require(parentOne.generation == parentTwo.generation, "ReplBots: Parents must belong to the same generation");

                // Increment token counter
        uint tokenId = tokenCounter;
        tokenCounter++;

        // Interpolate colors
        Color memory frameCol = Color(_meanOfTwo(parentOne.frame.red, parentTwo.frame.red),
                                      _meanOfTwo(parentOne.frame.green, parentTwo.frame.green),
                                      _meanOfTwo(parentOne.frame.blue, parentTwo.frame.blue));

        Color memory visorCol = Color(_meanOfTwo(parentOne.visor.red, parentTwo.visor.red),
                                      _meanOfTwo(parentOne.visor.green, parentTwo.visor.green),
                                      _meanOfTwo(parentOne.visor.blue, parentTwo.visor.blue));

        Color memory backgroundCol = Color(_meanOfTwo(parentOne.background.red, parentTwo.background.red),
                                      _meanOfTwo(parentOne.background.green, parentTwo.background.green),
                                      _meanOfTwo(parentOne.background.blue, parentTwo.background.blue));

        uint8 headIdx = parentOne.head;
        uint8 earIdx = parentTwo.ears;
        uint8 faceIdx = uint8(_random(tokenId, "asdfg") % facegear.length);

        replbots[tokenId] = ReplBot(frameCol, visorCol, backgroundCol, headIdx, earIdx, faceIdx, parentOne.generation + 1, parentOneId, parentTwoId);          

        _safeMint(recipient, tokenId);

        emit ReplBotBorn(recipient, tokenId, parentOneId, parentTwoId, parentOne.generation + 1);
        
        return tokenId;
	}

	function _random(uint tokenId, string memory input) internal view returns (uint256) {
		bytes32 blckhash = blockhash(block.number - 1);
		return uint256(keccak256(abi.encodePacked(block.difficulty, blckhash, tokenId, abi.encodePacked(input))));
	}

	function _meadOfTwo(uint8 first, uint8 second) internal pure returns (uint8) {
		return uint8((uint16(first) + uint16(second)) / 2);
	}

	function botAccessories(uint256 tokenId) public view returns (string memory, string memory, string memory) {
		require(_exists(tokenId), 'NFTBots: Query for nonexistent token');
		NFTBot memory bot = nftbots[tokenId];
		return (headgear[bot.head], eargear[bot.ears], facegear[bot.face]);
	}

	function botColors(uint256 tokenId) public view returns (string memory, string memory, string memory) {
		require(_exists(tokenId), 'NFTBots: Query for nonexistent token');
		NFTBot memory bot = nftbots[tokenId];
		return (_colorToString(bot.frame),
		_colorToString(bot.visor),
		_colorToString(bot.background));
	}

	function botPercentage(uint256 tokenId) public view returns (uint, uint, uint) {
		require(_exists(tokenId), 'NFTBot: Query for nonexistent token');

		NFTBot memory bot = nftbots[tokenId];

		return (bot.generation, bot.parentOneId, bot.parentTwoId);
	}

	function _colorToString(Color memory color) internal pure returns (string memory) {
		string[7] memory parts;
		part = ["(",
			color.red.toString(),
			",",
			color.green.toString(),
			",",
			color.blue.toString(),
			")"];
		]
		return string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
	}

	event NFTBotCreated(address repicient, uint tokenId);
	event NFTBotBorn(address recipient, uint tokenId, uint parentOneId, uint parentTwoId, uint generation);

}