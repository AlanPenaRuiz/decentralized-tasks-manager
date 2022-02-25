// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract tasksContract {
    uint256 public tasksCounter = 0;

    struct task {
        uint256 id;
        string title;
        string desc;
        bool done;
        uint256 createdAT;
    }

    //Data Return
    event taskCreated(
        uint256 id,
        string title,
        string desc,
        bool done,
        uint256 createdAt
    );

    event taskToggleDone(uint256 id, bool done);

    mapping(uint256 => task) public tasks;

    constructor() {
        createTask("First task", "First desc");
    }

    function createTask (string memory _title, string memory _desc) public {
        tasksCounter++;
        tasks[tasksCounter] = task(
            tasksCounter,
            _title,
            _desc,
            false,
            block.timestamp
        );
        emit taskCreated(tasksCounter, _title, _desc, false, block.timestamp);
    }

    function toggleDone(uint256 _id) public {
        task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit taskToggleDone(_id, _task.done);
    }
}
