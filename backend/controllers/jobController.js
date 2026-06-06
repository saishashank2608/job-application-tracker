const Application = require("../models/application");

const createJob = async (req, res) => {
    try{
        const {company, role, status, applicationDate, notes} = req.body;

        const application = await Application.create({
            company,
            role,
            status,
            applicationDate,
            notes,
            userId: req.user.userId,
        });

        res.status(201).json({
            message: "Job application created successfully",
            application,
        });
    } catch(error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// Get all job applications for the logged-in user api

const getJobs = async(req, res) => {
    try{
        const jobs = await Application.find({
            userId: req.user.userId,
        });
        res.status(200).json(jobs);
    } catch(error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// update job application status api

const updateJob = async(req, res) => {
    try{
        const updatedJob = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Job application updated successfully",
            updatedJob,
        });
    } catch(error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}

// Delete job application api

const deleteJob = async(req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Job application deleted successfully",
        });
    } catch(error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}

// Job analytics api

const getStats = async(req, res) => {
    try{
        const jobs = await Application.find({
            userId: req.user.userId,
        });

        const total = jobs.length;

        // Normalize status strings for robust counting (case-insensitive, trimmed)
        let applied = 0;
        let interviewScheduled = 0;
        let selected = 0;
        let rejected = 0;
        let offered = 0;

        jobs.forEach((job) => {
            const s = (job.status || "").toString().toLowerCase().trim();
            if (!s) return;
            if (s === "applied") applied += 1;
            else if (s === "interview scheduled" || s === "interviewscheduled" || s === "interview") interviewScheduled += 1;
            else if (s === "selected") selected += 1;
            else if (s === "rejected") rejected += 1;
            else if (s === "offered" || s === "offer") offered += 1;
        });

        // Expose an `offered` count as well; frontend will treat missing keys as 0.
        res.status(200).json({
            total,
            applied,
            interviewScheduled,
            selected,
            rejected,
            offered,
        });
    } catch(error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}


module.exports = {
    createJob,
    getJobs,
    updateJob,
    deleteJob,
    getStats,
};