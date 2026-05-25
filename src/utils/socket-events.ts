import { io } from "../index";

export async function emitQueueUpdate(
  bookingId: string,
  carsAhead: number
) {

  io.to(`booking:${bookingId}`)
    .emit(
      "queue_updated",
      {
        bookingId,
        carsAhead,
      }
    );
}

export async function emitBookingCalled(
  bookingId: string
) {

  io.to(`booking:${bookingId}`)
    .emit(
      "booking_called",
      {
        bookingId,
        status: "CALLED",
      }
    );
}

export async function emitBookingCompleted(
  bookingId: string
) {

  io.to(`booking:${bookingId}`)
    .emit(
      "booking_completed",
      {
        bookingId,
        status: "COMPLETED",
      }
    );
}

export async function emitBookingCancelled(
  bookingId: string
) {

  io.to(`booking:${bookingId}`)
    .emit(
      "booking_cancelled",
      {
        bookingId,
        status: "CANCELLED",
      }
    );
}