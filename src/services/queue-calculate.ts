import { db }
from "../config/db";

import { bookings }
from "../db/schema";

import {
  and,
  asc,
  eq,
} from "drizzle-orm";

import {
  emitQueueUpdate,
} from "../utils/socket-events";

export async function recalculateQueue(
  stationId: string
) {

  const pendingBookings =
    await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(
            bookings.stationId,
            stationId
          ),

          eq(
            bookings.status,
            "PENDING"
          )
        )
      )
      .orderBy(
        asc(
          bookings.queueNumber
        )
      );

  for (
    let i = 0;
    i < pendingBookings.length;
    i++
  ) {

    const booking =
      pendingBookings[i];

    const carsAhead = i;

    await emitQueueUpdate(
      booking.id,
      carsAhead
    );
  }
}