import prisma from "./lib/prisma";

export interface CreatePatientInput {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
}

export async function createPatient(data: CreatePatientInput) {
  return await prisma.patient.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
    },
  });
}

export async function getPatient(id: number) {
  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
}

export async function searchPatients(nameFragment: string) {
  return await prisma.patient.findMany({
    where: {
      name: {
        contains: nameFragment,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function updatePatientPhone(id: number, phone: string) {
  return await prisma.patient.update({
    where: { id },
    data: { phone },
  });
}

export async function deletePatient(id: number) {
  return await prisma.patient.delete({
    where: { id },
  });
}
