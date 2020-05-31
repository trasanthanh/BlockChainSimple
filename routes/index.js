var express = require("express");
var router = express.Router();
const EC = require("elliptic").ec;
const ecdsa = new EC("secp256k1");
var middleware = require("../helpers/middleware");
var wallet = new (require("../models/wallet"))();
var transaction = require("../models/transaction");

/* GET home page. */
router.get("/", middleware.isLogged, function (req, res, next) {
	let balance = blockChain.getBalanceOfAddress(req.user.publicKey),
		transactions = blockChain.getTransactionOfAddress(req.user.publicKey);
 	res.render("index", {isLogin: 1, balance : balance, address: req.user.publicKey, privateKey:req.user.privateKey, transactions : transactions });
});

router.get("/login", function (req, res, next) {
  	res.render("login", { error : req.query.error});
});
router.get("/signup-success", function (req, res, next) {
	res.render("signup-success", {isLogin:1});
});

router.post("/login", function (req, res, next) {
	if (req.body.privateKey.length == 64) {
		res.cookie(
		"userInfo",
		{
			socketId: req.body.socketId,
			publicKey: req.body.privateKey,
			privateKey: ecdsa.keyFromPrivate(req.body.privateKey).getPublic(),
		},
		{ maxAge: 2147483647, httpOnly: true }
		);
		return res.redirect("/");
	}
	res.redirect("/login?error=1");
});

router.get("/logout", function (req, res, next) {
  res.clearCookie("userInfo");
  res.redirect("/login");
});

router.post("/create-wallet", (req, res) => {
	var newWallet = wallet.genenatorNewWallet();
		blockChain.joinChain(newWallet.publicKey);
		blockChain.minePendingTransactions(newWallet.publicKey);
	res.cookie(
		"userInfo",
		{
		socketId: req.body.socketId,
		publicKey: newWallet.publicKey,
		privateKey: newWallet.privateKey,
		},
		{ maxAge: 2147483647, httpOnly: true }
	);
	res.attachment("secretfile" + Date.now() + ".txt");
	res.type("txt");
	res.send(newWallet);
	io.to(req.body.socketId).emit("registerSuccess");
});
router.get("/create-wallet", (req, res) => {
	res.render('signup');
});

module.exports = router;
