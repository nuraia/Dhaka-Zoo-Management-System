export function toPublicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role.toLowerCase(),
    createdAt: user.createdAt,
  };
}

export function normalizeEnum(value) {
  return String(value || "").trim().toUpperCase();
}
