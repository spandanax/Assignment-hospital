import prisma from "./lib/prisma";

export async function main() {
  console.log("Seeding database...");

  // 1. Clear existing appointments, patients, and doctors
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  // 2. Seed Doctors
  const doctorPriya = await prisma.doctor.create({
    data: {
      name: "Dr. Priya Sharma",
      specialty: "Cardiology",
      email: "priya.sharma@hospital.io",
    },
  });

  const doctorVikram = await prisma.doctor.create({
    data: {
      name: "Dr. Vikram Rao",
      specialty: "Neurology",
      email: "vikram.rao@hospital.io",
    },
  });

  // 3. Seed Patients
  const patientAditi = await prisma.patient.create({
    data: {
      name: "Aditi Mehra",
      email: "aditi@example.com",
      phone: "9876543210",
      dateOfBirth: new Date("1990-04-12"),
    },
  });

  const patientRahul = await prisma.patient.create({
    data: {
      name: "Rahul Singh",
      email: "rahul@example.com",
    },
  });

  // 4. Seed Appointment (24 hours from current time)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.appointment.create({
    data: {
      patientId: patientAditi.id,
      doctorId: doctorPriya.id,
      appointmentDate: tomorrow,
      status: "scheduled",
      notes: "Regular checkup",
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
