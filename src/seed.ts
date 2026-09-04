import prisma from "./lib/prisma";

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  const drPriya = await prisma.doctor.create({
    data: {
      name: "Dr. Priya Sharma",
      specialty: "Cardiology",
      email: "priya.sharma@hospital.io",
    },
  });

  const drVikram = await prisma.doctor.create({
    data: {
      name: "Dr. Vikram Rao",
      specialty: "Neurology",
      email: "vikram.rao@hospital.io",
    },
  });

  const aditi = await prisma.patient.create({
    data: {
      name: "Aditi Mehra",
      email: "aditi@example.com",
      phone: "9876543210",
      dateOfBirth: new Date("1990-04-12"),
    },
  });

  const rahul = await prisma.patient.create({
    data: {
      name: "Rahul Singh",
      email: "rahul@example.com",
    },
  });

  await prisma.appointment.create({
    data: {
      appointmentDate: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
      status: "scheduled",
      notes: "Regular checkup",
      patient: {
        connect: { id: aditi.id },
      },
      doctor: {
        connect: { id: drPriya.id },
      },
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
