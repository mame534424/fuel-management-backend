import { Request,Response } from "express";
import { db } from "../config/db";
import { bookings, fuelTypes, stations,stationFuel} from "../db/schema";
import { and, asc, eq, sql } from "drizzle-orm";


export async function getStationStatsForUser(req:Request,res:Response){
    try {
           const stationId=req.params.stationId as string;
            // get the station managed by this sub admin
            const station=await db.select().from(stations).where(eq(stations.id, stationId));
            if(station.length===0){
                return res.status(404).json({message:"Station not found"});
            }
            const stationName=station[0].name;

            const stationFuels=await db.select({
                fuelTypeId:fuelTypes.id,
                fuelTypeName:fuelTypes.name,
                quantity:stationFuel.quantity,
                isAvailable:stationFuel.isAvailable,
                updatedAt:stationFuel.updatedAt
            }).from(stationFuel).innerJoin(fuelTypes, eq(stationFuel.fuelTypeId, fuelTypes.id)).where(eq(stationFuel.stationId, stationId));
           const pendingBookings = await db.select({
                count: sql<number>`count(*)`,
                })
                .from(bookings)
                .where(
                and(
                    eq(bookings.stationId, stationId),
                    eq(bookings.status, "PENDING")
                )
                );
    
            res.status(200).json({stationId,stationName,fuels:stationFuels, bookings:pendingBookings});
        }
        catch (error) {
            console.error("Error in getStationStatus:", error);
            res.status(500).json({message:"Internal Server Error"});
        }
    }
