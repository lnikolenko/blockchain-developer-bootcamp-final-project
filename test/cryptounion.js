let BN = web3.utils.BN;
const CryptoUnion = artifacts.require("./CryptoUnion.sol");

contract("CryptoUnion", (accounts) => {
  const [contractOwner, abc, alice] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  const countryCode = "ABC";
  const amount = 0.3e18;
  //const deposit = web3.utils.toBN(2);

  beforeEach(async () => {
    instance = await CryptoUnion.new();
  });
  it("is owned by the owner", async () => {
    assert.equal(
      await instance.owner.call(),
      contractOwner,
      "owner is not correct"
    );
  });

  it("updates updates country code -> address mapping and emits an event", async () => {
    let eventEmitted = false;
    const countryAddressBefore = await instance.getAddress(countryCode);
    assert.equal(
      countryAddressBefore,
      emptyAddress,
      "country code -> address mapping was not initialized properly"
    );

    const tx = await instance.setAddress(countryCode, abc, {
      from: contractOwner,
    });
    const countryAddressAfter = await instance.getAddress(countryCode);
    assert.equal(
      countryAddressAfter,
      abc,
      "country code -> address mapping was not updated"
    );

    if (tx.logs[0].event == "LogCountryAddressUpdated") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "adding an item should emit a LogCountryAddressUpdated event"
    );
  });

  it("only an owner can update country code -> address mapping", async () => {
    try {
      await instance.setAddress(countryCode, emptyAddress, {
        from: alice,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("caller is not the owner"),
        "Needs to fail because owner is requred"
      );
    }
  });

  it("cannot send ETH if the country is not set", async () => {
    try {
      await instance.sendEthToCountry(countryCode, {
        from: alice,
        value: amount,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("Invalid address"),
        "Needs to fail because the address is invalid"
      );
    }
  });

  it("sends ETH to country and withdraws money to the users account", async () => {
    const minValue = await instance.getMinValue();
    let transferCount = await instance.getTransferCount();
    assert.equal(0, transferCount, "Transfer count should be 0");

    const aliceBalanceBefore = await web3.eth.getBalance(alice);
    const abcBalanceBefore = await web3.eth.getBalance(abc);
    await instance.setAddress(countryCode, abc, {
      from: contractOwner,
    });

    const tx = await instance.sendEthToCountry(countryCode, {
      from: alice,
      value: amount,
    });

    const eventEmitted = tx.logs[0].event == "LogTransferSent";
    assert.ok(
      eventEmitted,
      "adding an item should emit a LogTransferSent event"
    );

    const aliceBalanceAfter = await web3.eth.getBalance(alice);
    const abcBalanceAfter = await web3.eth.getBalance(abc);

    assert.equal(
      new BN(abcBalanceAfter).toString(),
      new BN(abcBalanceBefore)
        .add(new BN(amount.toString()))
        .sub(new BN(minValue))
        .toString(),
      "country's balance should be increased by the (amount - minValue) comission"
    );

    assert.isBelow(
      Number(aliceBalanceAfter),
      Number(new BN(aliceBalanceBefore).sub(new BN(amount.toString()))),
      "alice's balance should be reduced by more than the amount sent (including gas costs)"
    );

    transferCount = await instance.getTransferCount();
    assert.equal(1, transferCount, "Transfer count should be 1");

    const transfer = await instance.getTransfer(transferCount - 1);
    assert.equal("0", transfer[0].toString(), "transferId should be 0");
    assert.equal(
      alice.toString(),
      transfer[1].toString(),
      "from should be alice's address"
    );
    assert.equal(countryCode, transfer[2].toString(), "to should be ABC");
    assert.equal(
      CryptoUnion.Status.Sent,
      transfer[3].toString(),
      "status should be Sent"
    );
    assert.equal(
      new BN(amount.toString()).sub(new BN(minValue)).toString(),
      transfer[4].toString(),
      "amount should equal (amount - minVaue)"
    );
    assert.equal(
      new BN(minValue.toString()),
      transfer[5].toString(),
      "amount should equal minVaue"
    );

    try {
      await instance.setAddress(countryCode, emptyAddress, {
        from: contractOwner,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("unconfirmed transfers"),
        "Should not update county address if there unconfirmed transfers at this address"
      );
    }

    const contractBalanceBefore = await web3.eth.getBalance(instance.address);
    const ownerBalanceBefore = await web3.eth.getBalance(contractOwner);
    assert.equal(
      new BN(minValue.toString()),
      contractBalanceBefore,
      "contract's balance should equal minValue"
    );
    try {
      await instance.withdraw({ from: alice });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("caller is not the owner"),
        "Needs to fail because owner is required"
      );
    }
    await instance.withdraw({ from: contractOwner });
    const contractBalanceAfter = await web3.eth.getBalance(instance.address);
    const ownerBalanceAfter = await web3.eth.getBalance(contractOwner);

    assert.equal(
      new BN("0"),
      contractBalanceAfter,
      "contract's balance should be 0 after withdrawal"
    );
    assert.isBelow(
      Number(ownerBalanceBefore),
      Number(ownerBalanceAfter),
      "owner's balance should increase"
    );
  });

  it("completes transfer", async () => {
    await instance.setAddress(countryCode, abc, {
      from: contractOwner,
    });
    await instance.sendEthToCountry(countryCode, {
      from: alice,
      value: amount,
    });

    await instance.confirmTransfer(0, { from: contractOwner });
    const transfer = await instance.getTransfer(0);
    assert.equal(
      CryptoUnion.Status.Confirmed,
      transfer[3].toString(),
      "status should be Confirmed"
    );

    try {
      await instance.confirmTransfer(0, { from: contractOwner });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("already confirmed"),
        "Should not confirm aleady confirmed transfers"
      );
    }

    await instance.setAddress(countryCode, emptyAddress, {
      from: contractOwner,
    });
    const countryAddressAfter = await instance.getAddress(countryCode);
    assert.equal(
      emptyAddress,
      countryAddressAfter,
      "country address should be updated as there are no pending transactions"
    );
  });

  it("does not let new 'write' functions go through if the contract is paused", async () => {
    await instance.pause({
      from: contractOwner,
    });
    let paused = await instance.paused({
      from: contractOwner,
    });
    assert.ok(paused, "Contract should be paused");
    try {
      await instance.setAddress(countryCode, emptyAddress, {
        from: contractOwner,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("Pausable: paused"),
        "Needs to fail because the contract is paused"
      );
    }
    await instance.unpause({
      from: contractOwner,
    });
    paused = await instance.paused({
      from: contractOwner,
    });
    assert.ok(!paused, "Contract should be unpaused");
    await instance.setAddress(countryCode, emptyAddress, {
      from: contractOwner,
    });
  });

  it("does not let the user pause/unpause twice", async () => {
    await instance.pause({
      from: contractOwner,
    });
    try {
      await instance.pause({
        from: contractOwner,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("Pausable: paused"),
        "Needs to fail because the contract is paused"
      );
    }
    await instance.unpause({
      from: contractOwner,
    });
    try {
      await instance.unpause({
        from: contractOwner,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("Pausable: not paused"),
        "Needs to fail because the contract is not paused"
      );
    }
  });

  it("does not let the non-owner pause/unpause", async () => {
    try {
      await instance.pause({
        from: alice,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("caller is not the owner"),
        "Needs to fail because owner is requred"
      );
    }

    try {
      await instance.unpause({
        from: alice,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("caller is not the owner"),
        "Needs to fail because owner is requred"
      );
    }
  });
});
