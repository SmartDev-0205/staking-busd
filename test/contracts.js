const { expect } = require("chai");
const fs = require("fs");
const { ethers } = require("hardhat");

const { delay, fromBigNum, toBigNum } = require("./utils.js");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

var owner, addr1, addr2;
var tokenContract, stakingContract;

describe("deploy contracts", function () {
  it("Create account", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("This is owner address : ", owner.address);
    console.log("This is add1 address : ", addr1.address);
    console.log("This is add2 address : ", addr2.address);
    var tx = await owner.sendTransaction({
      to: addr1.address,
      value: toBigNum("100", 18),
    });
    await tx.wait();

    var tx = await owner.sendTransaction({
      to: addr2.address,
      value: toBigNum("100", 18),
    });
    await tx.wait();
  });

  it("deploy contracts", async function () {
    const ERC20TOKEN = await ethers.getContractFactory("ERC20");
    tokenContract = await ERC20TOKEN.deploy("KMT Token", "KMT");
    await tokenContract.deployed();
    console.log("token address", tokenContract.address);

    const Staking = await ethers.getContractFactory("Staking");
    stakingContract = await Staking.deploy();
    await tokenContract.deployed();
    var tx = await tokenContract.transfer(addr1.address, toBigNum("100", 18));
    await tx.wait();


    var tx = await tokenContract.transfer(addr2.address, toBigNum("100", 18));
    await tx.wait();
  });

  it("Contract initialize", async function () {
    var tx = await stakingContract.add(tokenContract.address, tokenContract.address, 50, 15);
    await tx.wait();

    var tx = await stakingContract.add(tokenContract.address, tokenContract.address, 75, 30);
    await tx.wait();

    var tx = await stakingContract.add(tokenContract.address, tokenContract.address, 100, 60);
    await tx.wait();

    var tx = await tokenContract.approve(stakingContract.address, toBigNum("100", 18));
    await tx.wait();

    var tx = await stakingContract.depositForReward(toBigNum("100", 18));
    await tx.wait();
  });

});

describe("Contract Test", function () {
  it("Deposit first plan", async function () {
    var tx = await tokenContract.approve(stakingContract.address, toBigNum("10", 18));
    await tx.wait();
    var tx = await stakingContract.deposit(0, toBigNum("10", 18));
    await tx.wait();
  });

  it("Deposit second plan", async function () {
    var tx = await tokenContract.approve(stakingContract.address, toBigNum("10", 18));
    await tx.wait();
    var tx = await stakingContract.deposit(1, toBigNum("10", 18));
    await tx.wait();
  });

  it("Deposit third plan", async function () {
    var tx = await tokenContract.approve(stakingContract.address, toBigNum("10", 18));
    await tx.wait();
    var tx = await stakingContract.deposit(2, toBigNum("10", 18));
    await tx.wait();
  });
});