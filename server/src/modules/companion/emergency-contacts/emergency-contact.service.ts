import { emergencyContactRepository } from "../shared/repository";

export const listEmergencyContacts = async (userId: string) =>
  emergencyContactRepository.list(userId);

export const createEmergencyContact = async (
  userId: string,
  input: { name: string; phone: string; relation: string },
) =>
  emergencyContactRepository.create(userId, input.name, input.phone, input.relation);

export const updateEmergencyContact = async (
  userId: string,
  id: string,
  input: Partial<{ name: string; phone: string; relation: string }>,
) => {
  await emergencyContactRepository.update(id, input);
  return emergencyContactRepository.getById(id, userId);
};

export const deleteEmergencyContact = async (userId: string, id: string) =>
  emergencyContactRepository.delete(id, userId);
