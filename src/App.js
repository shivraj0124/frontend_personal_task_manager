import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
function App() {
  const [open, setOpen] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState("");
  const [taskIdToUpdate, setTaskIdToUpdate] = useState();
  const [saveBtn, setSaveBtn] = useState(false);
  const [taskToRead, setTaskToRead] = useState("");
  const handleRead = (task) => {
    setTaskToRead(task);
    setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
  };

  const addTask = async () => {
    let item;
    if (typeof task === "string") {
      item = task;
      item = item.trim();
    }

    if (item.length === 0) {
      toast.error("Please Enter the Task");
    } else {
      const data = {
        task: task,
        status: 0,
      };
      try {
        const response = await axios.post(
          "http://localhost:5000/api/add-task",
          data
        );
        if (response.data.success) {
          getTasks();
          toast.success("Task added successfully");
        }
      } catch (err) {
        toast.error("Something went wrong!");
      }
    }
    setTask("");
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/delete-task/${taskId}`
      );
      if (response.data.success) {
        toast.success("Task deleted successfully");
        getTasks();
      }
    } catch (err) {}
  };

  const handleChange = async (taskId, status) => {
    try {
      const data = {
        status: !status,
      };
      const response = await axios.put(
        `http://localhost:5000/api/update-task/${taskId}`,
        data
      );
      if (response.data.success) {
        getTasks();
        toast.success("Updated");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateTask = (taskId, task) => {
    setSaveBtn(!saveBtn);
    setTask(task);
    setTaskIdToUpdate(taskId);
  };

  const saveTask = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/update-task/${taskIdToUpdate}`,
        {
          task: task,
        }
      );
      if (response.data.success) {
        toast.success("Task Updated Successfully");
        getTasks();
      }
    } catch (err) {
      console.log(err);
    }
    setTask("");
    setSaveBtn(!saveBtn);
  };

  const getTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-tasks");

      if (response.data.success) {
        setTaskList(response.data.data);
        console.log(response.data.data);
      }
    } catch (err) {
      console.log("error");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="App">
      <h1>Personal Task Manager</h1>
      <section>
        <div className="container">
          <input
            className="todoinput"
            placeholder="eg. Write two assignments"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          {saveBtn ? (
            <button className="Save add" onClick={saveTask}>
              Save
            </button>
          ) : (
            <button className="add" onClick={addTask}>
              Add{" "}
            </button>
          )}
        </div>

        <div className="list">
          {/* List of Tasks */}
          {taskList.length === 0
            ? "Task list is Empty !"
            : taskList?.map((myTask) => (
                <div key={myTask.id} className="Added-Tasks">
                  <input
                    className="inputBoxCheck"
                    type="checkbox"
                    defaultChecked={myTask.status === 1 ? true : false}
                    checked={myTask.status === 1 ? true : false}
                    onChange={() => handleChange(myTask.id, myTask.status)}
                  />

                  <p
                    className={`task-des ${
                      myTask.status === 1 ? "completedLine" : ""
                    }`}
                  >
                    {myTask.task}
                  </p>
                  <div className="btns">
                    <button
                      className="read"
                      onClick={() => handleRead(myTask.task)}
                    >
                      Read
                    </button>
                    <button
                      className="edit"
                      onClick={() => updateTask(myTask.id, myTask.task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteTask(myTask.id)}
                    >
                      Delete
                    </button>
                  </div>
                  
                </div>
              ))}
        </div>
      </section>
      <Toaster />
      <Modal open={open} onClose={onCloseModal}>
        <h1>Task</h1>
        <p>{taskToRead}</p>
      </Modal>
    </div>
  );
}

export default App;
