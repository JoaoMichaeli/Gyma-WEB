"use server";

import { Plano } from "@/type";

function authHeader(email: string, senha: string): Headers {
  const basic = Buffer.from(`${email}:${senha}`).toString("base64");
  return new Headers({
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/json",
  });
}

export async function getPlanos(email: string, senha: string): Promise<Plano[]> {
  const res = await fetch("http://localhost:8080/plans", {
    method: "GET",
    headers: authHeader(email, senha),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erro ao buscar planos:", res.statusText);
    throw new Error("Erro ao buscar planos");
  }

  const data = await res.json();
  return data.content;
}

export async function createPlano(plano: Partial<Plano>, email: string, senha: string): Promise<Plano> {
  const res = await fetch("http://localhost:8080/plans", {
    method: "POST",
    headers: authHeader(email, senha),
    body: JSON.stringify(plano),
  });

  if (!res.ok) {
    console.error("Erro ao criar plano:", await res.text());
    throw new Error("Erro ao criar plano");
  }

  return await res.json();
}

export async function deletePlano(id: number, email: string, senha: string): Promise<void> {
  const res = await fetch(`http://localhost:8080/plans/${id}`, {
    method: "DELETE",
    headers: authHeader(email, senha),
  });

  if (!res.ok) {
    console.error("Erro ao deletar plano:", await res.text());
    throw new Error("Erro ao deletar plano");
  }
}

export async function updatePlano(id: number, plano: Partial<Plano>, email: string, senha: string): Promise<Plano> {
  const res = await fetch(`http://localhost:8080/plans/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${email}:${senha}`),
    },
    body: JSON.stringify(plano),
  });

  if (!res.ok) {
    console.error("Erro ao atualizar plano:", await res.text());
    throw new Error("Erro ao atualizar plano");
  }

  return await res.json();
}

