import Task from "../models/Task.js";
import Project from "../models/Project.js";

// @desc    Get all tasks for the logged in user
// @route   GET /api/tasks
export const getTasks = async (req, res, next) => {
  try {
    const projectId = req.params.projectId ?? req.params.id;
    const taskQuery = Task.find({ projectId });
    const populatedQuery = taskQuery?.populate
      ? taskQuery
          .populate("assignedTo", "name email avatar")
          .populate("project", "name")
      : taskQuery;
    const sortedQuery = populatedQuery?.sort
      ? populatedQuery.sort({ createdAt: -1 })
      : populatedQuery;
    const tasks = await sortedQuery;

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, tags, assignedTo } = req.body;

    const project = req.params.projectId ?? req.params.id;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      project,
      tags: tags || [],
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    await Project.findByIdAndUpdate(project, {
      $push: { tasks: createdTask._id },
    });

    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (e.g., move column/status)
// @route   PUT /api/projects/:projectId/tasks/:taskId
export const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId ?? req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
        new: true,
      });
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json(updatedTask);
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      {
        new: true,
      },
    );

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
export const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId ?? req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      const deletedTask = await Task.findByIdAndDelete(taskId);
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json({ message: "Task removed successfully" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id },
    });

    await task.deleteOne();
    res.json({ message: "Task removed successfully" });
  } catch (error) {
    next(error);
  }
};
