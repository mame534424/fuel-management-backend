import {Request,Response} from "express";
import { db } from "../config/db";
import { stations } from "../db/schema";
import { sql } from "drizzle-orm";

import {AuthenticatedRequest} from "../middleware/auth.middleware";

export async function createStation(req:AuthenticatedRequest,res:any){
    try {
        const {name,latitude,longitude,code}=req.body;
        if(!name || !latitude || !longitude || !code){
            return res.status(400).json({message:"All fields are required"});
        }
        const station=await db.insert(stations).values({
            name,
            latitude,
            longitude,
            code
        }).returning();
        res.status(201).json({message:"Station created successfully",station:station[0]});
    } catch (error) {
        console.error("Error in createStation:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getNearbyStations(req:Request,res:any){
    try {
        const {latitude,longitude}=req.query;
        if(!latitude || !longitude){
            return res.status(400).json({message:"Latitude and Longitude are required"});
        }
        const nearbyStations=await db.select().from(stations).where(sql`
        (
        POWER(${stations.latitude} - ${Number(latitude)}, 2)
        +
        POWER(${stations.longitude} - ${Number(longitude)}, 2)
        ) < 0.1 
        `).orderBy(sql`
        (
        POWER(${stations.latitude} - ${Number(latitude)}, 2)
        +
        POWER(${stations.longitude} - ${Number(longitude)}, 2)
        )
        `);
        // will be changed into 0.01 in production
        res.status(200).json(nearbyStations);
    } catch (error) {
        console.error("Error in getNearbyStations:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
