import Project from "../models/Project.js";
import Task from "../models/Task.js";

// @desc    Get all projects for the logged in user
// @route   GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const projectQuery = Project.find({ createdBy: req.user._id });
    const populatedQuery = projectQuery?.populate
      ? projectQuery.populate("tasks")
      : projectQuery;
    const sortedQuery = populatedQuery?.sort
      ? populatedQuery.sort({ createdAt: -1 })
      : populatedQuery;
    const projects = await sortedQuery;
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = new Project({
      name,
      description,
      createdBy: req.user._id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this project" });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project and its associated tasks
// @route   DELETE /api/projects/:projectId
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    // Delete tasks belonging to this project
    await Task.deleteMany({ project: req.params.projectId });
    await project.deleteOne();

    res.json({ message: "Project and associated tasks removed successfully" });
  } catch (error) {
    res;
    next(error);
  }
};
