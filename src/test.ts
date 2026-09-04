import { createPatient } from "./patients";
import { createDoctor } from "./doctors";
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
} from "./appointments";
import prisma from "./lib/prisma";

async function runTests() {
  console.log("--- Starting Tests ---");

  const doc = await createDoctor({
    name: "Dr. Test",
    specialty: "Dermatology",
    email: `test.doc.${Date.now()}@hospital.io`,
  });

  console.log("Created Doctor:", doc.name);

  const pat = await createPatient({
    name: "Test Patient",
    email: `test.pat.${Date.now()}@example.com`,
  });

  console.log("Created Patient:", pat.name);

  const appt = await bookAppointment(
    pat.id,
    doc.id,
    new Date(Date.now() + 86400000),
    "Skin checkup"
  );

  console.log("Booked Appointment ID:", appt.id);

  const fullAppt = await getAppointmentFull(appt.id);

  console.log(
    "Full Appointment fetched for:",
    fullAppt.patient.name
  );

  const upcoming = await getDoctorUpcomingAppointments(doc.id);

  console.log(
    "Upcoming appointments for doctor:",
    upcoming.length
  );

  console.log("--- Tests Completed Successfully ---");
}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
