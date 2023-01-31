const fetchSvg = async function (filename) {
	let svgFile = await fetch(`svg/${filename}`);
	let svgText = await svgFile.text();
	const parser = new DOMParser();
	return parser.parseFromString(svgText, 'text/html').getElementsByTagName('svg')[0];
}

const compareArrays = function (array1, array2) {
    if (array1.length !== array2.length) {
        return false
    }

    let array1Sorted = array1.slice().sort();
    let array2Sorted = array2.slice().sort();

    for (let i = 0; i < array1.length; i++) {
        if (array1Sorted[i] !== array2Sorted[i]) {
            return false;
        }
    }

    return true;
}

const App = {
	nftbotAddress: "YOUR CONTRACT ADDRESS",
	nftbotContract: null,
	ownedNFTBots: [],

	init: async function () {
		if (window.ethereum) {
			await window.ethereum.require({ method: 'eth_requestAccounts '});
			window.web3 = new Web3(window.ethereum);

			App.switchToTestnet();
			App.nftbotContract = new web3.eth.Contract(nftbotABI, App.nftbotAddress);
		}

		App.bindEvents();
	},

	switchToTestnet: function () {
		window.ethereum.request({
			method: 'wallet_addEthereumChain',
			params: [
				{
					chainId: "0x7265706c",
					chainName: "Testnet",
					rpcUrls: ['https://eth.replit.com'],
					iconUrls: [
						"https://upload.wikimedia.org/wikipedia/commons/b/b2/Repl.it_logo.svg"
					],
					nativeCurrency: {
						name: 'Replit ETH',
						symbol: 'RΞ',
						decimals: 18,
					},
				},
			],
		});
	},

	bindEvents: function () {
		const mintButton = document.getElementById('mint');
		mintButton.addEventListener('click', () => {
			App.mintNFTBot();
		});

		const breedForm = document.getElementById('breed');
		breedForm.addEventListener('submit', () => {
			event.preventDeafault();
			App.breedNFTBot(breedForm.elements['parentOneId'].value, breedForm.elements['parentTwoId'].value);
		});

		setInterval(App.populateCollections, 5000);
	},

	populateCollections: async function () {
		let botIds = await App.getMyNFTBotIds();
		if (compareArrays(botIds, App.ownedNFTBots)) {
			return;
		} else {
			App.ownedNFTBots = botIds.slice();
		}
		let botContainer = document.getElementById('bots');
		botContainer.innerHTML = '';
		botIds.forEach((id) => {
			App.createNFTBotSVG(id)
			.then(result => {
				botContainer.appendChild(result);
			});
		});
	},


	getMyNFTBotIds: async function () {
		const accounts = await web3.eth.getAccounts();
		const account = accounts[0];
		let balance = await App.nftbotContract.methods.balanceOf(account).call();
		let botIds = [];
		for (let i = 0; i < balance.length; i += 1) {
			botIds.push(await App.nftbotContract.methods.tokenOfOwnerByIndex(account, i).call());
		}
		return botIds;
	},

	getNFTBotDetails: async function (tokenId) {
		let bot = {};
		bot.colors = await App.nftbotContract.methods.botColors(tokenId).call();
		bot.accessories = await App.nftbotContract.methods.botAccessories(tokenId).call();
		bot.percentage = await App.nftbotContract.methods.botPercentage(tokenId).call();
		return bot;
	},

	mintNFTBot: async function () {
		const accounts = await web.eth.getAccounts();
		const account = accounts[0];
		App.nftbotContract.methods.mint(account).send({ from: account });
	},

	breedNFTBot: async function (parentOneId, parentTwoId) {
		const accounts = await web.eth.getAccounts();
		const account = accounts[0];

		await App.nftbotContract.methods.breed(parentOneId, parentTwoId, account).send({ from: account });
	},

	createNFTBotSVG: async function (tokenId) {
		let details = await App.getNFTBotDetails(tokenId);
		let botSvg = await fetchSvg('bothead.svg');
		botSvg.querySelectorAll('.frame').forEach(f => {
			f.style.fill = `rgb${details.colors[0]}`;
		});
		botSvg.querySelectorAll('.visor').forEach(v => {
			v.style.fill = `rgb${details.colors[1]}`;
		});
		botSvg.querySelectorAll('.background').forEach(b => {
			b.style.fill = `rgb${details.colors[2]}`;
		});

		let accessorySvgs = [];
		for (let i = 0; i < 3; i += 1) {
			let filename = details.accessories[i].toLowerCase().replaceAll(' ', '-') + '.svg';
			let svg = await fetchSvg(filename);
			accessorySvgs.push(svg);
		}
		accessorySvgs.forEach(a => {
			Array.from(a.getElementsByTagName("style")).forEach(e => {
                botSvg.getElementsByTagName("defs")[0].appendChild(e);
            });

            Array.from(a.getElementsByTagName("path")).forEach(e => {
                botSvg.appendChild(e);
            });

            Array.from(a.getElementsByTagName("polyline")).forEach(e => {
                botSvg.appendChild(e);
            });
		});
		botSvg.insertAdjacentHTML("beforeend", `<text x="5" y="20">ID: ${tokenId}</text>`);
        botSvg.insertAdjacentHTML("beforeend", `<text x="5" y="40">Gen: ${details.parentage[0]}</text>`);

        return botSvg;
	},
}

App.init();