App = {
  contracts: {},
  async init (){
    await this.loadEthereum();
    await this.loadContracts();
    await this.loadAccount();
    this.render();
    await this.renderTasks();
  },

  //Wallet
  loadEthereum: async () => {
    if (window.ethereum) {
      console.log("Ethereum wallet exist");
      //Connect wallet
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      console.log("Ethereum not found");
    }
  },

  loadContracts: async () => {
    const res = await fetch("tasksContract.json");
    const tasksContractJSON = await res.json();
    //console.log(tasksContractJSON)

    //Deploy contract
    App.contracts.tasksContract = TruffleContract(tasksContractJSON);
    //Connect contract to wallet
    App.contracts.tasksContract.setProvider(App.web3Provider);
    //Contract deployed ready to use functions
    App.tasksContract = await App.contracts.tasksContract.deployed();
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    //console.log(accounts)
    App.account = accounts[0];
  },

  render: () => {
    document.getElementById('account').innerText = App.account
    //console.log(App.account)
  },

  renderTasks: async () => {
    const counter = await App.tasksContract.tasksCounter()
    const taskCounter = counter.toNumber()
    //console.log(taskCounter)

    let html = "";

    for (let i = 1; i <= taskCounter; i++) {
      const task = await App.tasksContract.tasks(i);
      const taskId = task[0].toNumber();
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskCreatedAt = task[4];

      // Creating a task Card
      let taskElement = `<div class="card bg-dark rounded-0 mb-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="check">${taskTitle}</span>
          <div class="form-check form-switch">
            <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${
              taskDone === true && "checked"
            }>
          </div>
        </div>
        <div class="card-body">
          <span>${taskDescription}</span>
          <p class="text-muted">Task was created ${new Date(
            taskCreatedAt * 1000
          ).toLocaleString()}</p>
          </label>
        </div>
      </div>`;
      html += taskElement;
    }

    document.querySelector("#tasksList").innerHTML = html;
  },

  createTask: async (title, desc) => {
    try {
      const result = await App.tasksContract.createTask(title, desc, {
        from: App.account,
      });
      console.log(result.logs[0].args);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },

  toggleDone: async (element) => {
    const taskId = element.dataset.id

    await App.tasksContract.toggleDone(taskId, {
      from: App.account
    })

    window.location.reload();
  }
};

App.init();
