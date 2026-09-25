import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

// @desc    Get all projects for the logged in user
// @route   GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const projectQuery = Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    });
    const populatedQuery = projectQuery?.populate
      ? projectQuery.populate({
          path: "tasks",
          populate: { path: "assignedTo", select: "_id username email" },
        })
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
  const email = req.body?.email?.trim().toLowerCase();

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the project owner can invite members" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }

    const alreadyMember =
      project.createdBy.toString() === userToInvite._id.toString() ||
      (project.members || []).some(
        (memberId) => memberId.toString() === userToInvite._id.toString(),
      );

    if (alreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this project" });
    }

    const alreadyInvited = (project.pendingInvitations || []).some(
      (invitation) => invitation.email === email,
    );

    if (alreadyInvited) {
      return res.status(400).json({
        message: "Invitation already sent to this user",
        invitation: {
          email,
          status: "pending",
        },
      });
    }

    const newInvitation = {
      email,
      status: "pending",
      invitedBy: req.user._id,
      invitedAt: new Date(),
    };

    if (!project.pendingInvitations) {
      project.pendingInvitations = [];
    }

    project.pendingInvitations.push(newInvitation);
    await project.save();

    res.json({
      message: "Invitation sent successfully",
      invitation: {
        email: newInvitation.email,
        status: newInvitation.status,
      },
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

    const owner = await User.findById(project.createdBy).select(
      "_id username email",
    );
    const members = [owner, ...project.members].filter(Boolean);
    res.json(
      members.filter(
        (member, index, allMembers) =>
          allMembers.findIndex((candidate) =>
            candidate._id.equals(member._id),
          ) === index,
      ),
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching project members" });
  }
};
