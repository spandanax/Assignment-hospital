import assert from "node:assert/strict";
import { createDoctor, getDoctor, listDoctorsBySpecialty, updateDoctor, deleteDoctor } from "./doctors";
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
  assert.equal((await getDoctor(doctor.id)).email, doctor.email);
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
  assert.equal(fullAppointment.patient.id, patient.id);
  assert.equal(fullAppointment.doctor.id, doctor.id);
  console.log("Full Appointment fetched for:", fullAppointment.patient.name, "with", fullAppointment.doctor.name);

  // 5. Test Doctor Upcoming Appointments
  const upcoming = await getDoctorUpcomingAppointments(doctor.id);
  assert.equal(upcoming.length, 1);
  console.log("Upcoming appointments for doctor:", upcoming.length);

  // 6. Test Updating Patient Phone
  const updatedPatient = await updatePatientPhone(patient.id, "9998887770");
  assert.equal(updatedPatient.phone, "9998887770");
  console.log("Updated Patient Phone:", updatedPatient.phone);

  const updatedDoctor = await updateDoctor(doctor.id, { specialty: "Sports Medicine" });
  assert.equal(updatedDoctor.specialty, "Sports Medicine");
  console.log("Updated Doctor Specialty:", updatedDoctor.specialty);

  // 7. Test Search Patients & Doctors
  const foundPatients = await searchPatients("Karan");
  assert.equal(foundPatients.some((foundPatient) => foundPatient.id === patient.id), true);
  console.log("Found Patients matching 'Karan':", foundPatients.length);

  const foundDoctors = await listDoctorsBySpecialty("Ortho");
  assert.equal(foundDoctors.some((foundDoctor) => foundDoctor.id === doctor.id), false);
  console.log("Found Doctors matching 'Ortho':", foundDoctors.length);

  // 8. Test Status Update & Cancellation
  const updatedAppointment = await setAppointmentStatus(appointment.id, "cancelled");
  assert.equal(updatedAppointment.status, "cancelled");
  console.log("Updated Appointment Status:", updatedAppointment.status);

  assert.equal(await cancelAllPatientAppointments(patient.id), 0);
  await deleteAppointment(appointment.id);
  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);
  await assert.rejects(() => getPatient(patient.id), /Patient not found/);
  await assert.rejects(() => getDoctor(doctor.id), /Doctor not found/);
  console.log("Deleted test appointment, patient, and doctor");

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
