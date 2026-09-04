import { createDoctor, getDoctor, listDoctorsBySpecialty, deleteDoctor } from "./doctors";
import { createPatient, getPatient, searchPatients, updatePatientPhone, deletePatient } from "./patients";
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  cancelAllPatientAppointments,
  deleteAppointment,
} from "./appointments";
import prisma from "./lib/prisma";

async function runTests() {
  console.log("--- Starting Tests ---");
  const timestamp = Date.now();

  // 1. Test Doctor
  const doctor = await createDoctor({
    name: "Dr. Ananya Roy",
    specialty: "Orthopedics",
    email: `ananya.${timestamp}@hospital.io`,
  });
  console.log("Created Doctor:", doctor.name, `(${doctor.specialty})`);

  // 2. Test Patient
  const patient = await createPatient({
    name: "Karan Johar",
    email: `karan.${timestamp}@example.com`,
    phone: "9123456780",
    dateOfBirth: new Date("1985-06-15"),
  });
  console.log("Created Patient:", patient.name);

  // 3. Test Booking Appointment
  const appointmentDate = new Date();
  appointmentDate.setHours(appointmentDate.getHours() + 48);

  const appointment = await bookAppointment({
    patientId: patient.id,
    doctorId: doctor.id,
    appointmentDate,
    notes: "Knee pain evaluation",
  });
  console.log("Booked Appointment ID:", appointment.id);

  // 4. Test Fetching Full Appointment
  const fullAppointment = await getAppointmentFull(appointment.id);
  console.log("Full Appointment fetched for:", fullAppointment.patient.name, "with", fullAppointment.doctor.name);

  // 5. Test Doctor Upcoming Appointments
  const upcoming = await getDoctorUpcomingAppointments(doctor.id);
  console.log("Upcoming appointments for doctor:", upcoming.length);

  // 6. Test Updating Patient Phone
  const updatedPatient = await updatePatientPhone(patient.id, "9998887770");
  console.log("Updated Patient Phone:", updatedPatient.phone);

  // 7. Test Search Patients & Doctors
  const foundPatients = await searchPatients("Karan");
  console.log("Found Patients matching 'Karan':", foundPatients.length);

  const foundDoctors = await listDoctorsBySpecialty("Ortho");
  console.log("Found Doctors matching 'Ortho':", foundDoctors.length);

  // 8. Test Status Update & Cancellation
  const updatedAppointment = await setAppointmentStatus(appointment.id, "cancelled");
  console.log("Updated Appointment Status:", updatedAppointment.status);

  console.log("--- Tests Completed Successfully ---");
}

runTests()
  .catch((e) => {
    console.error("Test failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
