//artifacts looks for file tasksContract for testing
const tasksContract = artifacts.require("tasksContract");

contract("tasksContract", (accounts) => {
  before(async () => {
    this.tasksContract = await tasksContract.deployed();
  });

  it("Migrate deployed sucessfully", async () => {
    const address = await this.tasksContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0); //no binary
    assert.notEqual(address, "");
  });

  it("Get default tasks list", async () => {
    const tasksCounter = await this.tasksContract.tasksCounter();
    const task = await this.tasksContract.tasks(tasksCounter);

    assert.equal(task.id.toNumber(), tasksCounter);
    assert.notEqual(task.title, "");
    assert.notEqual(task.desc, "");
    assert.equal(task.done, false);
    assert.equal(tasksCounter, 1);
  });

  it("Task created successfully", async () => {
    const result = await this.tasksContract.createTask(
      "title sample",
      "desc sample"
    );
    const taskEvent = await result.logs[0].args;
    const tasksCounter = await this.tasksContract.tasksCounter();
    
    assert.equal(tasksCounter, 2);
    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.title, "title sample");
    assert.equal(taskEvent.desc, "desc sample");
    assert.equal(taskEvent.done, false);
  });

  it("Task toggle done", async () => {
    const result = await this.tasksContract.toggleDone(1);
    const taskEvent = await result.logs[0].args;
    const task = await this.tasksContract.tasks(1)

    assert.equal(task.done, true);
    assert.equal(taskEvent.done, true);
    assert.equal(taskEvent.id, 1);
  })
});
