import { Request, Response } from "express";
import Consult from "../models/Consult";

export const submitConsult = async (req: Request, res: Response) => {
  try {
    const consult = new Consult({
      fullName: req.body?.userDetails.fullName,
      email: req.body?.userDetails.email,
      phone: req.body?.userDetails.phone,
      dateOfBirth: req.body?.userDetails.dateOfBirth,
      responses: req.body.responses,
      timezone: req.body.timezone,
      submittedAt: new Date(),
    });

    await consult.save();

    res.status(201).json({
      message: "Consult submission successful",
      data: {
        id: consult._id,
        fullName: consult.fullName,
        email: consult.email,
        submittedAt: consult.submittedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to submit consult",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getConsults = async (req: Request, res: Response) => {
  try {
    const consults = await Consult.find().sort({ submittedAt: -1 });
    res.status(200).json(consults);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch consults",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
