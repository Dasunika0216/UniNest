import Host from "../models/host.model.js";
import { sendSMS } from '../config/twilio.js';

export const getAllHosts = async (req, res, next) => {
  try {
    const hosts = await Host.find();

    res.status(200).json({
      status: "success",
      data: hosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingHosts = async (req, res, next) => {
  try {
    const pendingHosts = await Host.find({ status: "pending" });

    res.status(200).json({
      status: "success",
      data: pendingHosts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHostStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      const error = new Error(
        "Invalid status. Must be pending, approved, or rejected"
      );
      error.statusCode = 400;
      throw error;
    }

    const host = await Host.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!host) {
      const error = new Error("Host not found");
      error.statusCode = 404;
      throw error;
    }

    if (status === 'approved') {
      try {
        console.log("Attempting to send SMS to", host.phone);
        await sendSMS(host.phone, "Congratulations! Your UniNest host account has been approved.");
        console.log("SMS send attempt finished");
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
      }
    }

    res.status(200).json({
      status: "success",
      message: `Host status updated to ${status}`,
      data: host,
    });
  } catch (error) {
    next(error);
  }
};

export const getHostById = async (req, res, next) => {
  try {
    const host = await Host.findById(req.params.id).select("-password");

    if (!host) {
      const error = new Error("host not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: "success",
      data: host,
    });
  } catch (error) {
    next(error);
  }
};
