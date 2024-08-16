const express = require("express");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controller/leadController");

const leadRoutes = express.Router();

// Route to create a new lead
leadRoutes.post("/", createLead);

// Route to get all leads
leadRoutes.get("/", getLeads);

// Route to get a single lead by ID
leadRoutes.get("/:id", getLeadById);

// Route to update a lead by ID
leadRoutes.patch("/:id", updateLead);

// Route to delete a lead by ID
leadRoutes.delete("/:id", deleteLead);

module.exports = leadRoutes;
