export async function getUsers() {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("failed");
  return res.json();
}

export async function createUser(email, password) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("failed");
  return res.json();
}
