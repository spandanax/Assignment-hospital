import prisma from "./lib/prisma";

export interface CreateDoctorInput {
  name: string;
  specialty: string;
  email: string;
}

export async function createDoctor(data: CreateDoctorInput) {
  return await prisma.doctor.create({
    data: {
      name: data.name,
      specialty: data.specialty,
      email: data.email,
    },
  });
}

export async function getDoctor(id: number) {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return doctor;
}

export async function listDoctorsBySpecialty(specialtyFragment: string) {
  return await prisma.doctor.findMany({
    where: {
      specialty: {
        contains: specialtyFragment,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function updateDoctor(
  id: number,
  data: Partial<Pick<CreateDoctorInput, "name" | "specialty" | "email">>
) {
  return await prisma.doctor.update({
    where: { id },
    data,
  });
}

export async function deleteDoctor(id: number) {
  return await prisma.doctor.delete({
    where: { id },
  });
}
