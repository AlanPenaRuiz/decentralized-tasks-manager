const tasksContract = artifacts.require("tasksContract");

module.exports = function (deployer) {
  deployer.deploy(tasksContract);
};
