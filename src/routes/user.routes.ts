import {Router} from "express";
import { getStationStatsForUser } from "../controllers/user.controller";

const userRouter=Router();

userRouter.get("/stats/:stationId",getStationStatsForUser);

export default userRouter;
