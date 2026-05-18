import {Router} from "express";
import { createStation, getNearbyStations } from "../controllers/station.controller";
import { authorize, protect } from "../middleware/auth.middleware";
const stationRouter=Router();

stationRouter.post("/create",protect,authorize("admin"),createStation);
stationRouter.get("/nearby",getNearbyStations);

export default stationRouter;
