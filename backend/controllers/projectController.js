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
  console.log("--> 1. Body recibido:", req.body);
  console.log("--> 2. Usuario descodificado en req.user:", req.user);
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      console.log("--> ERROR: No hay userId en req.user");
      return res.status(401).json({ message: "User not authenticated" });
    }
    const project = new Project({
      name,
      description,
      createdBy: userId,
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
export const inviteMember = async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }

    if (project.members.includes(userToInvite._id)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this project" });
    }

    project.members.push(userToInvite._id);
    await project.save();

    res.json({
      message: "Member added successfully",
      user: {
        _id: userToInvite._id,
        username: userToInvite.username,
        email: userToInvite.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error inviting member" });
  }
};

export const getProjectMembers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate(
      "members",
      "_id username email",
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project.members);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching project members" });
  }
};
