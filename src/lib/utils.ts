import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Junta classes com suporte a condições e resolve conflitos de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata uma data no padrão brasileiro: "22 de abril de 2025"
export function formatDateBrazil(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
}

// Transforma texto em slug: "Clínica Médica → clinica-medica"
export function slugify(text: string): string {
  return text
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

// Capitaliza a primeira letra de uma string: "neurologia" → "Neurologia"
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
