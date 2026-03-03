export const getVenezuelaTime = () => {
  const now = new Date();

  const caracasString = now.toLocaleString("en-US", {
    timeZone: "America/Caracas",
  });

  return new Date(caracasString);
};

export const formatVenezuelaDate = (date: Date, time?: boolean) => {
  return new Intl.DateTimeFormat("es-VE", {
    dateStyle: "full",
    timeZone: "America/Caracas",
    timeStyle: time ? "short" : undefined,
  }).format(date);
};
