const formatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

export const formattedDate = (date: string) => formatter.format(new Date(date));
