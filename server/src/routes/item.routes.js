import express from "express";
import {
  createItem,
  getItems as getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/item.controller.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
