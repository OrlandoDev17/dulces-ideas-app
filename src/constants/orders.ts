import { Phone, User } from "lucide-react";

export const TIME_SLOTS: string[] = [];
for (let hour = 10; hour <= 21; hour++) {
  for (let min = 0; min < 60; min += 30) {
    if (hour === 21 && min > 0) continue;
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? "pm" : "am";
    const minStr = min === 0 ? "00" : "30";
    TIME_SLOTS.push(`${hour12}:${minStr} ${ampm}`);
  }
}

export const CLIENT_FORM_FIELDS = [
  {
    name: "name",
    label: "Nombre del cliente",
    type: "text",
    icon: User,
    placeholder: "Ej. Jhon Doe",
  },
  {
    name: "phone",
    label: "Teléfono del cliente",
    type: "text",
    icon: Phone,
    placeholder: "Ej. 0412-1234567",
  },
];
